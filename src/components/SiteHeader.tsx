import { Link, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/hooks/useAuth";
import { ThemeToggle } from "@/components/ThemeToggle";

export function SiteHeader() {
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();

  const links = (
    <>
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
    </>
  );

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-glass backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-2 px-4 py-3 sm:px-6">
        <Link to="/" className="flex shrink-0 items-center gap-2.5">
          <div className="grid size-8 place-items-center rounded-lg bg-foreground font-display text-sm font-bold text-background">
            F
          </div>
          <span className="font-display text-lg font-bold tracking-tight">Franky's</span>
          <span className="hidden rounded-full border border-border px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground lg:inline">
            Free · No paywall
          </span>
        </Link>

        <nav className="hidden items-center gap-7 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground md:flex">
          {links}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {user ? (
            <>
              <span className="hidden font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground xl:inline">
                {user.email}
              </span>
              <button
                onClick={async () => {
                  await signOut();
                  navigate({ to: "/" });
                }}
                className="rounded-lg border border-border bg-surface px-3 py-2 font-mono text-[11px] uppercase tracking-[0.12em] text-foreground transition-colors hover:border-foreground/30 sm:px-4"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/auth"
                search={{ mode: "signin" }}
                className="hidden rounded-lg px-3 py-2 font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:text-foreground sm:inline"
              >
                Sign in
              </Link>
              <Link
                to="/auth"
                search={{ mode: "signup" }}
                className="rounded-lg bg-foreground px-3 py-2 font-mono text-[11px] uppercase tracking-[0.12em] text-background transition-colors hover:bg-foreground/85 sm:px-4"
              >
                <span className="sm:hidden">Join</span>
                <span className="hidden sm:inline">Create account</span>
              </Link>
            </>
          )}
        </div>
      </div>
      <nav className="flex items-center gap-6 overflow-x-auto border-t border-border px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground md:hidden">
        {links}
        {user ? null : (
          <Link to="/auth" search={{ mode: "signin" }}>
            Sign in
          </Link>
        )}
      </nav>
    </header>
  );
}
