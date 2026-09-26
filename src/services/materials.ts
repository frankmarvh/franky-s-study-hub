import {
  supabase,
} from "@/integrations/supabase/client";

import type {
  LearningMaterial,
  MaterialSearchResponse,
  RecommendedMaterialsResponse,
  SavedMaterial,
  SearchHistoryItem,
} from "@/types/material";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "/api";

async function getAccessToken() {
  const {
    data: {
      session,
    },
    error,
  } =
    await supabase.auth.getSession();

  if (error) {
    throw error;
  }

  if (!session?.access_token) {
    throw new Error(
      "Your session has expired. Please sign in again.",
    );
  }

  return session.access_token;
}

export async function searchMaterials(
  query: string,
): Promise<LearningMaterial[]> {
  const cleanQuery =
    query.trim();

  if (
    cleanQuery.length < 2
  ) {
    return [];
  }

  const token =
    await getAccessToken();

  const response =
    await fetch(
      `${API_URL}/materials/search?q=${encodeURIComponent(
        cleanQuery,
      )}`,
      {
        method: "GET",

        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      },
    );

  const data =
    (await response.json()) as
      Partial<MaterialSearchResponse> & {
        message?: string;
      };

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Unable to search learning materials.",
    );
  }

  return data.materials ?? [];
}

export async function getRecommendedMaterials():
Promise<LearningMaterial[]> {
  const token =
    await getAccessToken();

  const response =
    await fetch(
      `${API_URL}/materials/recommended`,
      {
        method: "GET",

        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      },
    );

  const data =
    (await response.json()) as
      Partial<RecommendedMaterialsResponse> & {
        message?: string;
      };

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Unable to load recommendations.",
    );
  }

  return data.materials ?? [];
}

export async function saveMaterial(
  material: LearningMaterial,
): Promise<void> {
  const {
    data: {
      user,
    },
    error: userError,
  } =
    await supabase.auth.getUser();

  if (
    userError ||
    !user
  ) {
    throw new Error(
      "You must be signed in to save materials.",
    );
  }

  const {
    error,
  } =
    await supabase
      .from("saved_materials")
      .upsert(
        {
          user_id:
            user.id,

          title:
            material.title,

          description:
            material.description,

          source:
            material.source,

          source_url:
            material.url,

          subject:
            material.subject,

          resource_type:
            material.type,

          license:
            material.license ??
            null,

          thumbnail_url:
            material.thumbnail ??
            null,
        },
        {
          onConflict:
            "user_id,source_url",

          ignoreDuplicates:
            true,
        },
      );

  if (error) {
    throw error;
  }
}

export async function getSavedMaterials():
Promise<SavedMaterial[]> {
  const {
    data,
    error,
  } =
    await supabase
      .from("saved_materials")
      .select("*")
      .order(
        "created_at",
        {
          ascending: false,
        },
      );

  if (error) {
    throw error;
  }

  return (
    data ?? []
  ) as SavedMaterial[];
}

export async function removeSavedMaterial(
  id: string,
): Promise<void> {
  const {
    error,
  } =
    await supabase
      .from("saved_materials")
      .delete()
      .eq(
        "id",
        id,
      );

  if (error) {
    throw error;
  }
}

export async function getSearchHistory():
Promise<SearchHistoryItem[]> {
  const {
    data,
    error,
  } =
    await supabase
      .from("material_searches")
      .select("*")
      .order(
        "created_at",
        {
          ascending: false,
        },
      )
      .limit(10);

  if (error) {
    throw error;
  }

  return (
    data ?? []
  ) as SearchHistoryItem[];
}

export async function clearSearchHistory():
Promise<void> {
  const {
    data: {
      user,
    },
    error: userError,
  } =
    await supabase.auth.getUser();

  if (
    userError ||
    !user
  ) {
    throw new Error(
      "You must be signed in.",
    );
  }

  const {
    error,
  } =
    await supabase
      .from("material_searches")
      .delete()
      .eq(
        "user_id",
        user.id,
      );

  if (error) {
    throw error;
  }
}

export function savedMaterialToLearningMaterial(
  material: SavedMaterial,
): LearningMaterial {
  return {
    id:
      material.id,

    title:
      material.title,

    description:
      material.description ||
      "Saved learning resource.",

    subject:
      material.subject ||
      "General",

    source:
      normalizeSource(
        material.source,
      ),

    type:
      normalizeType(
        material.resource_type,
      ),

    url:
      material.source_url,

    thumbnail:
      material.thumbnail_url ||
      undefined,

    license:
      material.license ||
      undefined,
  };
}

function normalizeSource(
  source: string,
): LearningMaterial["source"] {
  if (
    source === "OpenStax" ||
    source ===
      "MIT OpenCourseWare" ||
    source === "LibreTexts"
  ) {
    return source;
  }

  return "Other OER";
}

function normalizeType(
  type: string | null,
): LearningMaterial["type"] {
  const allowed:
    LearningMaterial["type"][] =
    [
      "textbook",
      "course",
      "lecture-notes",
      "video",
      "assignment",
      "exam",
      "reference",
    ];

  if (
    type &&
    allowed.includes(
      type as LearningMaterial["type"],
    )
  ) {
    return type as LearningMaterial["type"];
  }

  return "reference";
}
