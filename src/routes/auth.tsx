import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useAuth } from "@/hooks/useAuth";
import { AmbientLight } from "@/components/SiteFooter";

type AuthSearch = { mode: "signin" | "signup" };

export const Route = createFileRoute("/auth")({
  validateSearch: (search: Record<string, unknown>): AuthSearch => ({
    mode: search.mode === "signup" ? "signup" : "signin",
  }),
  head: () => ({
    meta: [
      { title: "Sign in — Franky's" },
      {
        name: "description",
        content: "Create your free Franky's account to open study materials and chat with Franky's AI.",
      },
      { property: "og:title", content: "Sign in — Franky's" },
      {
        property: "og:description",
        content: "Create your free Franky's account to open study materials and chat with Franky's AI.",
      },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { mode } = Route.useSearch();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [busy, setBusy] = useState(false);

  const isSignup = mode === "signup";

  useEffect(() => {
    if (user) navigate({ to: "/library" });
  }, [user, navigate]);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    try {
      if (isSignup) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { full_name: fullName },
          },
        });
        if (error) throw error;
        toast.success("Welcome to Franky's!");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Signed in.");
      }
      navigate({ to: "/library" });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  async function google() {
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      toast.error("Google sign-in didn't work. Please try again.");
      return;
    }
    if (result.redirected) return;
    navigate({ to: "/library" });
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-14">
      <AmbientLight />
      <div className="w-full max-w-md rounded-2xl border border-border bg-glass p-7 ring-1 ring-black/5 backdrop-blur-xl animate-rise">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="grid size-8 place-items-center rounded-lg bg-foreground font-display text-sm font-bold text-background">
            F
          </div>
          <span className="font-display text-lg font-bold tracking-tight">Franky's</span>
        </Link>

        <h1 className="mt-6 font-display text-2xl font-bold tracking-tight">
          {isSignup ? "Create your free account" : "Welcome back"}
        </h1>
        <p className="mt-1.5 text-sm text-pretty text-muted-foreground">
          An account unlocks every material in the library and unlimited chats with Franky's AI.
          There is nothing to pay.
        </p>

        <form onSubmit={submit} className="mt-6 space-y-3">
          {isSignup ? (
            <input
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              placeholder="Full name"
              className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/50"
            />
          ) : null}
          <input
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Email address"
            className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/50"
          />
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Password"
            className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/50"
          />
          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-lg bg-foreground px-4 py-3 font-mono text-[11px] uppercase tracking-[0.12em] text-background transition-colors hover:bg-foreground/85 disabled:opacity-60"
          >
            {busy ? "Please wait" : isSignup ? "Create account" : "Sign in"}
          </button>
        </form>

        <div className="my-5 flex items-center gap-3">
          <span className="h-px flex-1 bg-border" />
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
            or
          </span>
          <span className="h-px flex-1 bg-border" />
        </div>

        <button
          onClick={google}
          className="w-full rounded-lg border border-border bg-surface px-4 py-3 font-mono text-[11px] uppercase tracking-[0.12em] text-foreground transition-colors hover:border-foreground/30"
        >
          Continue with Google
        </button>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          {isSignup ? "Already have an account?" : "New to Franky's?"}{" "}
          <Link
            to="/auth"
            search={{ mode: isSignup ? "signin" : "signup" }}
            className="text-primary hover:underline"
          >
            {isSignup ? "Sign in" : "Create one free"}
          </Link>
        </p>
      </div>
    </div>
  );
}
