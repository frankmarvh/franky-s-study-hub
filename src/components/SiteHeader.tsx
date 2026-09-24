import { Link, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/hooks/useAuth";

export function SiteHeader() {
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-glass backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between px-6 py-3">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="grid size-8 place-items-center rounded-lg bg-foreground font-display text-sm font-bold text-background">
            F
          </div>
          <span className="font-display text-lg font-bold tracking-tight">Franky's</span>
          <span className="hidden rounded-full border border-border px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground sm:inline">
            Free · No paywall
          </span>
        </Link>

        <nav className="hidden items-center gap-7 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground md:flex">
          <Link to="/library" activeProps={{ className: "text-foreground" }}>
            Library
          </Link>
          <Link to="/franky-ai" activeProps={{ className: "text-foreground" }}>
            Franky's AI
          </Link>
          {isAdmin ? (
            <Link to="/admin" activeProps={{ className: "text-foreground" }}>
              Admin
            </Link>
          ) : null}
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <span className="hidden font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground sm:inline">
                {user.email}
              </span>
              <button
                onClick={async () => {
                  await signOut();
                  navigate({ to: "/" });
                }}
                className="rounded-lg border border-border bg-surface px-4 py-2 font-mono text-[11px] uppercase tracking-[0.12em] text-foreground transition-colors hover:border-foreground/30"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/auth"
                search={{ mode: "signin" }}
                className="rounded-lg px-3 py-2 font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:text-foreground"
              >
                Sign in
              </Link>
              <Link
                to="/auth"
                search={{ mode: "signup" }}
                className="rounded-lg bg-foreground px-4 py-2 font-mono text-[11px] uppercase tracking-[0.12em] text-background transition-colors hover:bg-foreground/85"
              >
                Create account
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
