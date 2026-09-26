import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export type Material = {
  id: string;
  title: string;
  description: string;
  subject: string;
  material_type: string;
  course: string | null;
  file_path: string | null;
  external_url: string | null;
  file_size_bytes: number | null;
};

const TINTS = [
  "bg-primary/10 text-primary",
  "bg-tint-sky text-tint-sky-foreground",
  "bg-tint-mint text-tint-mint-foreground",
  "bg-tint-amber text-tint-amber-foreground",
];

function tintFor(type: string) {
  let sum = 0;
  for (const char of type) sum += char.charCodeAt(0);
  return TINTS[sum % TINTS.length];
}

function formatSize(bytes: number | null) {
  if (!bytes) return "External link";
  const mb = bytes / (1024 * 1024);
  return mb >= 1 ? `${mb.toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

export function useMaterials() {
  return useQuery({
    queryKey: ["materials"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("materials")
        .select(
          "id,title,description,subject,material_type,course,file_path,external_url,file_size_bytes",
        )
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Material[];
    },
  });
}

export function MaterialsLibrary({ limit }: { limit?: number }) {
  const { user } = useAuth();
  const { data, isLoading, error } = useMaterials();
  const [query, setQuery] = useState("");
  const [subject, setSubject] = useState("All");

  const subjects = useMemo(() => {
    const set = new Set((data ?? []).map((m) => m.subject));
    return ["All", ...Array.from(set).sort()];
  }, [data]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let rows = data ?? [];
    if (subject !== "All") rows = rows.filter((m) => m.subject === subject);
    if (q) {
      rows = rows.filter((m) =>
        [m.title, m.description, m.subject, m.course ?? ""].join(" ").toLowerCase().includes(q),
      );
    }
    return limit ? rows.slice(0, limit) : rows;
  }, [data, query, subject, limit]);

  async function openMaterial(material: Material) {
    if (!user) return;
    if (material.file_path) {
      const { data: signed, error: signError } = await supabase.storage
        .from("materials")
        .createSignedUrl(material.file_path, 60 * 10);
      if (signError || !signed) {
        toast.error("That file could not be opened. Please try again.");
        return;
      }
      window.open(signed.signedUrl, "_blank", "noopener,noreferrer");
      return;
    }
    if (material.external_url) {
      window.open(material.external_url, "_blank", "noopener,noreferrer");
      return;
    }
    toast.error("No file has been attached to this material yet.");
  }

  return (
    <div className="animate-rise">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold tracking-tight">Materials library</h2>
          <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
            {data?.length ?? 0} resources · free for everyone
          </p>
        </div>
        <input
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search topics, courses, papers…"
          className="w-64 rounded-lg border border-border bg-surface px-4 py-2.5 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/50"
        />
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {subjects.map((item) => (
          <button
            key={item}
            onClick={() => setSubject(item)}
            className={
              item === subject
                ? "rounded-full bg-foreground px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.1em] text-background"
                : "rounded-full border border-border bg-surface px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.1em] text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
            }
          >
            {item}
          </button>
        ))}
      </div>

      {isLoading ? (
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
          Loading materials…
        </p>
      ) : null}
      {error ? (
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-destructive">
          Materials could not be loaded.
        </p>
      ) : null}
      {!isLoading && !error && filtered.length === 0 ? (
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
          Nothing matches that search yet.
        </p>
      ) : null}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {filtered.map((material) => (
          <article
            key={material.id}
            className="group relative overflow-hidden rounded-xl border border-border bg-surface p-5 ring-1 ring-black/5 transition-colors hover:border-primary/40"
          >
            <div className="mb-4 flex items-center justify-between">
              <span
                className={`rounded-md px-2 py-1 font-mono text-[10px] uppercase tracking-[0.1em] ${tintFor(material.material_type)}`}
              >
                {material.material_type}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
                {material.course ?? material.subject}
              </span>
            </div>
            <h3 className="font-display text-lg font-semibold tracking-tight">{material.title}</h3>
            <p className="mt-1 text-sm text-pretty text-muted-foreground">{material.description}</p>
            <div
              className={`mt-5 flex items-center justify-between ${user ? "" : "pb-10"}`}
            >
              <span className="font-mono text-[10px] text-muted-foreground">
                {material.subject} · {formatSize(material.file_size_bytes)}
              </span>
              {user ? (
                material.file_path ? (
                  <button
                    onClick={() => openMaterial(material)}
                    className="rounded-lg bg-foreground px-3 py-2 font-mono text-[11px] uppercase tracking-[0.1em] text-background transition-colors hover:bg-foreground/85"
                  >
                    Open
                  </button>
                ) : (
                  <Link
                    to="/unit/$id"
                    params={{ id: material.id }}
                    className="rounded-lg bg-foreground px-3 py-2 font-mono text-[11px] uppercase tracking-[0.1em] text-background transition-colors hover:bg-foreground/85"
                  >
                    Read
                  </Link>
                )
              ) : (
                <span className="rounded-lg border border-border bg-background px-3 py-2 font-mono text-[11px] uppercase tracking-[0.1em] text-muted-foreground">
                  Locked
                </span>
              )}
            </div>
            {user ? null : (
              <Link
                to="/auth"
                search={{ mode: "signup" }}
                className="absolute inset-x-0 bottom-0 flex items-center gap-2 border-t border-border bg-foreground/95 px-5 py-3"
              >
                <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-background/70">
                  Sign in to open
                </span>
                <span className="ml-auto font-mono text-[10px] uppercase tracking-[0.1em] text-primary">
                  Free account
                </span>
              </Link>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
