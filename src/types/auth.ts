export type UserRole = "user" | "admin";

export interface UserProfile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  university: string | null;
  course: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface AuthUser {
  id: string;
  email: string | null;
  profile: UserProfile | null;
  role: UserRole;
}
