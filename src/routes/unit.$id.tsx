import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import ReactMarkdown from "react-markdown";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter, AmbientLight } from "@/components/SiteFooter";
import { useAuth } from "@/hooks/useAuth";
import { getUnitContent } from "@/lib/units.functions";

export const Route = createFileRoute("/unit/$id")({
  head: () => ({
    meta: [
      { title: "Study unit — Franky's" },
      { name: "description", content: "Read full study notes for this unit on Franky's, free." },
      { property: "og:title", content: "Study unit — Franky's" },
      { property: "og:description", content: "Read full study notes for this unit on Franky's, free." },
    ],
  }),
  component: UnitPage,
});

function UnitPage() {
  const { id } = Route.useParams();
  const { user, loading } = useAuth();
  const fetchUnit = useServerFn(getUnitContent);
  const { data, isLoading, error } = useQuery({
    queryKey: ["unit", id],
    queryFn: () => fetchUnit({ data: { id } }),
    enabled: !!user,
    staleTime: Infinity,
  });

  return (
    <div className="min-h-screen">
      <AmbientLight />
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-6 py-14">
        <Link to="/library" className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground hover:text-foreground">
          ← Back to library
        </Link>
        {!loading && !user ? (
          <div className="mt-8 rounded-xl border border-border bg-surface p-8">
            <p className="text-lg">Sign in to read this unit — it's free.</p>
            <Link to="/auth" search={{ mode: "signup" }} className="mt-4 inline-block rounded-lg bg-foreground px-5 py-3 font-mono text-[11px] uppercase tracking-[0.12em] text-background">
              Create free account
            </Link>
          </div>
        ) : null}
        {user && isLoading ? (
          <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
            Preparing notes for this unit… (first open can take a moment)
          </p>
        ) : null}
        {error ? <p className="mt-8 text-destructive">This unit could not be loaded. Please try again.</p> : null}
        {data ? (
          <article className="mt-6">
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-primary">
              {data.unit_code ?? data.material_type} · {data.course ?? data.subject}
            </p>
            <h1 className="mt-2 font-display text-4xl font-bold tracking-tight">{data.title}</h1>
            <div className="prose-unit mt-8 space-y-4 leading-relaxed [&_h1]:font-display [&_h1]:text-2xl [&_h1]:font-bold [&_h2]:mt-8 [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-semibold [&_h3]:font-semibold [&_li]:ml-5 [&_ol]:list-decimal [&_ul]:list-disc [&_code]:font-mono">
              <ReactMarkdown>{data.content ?? ""}</ReactMarkdown>
            </div>
          </article>
        ) : null}
      </main>
      <SiteFooter />
    </div>
  );
}
