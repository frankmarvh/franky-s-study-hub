export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-surface/60">
      <div className="mx-auto flex max-w-[1440px] flex-col items-start justify-between gap-4 px-6 py-8 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2.5">
          <div className="grid size-7 place-items-center rounded-md bg-foreground font-display text-xs font-bold text-background">
            F
          </div>
          <span className="font-display text-sm font-bold tracking-tight">Franky's</span>
        </div>
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
          Free forever · Sign in required to download
        </p>
      </div>
    </footer>
  );
}

export function AmbientLight() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10">
      <div className="absolute -top-40 -left-32 h-[520px] w-[520px] rounded-full bg-primary/15 blur-3xl" />
      <div className="absolute top-1/3 right-[-160px] h-[460px] w-[460px] rounded-full bg-tint-sky/60 blur-3xl" />
    </div>
  );
}
