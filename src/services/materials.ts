import { supabase } from "@/integrations/supabase/client";

import type {
  Material,
  MaterialFilters,
  MaterialInsert,
} from "@/types/material";

export async function getMaterials(
  filters: MaterialFilters = {},
): Promise<Material[]> {
  let query = supabase
    .from("materials")
    .select("*")
    .eq("is_published", true)
    .order("created_at", {
      ascending: false,
    });

  if (filters.university) {
    query = query.eq(
      "university",
      filters.university,
    );
  }

  if (filters.course) {
    query = query.eq(
      "course",
      filters.course,
    );
  }

  if (filters.materialType) {
    query = query.eq(
      "material_type",
      filters.materialType,
    );
  }

  if (filters.year) {
    query = query.eq(
      "year_of_study",
      filters.year,
    );
  }

  if (filters.semester) {
    query = query.eq(
      "semester",
      filters.semester,
    );
  }

  if (filters.search?.trim()) {
    const search = filters.search
      .trim()
      .replace(/[%_,()]/g, " ");

    query = query.or(
      [
        `title.ilike.%${search}%`,
        `unit_name.ilike.%${search}%`,
        `unit_code.ilike.%${search}%`,
        `course.ilike.%${search}%`,
        `university.ilike.%${search}%`,
      ].join(","),
    );
  }

  const {
    data,
    error,
  } = await query;

  if (error) {
    throw error;
  }

  return (data ?? []) as Material[];
}

export async function getMaterialById(
  id: string,
): Promise<Material | null> {
  const {
    data,
    error,
  } = await supabase
    .from("materials")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data as Material | null;
}

export async function createMaterial(
  material: MaterialInsert,
): Promise<Material> {
  const {
    data,
    error,
  } = await supabase
    .from("materials")
    .insert(material)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data as Material;
}

export async function updateMaterial(
  id: string,
  updates: Partial<MaterialInsert>,
): Promise<Material> {
  const {
    data,
    error,
  } = await supabase
    .from("materials")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data as Material;
}

export async function deleteMaterial(
  id: string,
): Promise<void> {
  const material =
    await getMaterialById(id);

  if (
    material?.file_path
  ) {
    const {
      error: storageError,
    } = await supabase.storage
      .from("materials")
      .remove([
        material.file_path,
      ]);

    if (storageError) {
      console.error(
        "Unable to remove material file:",
        storageError,
      );
    }
  }

  const {
    error,
  } = await supabase
    .from("materials")
    .delete()
    .eq("id", id);

  if (error) {
    throw error;
  }
}

export async function uploadMaterialFile(
  file: File,
): Promise<string> {
  const {
    data: {
      user,
    },
    error: userError,
  } = await supabase.auth.getUser();

  if (
    userError ||
    !user
  ) {
    throw new Error(
      "You must be logged in to upload files.",
    );
  }

  const extension =
    file.name
      .split(".")
      .pop()
      ?.toLowerCase() || "file";

  const safeName =
    file.name
      .replace(/\.[^/.]+$/, "")
      .replace(/[^a-zA-Z0-9-_]/g, "-")
      .replace(/-+/g, "-")
      .toLowerCase();

  const path =
    `${user.id}/${crypto.randomUUID()}-${safeName}.${extension}`;

  const {
    error,
  } = await supabase.storage
    .from("materials")
    .upload(
      path,
      file,
      {
        cacheControl: "3600",
        upsert: false,
      },
    );

  if (error) {
    throw error;
  }

  return path;
}

export async function getMaterialSignedUrl(
  filePath: string,
): Promise<string> {
  const {
    data,
    error,
  } = await supabase.storage
    .from("materials")
    .createSignedUrl(
      filePath,
      60 * 10,
    );

  if (error) {
    throw error;
  }

  if (!data?.signedUrl) {
    throw new Error(
      "Unable to create material URL.",
    );
  }

  return data.signedUrl;
}
