export type MaterialType =
  | "notes"
  | "past_paper"
  | "assignment"
  | "revision"
  | "book"
  | "other";

export interface Material {
  id: string;

  title: string;
  description: string | null;

  university: string;
  course: string;

  unit_code: string | null;
  unit_name: string;

  year_of_study: number | null;
  semester: number | null;

  material_type: MaterialType;

  file_path: string | null;
  external_url: string | null;

  content: string | null;

  is_published: boolean;

  created_by: string | null;

  created_at: string;
  updated_at: string;
}

export interface MaterialFilters {
  search?: string;
  university?: string;
  course?: string;
  materialType?: MaterialType | "";
  year?: number | null;
  semester?: number | null;
}

export interface MaterialInsert {
  title: string;
  description?: string | null;

  university: string;
  course: string;

  unit_code?: string | null;
  unit_name: string;

  year_of_study?: number | null;
  semester?: number | null;

  material_type: MaterialType;

  file_path?: string | null;
  external_url?: string | null;

  content?: string | null;

  is_published?: boolean;

  created_by?: string | null;
}
