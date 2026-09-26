export type MaterialSource =
  | "OpenStax"
  | "MIT OpenCourseWare"
  | "LibreTexts"
  | "Other OER";

export type MaterialType =
  | "textbook"
  | "course"
  | "lecture-notes"
  | "video"
  | "assignment"
  | "exam"
  | "reference";

export interface LearningMaterial {
  id: string;

  title: string;

  description: string;

  subject: string;

  source: MaterialSource;

  type: MaterialType;

  url: string;

  thumbnail?: string;

  author?: string;

  license?: string;

  institution?: string;

  topics?: string[];
}

export interface SavedMaterial {
  id: string;

  user_id: string;

  title: string;

  description: string | null;

  source: string;

  source_url: string;

  subject: string | null;

  resource_type: string | null;

  license: string | null;

  thumbnail_url: string | null;

  created_at: string;
}
