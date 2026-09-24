import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter, AmbientLight } from "@/components/SiteFooter";
import { MaterialsLibrary } from "@/components/MaterialsLibrary";
import { FrankyChat } from "@/components/FrankyChat";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Franky's — Free study materials, any time" },
      {
        name: "description",
        content:
          "Franky's gives you free study materials around the clock, plus Franky's AI to help you dig deeper. No payments, ever.",
      },
      { property: "og:title", content: "Franky's — Free study materials, any time" },
      {
        property: "og:description",
        content:
          "Franky's gives you free study materials around the clock, plus Franky's AI to help you dig deeper. No payments, ever.",
      },
    ],
  }),
  component: Index,
});

const STATS = [
  { label: "Always open", value: "24/7" },
  { label: "Price", value: "Free" },
  { label: "AI messages", value: "Unlimited" },
];

function Index() {
  return (
    <div className="min-h-screen">
      <AmbientLight />
      <SiteHeader />

      <main className="mx-auto max-w-[1440px] px-6">
        <section className="grid grid-cols-1 gap-10 py-16 lg:grid-cols-[1.15fr_0.85fr] lg:py-24">
          <div className="animate-rise">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
              <span className="size-1.5 rounded-full bg-primary" />
              Open all night, all day
            </span>
            <h1 className="mt-6 font-display text-5xl leading-[1.02] font-bold tracking-tight text-balance sm:text-6xl lg:text-7xl">
              Every study material you need, the moment you need it.
            </h1>
            <p className="mt-5 max-w-xl text-lg text-pretty text-muted-foreground">
              Franky's is a free library of notes, textbooks, past papers and lecture material — and
              Franky's AI is beside it to help you gather more on any topic.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                to="/auth"
                search={{ mode: "signup" }}
                className="rounded-lg bg-foreground px-5 py-3 font-mono text-[11px] uppercase tracking-[0.12em] text-background transition-colors hover:bg-foreground/85"
              >
                Create free account
              </Link>
              <Link
                to="/library"
                className="rounded-lg border border-border bg-surface px-5 py-3 font-mono text-[11px] uppercase tracking-[0.12em] text-foreground transition-colors hover:border-foreground/30"
              >
                Browse library
              </Link>
            </div>

            <dl className="mt-12 grid grid-cols-3 gap-4 border-t border-border pt-6">
              {STATS.map((stat) => (
                <div key={stat.label}>
                  <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                    {stat.label}
                  </dt>
                  <dd className="mt-1 font-display text-2xl font-bold tracking-tight">
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="lg:sticky lg:top-24 lg:self-start">
            <FrankyChat />
          </div>
        </section>

        <section className="border-t border-border py-16">
          <MaterialsLibrary limit={4} />
          <div className="mt-8">
            <Link
              to="/library"
              className="inline-block rounded-lg border border-border bg-surface px-5 py-3 font-mono text-[11px] uppercase tracking-[0.12em] text-foreground transition-colors hover:border-foreground/30"
            >
              See the whole library
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
