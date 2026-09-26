import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type {
  Session,
  User,
} from "@supabase/supabase-js";

import { supabase } from "@/integrations/supabase/client";

import type {
  UserProfile,
  UserRole,
} from "@/types/auth";

interface SignUpInput {
  fullName: string;
  email: string;
  password: string;
}

interface AuthContextValue {
  user: User | null;
  session: Session | null;

  profile: UserProfile | null;

  role: UserRole;

  isAdmin: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;

  signIn: (
    email: string,
    password: string,
  ) => Promise<void>;

  signUp: (
    input: SignUpInput,
  ) => Promise<{
    requiresEmailConfirmation: boolean;
  }>;

  signInWithGoogle: () => Promise<void>;

  signOut: () => Promise<void>;

  refreshProfile: () => Promise<void>;
}

const AuthContext =
  createContext<AuthContextValue | undefined>(
    undefined,
  );

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({
  children,
}: AuthProviderProps) {
  const [user, setUser] =
    useState<User | null>(null);

  const [session, setSession] =
    useState<Session | null>(null);

  const [profile, setProfile] =
    useState<UserProfile | null>(null);

  const [role, setRole] =
    useState<UserRole>("user");

  const [isLoading, setIsLoading] =
    useState(true);

  const loadUserData = useCallback(
    async (currentUser: User | null) => {
      if (!currentUser) {
        setProfile(null);
        setRole("user");
        return;
      }

      try {
        const [
          profileResult,
          roleResult,
        ] = await Promise.all([
          supabase
            .from("profiles")
            .select(
              `
                id,
                full_name,
                avatar_url,
                university,
                course,
                created_at,
                updated_at
              `,
            )
            .eq("id", currentUser.id)
            .maybeSingle(),

          supabase
            .from("user_roles")
            .select("role")
            .eq("user_id", currentUser.id)
            .maybeSingle(),
        ]);

        if (profileResult.error) {
          console.error(
            "Unable to load profile:",
            profileResult.error,
          );
        }

        if (roleResult.error) {
          console.error(
            "Unable to load role:",
            roleResult.error,
          );
        }

        setProfile(
          (profileResult.data as UserProfile | null) ??
            null,
        );

        const fetchedRole =
          roleResult.data?.role;

        setRole(
          fetchedRole === "admin"
            ? "admin"
            : "user",
        );
      } catch (error) {
        console.error(
          "Unable to load user data:",
          error,
        );

        setProfile(null);
        setRole("user");
      }
    },
    [],
  );

  const refreshProfile =
    useCallback(async () => {
      await loadUserData(user);
    }, [loadUserData, user]);

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        const {
          data: { session: initialSession },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          throw error;
        }

        if (!mounted) {
          return;
        }

        setSession(initialSession);
        setUser(
          initialSession?.user ?? null,
        );

        await loadUserData(
          initialSession?.user ?? null,
        );
      } catch (error) {
        console.error(
          "Authentication initialization failed:",
          error,
        );
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    void initializeAuth();

    const {
      data: { subscription },
    } =
      supabase.auth.onAuthStateChange(
        (_event, newSession) => {
          setSession(newSession);
          setUser(
            newSession?.user ?? null,
          );

          // Avoid awaiting additional Supabase
          // requests directly inside the callback.
          window.setTimeout(() => {
            void loadUserData(
              newSession?.user ?? null,
            );
          }, 0);
        },
      );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [loadUserData]);

  const signIn = async (
    email: string,
    password: string,
  ) => {
    const {
      data,
      error,
    } =
      await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

    if (error) {
      throw error;
    }

    setSession(data.session);
    setUser(data.user);

    await loadUserData(data.user);
  };

  const signUp = async ({
    fullName,
    email,
    password,
  }: SignUpInput) => {
    const {
      data,
      error,
    } = await supabase.auth.signUp({
      email: email.trim(),
      password,

      options: {
        emailRedirectTo:
          `${window.location.origin}/auth`,

        data: {
          full_name: fullName.trim(),
        },
      },
    });

    if (error) {
      throw error;
    }

    if (data.session) {
      setSession(data.session);
      setUser(data.user);

      await loadUserData(data.user);
    }

    return {
      requiresEmailConfirmation:
        !data.session,
    };
  };

  const signInWithGoogle = async () => {
    const { error } =
      await supabase.auth.signInWithOAuth({
        provider: "google",

        options: {
          redirectTo:
            `${window.location.origin}/library`,
        },
      });

    if (error) {
      throw error;
    }
  };

  const signOut = async () => {
    const { error } =
      await supabase.auth.signOut();

    if (error) {
      throw error;
    }

    setUser(null);
    setSession(null);
    setProfile(null);
    setRole("user");
  };

  const value = useMemo(
    () => ({
      user,
      session,
      profile,
      role,

      isAdmin:
        role === "admin",

      isAuthenticated:
        Boolean(user),

      isLoading,

      signIn,
      signUp,
      signInWithGoogle,
      signOut,
      refreshProfile,
    }),
    [
      user,
      session,
      profile,
      role,
      isLoading,
      refreshProfile,
    ],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider.",
    );
  }

  return context;
}
