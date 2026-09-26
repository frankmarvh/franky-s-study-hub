import {
  supabase,
} from "@/integrations/supabase/client";

import type {
  LearningMaterial,
  SavedMaterial,
} from "@/types/material";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "/api";

export async function searchMaterials(
  query: string,
): Promise<LearningMaterial[]> {
  const cleanQuery =
    query.trim();

  if (!cleanQuery) {
    return [];
  }

  const {
    data: {
      session,
    },
  } =
    await supabase.auth.getSession();

  const response =
    await fetch(
      `${API_URL}/materials/search?q=${encodeURIComponent(
        cleanQuery,
      )}`,
      {
        headers: {
          Authorization:
            `Bearer ${
              session?.access_token || ""
            }`,
        },
      },
    );

  const data =
    await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Unable to search materials.",
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
      "You must be logged in.",
    );
  }

  const {
    error,
  } = await supabase
    .from("saved_materials")
    .upsert(
      {
        user_id: user.id,

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

        ignoreDuplicates: true,
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
  } = await supabase
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
  } = await supabase
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
