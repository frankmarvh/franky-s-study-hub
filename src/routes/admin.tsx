import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter, AmbientLight } from "@/components/SiteFooter";
import { useMaterials } from "@/components/MaterialsLibrary";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Add materials — Franky's" },
      { name: "description", content: "Upload and manage the free study materials on Franky's." },
      { property: "og:title", content: "Add materials — Franky's" },
      {
        property: "og:description",
        content: "Upload and manage the free study materials on Franky's.",
      },
    ],
  }),
  component: AdminPage,
});

const TYPES = ["Textbook", "Lecture notes", "Past paper", "Summary", "Worksheet", "Video"];

function AdminPage() {
  const { user, isAdmin, loading } = useAuth();
  const queryClient = useQueryClient();
  const { data: materials } = useMaterials();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subject, setSubject] = useState("");
  const [course, setCourse] = useState("");
  const [materialType, setMaterialType] = useState<string>("Textbook");
  const [externalUrl, setExternalUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
        Checking your access…
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen">
        <AmbientLight />
        <SiteHeader />
        <main className="mx-auto max-w-lg px-6 py-24 text-center">
          <h1 className="font-display text-3xl font-bold tracking-tight">Admins only</h1>
          <p className="mt-3 text-pretty text-muted-foreground">
            Only the Franky's team can add materials. Everything they upload stays free for everyone.
          </p>
          <Link
            to="/library"
            className="mt-6 inline-block rounded-lg bg-foreground px-5 py-3 font-mono text-[11px] uppercase tracking-[0.12em] text-background transition-colors hover:bg-foreground/85"
          >
            Back to the library
          </Link>
        </main>
        <SiteFooter />
      </div>
    );
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!file && !externalUrl.trim()) {
      toast.error("Add a file or a link to the material.");
      return;
    }
    setBusy(true);
    try {
      let filePath: string | null = null;
      let fileSize: number | null = null;

      if (file) {
        const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
        const path = `${user!.id}/${Date.now()}-${safeName}`;
        const { error: uploadError } = await supabase.storage
          .from("materials")
          .upload(path, file, { upsert: false });
        if (uploadError) throw uploadError;
        filePath = path;
        fileSize = file.size;
      }

      const { error } = await supabase.from("materials").insert({
        title: title.trim(),
        description: description.trim(),
        subject: subject.trim(),
        material_type: materialType,
        course: course.trim() || null,
        file_path: filePath,
        external_url: externalUrl.trim() || null,
        file_size_bytes: fileSize,
        created_by: user!.id,
      });
      if (error) throw error;

      toast.success("Material published.");
      setTitle("");
      setDescription("");
      setSubject("");
      setCourse("");
      setExternalUrl("");
      setFile(null);
      await queryClient.invalidateQueries({ queryKey: ["materials"] });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed.");
    } finally {
      setBusy(false);
    }
  }

  const fieldClass =
    "w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/50";

  return (
    <div className="min-h-screen">
      <AmbientLight />
      <SiteHeader />
      <main className="mx-auto grid max-w-[1200px] grid-cols-1 gap-10 px-6 py-14 lg:grid-cols-[1fr_0.8fr]">
        <section className="animate-rise">
          <h1 className="font-display text-3xl font-bold tracking-tight">Add a study material</h1>
          <p className="mt-2 text-pretty text-muted-foreground">
            Upload a file or point to a free resource elsewhere. Every item stays free to open.
          </p>

          <form onSubmit={submit} className="mt-7 space-y-3">
            <input
              required
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Title"
              className={fieldClass}
            />
            <textarea
              required
              rows={3}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Short description"
              className={`${fieldClass} resize-y`}
            />
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <input
                required
                value={subject}
                onChange={(event) => setSubject(event.target.value)}
                placeholder="Subject"
                className={fieldClass}
              />
              <input
                value={course}
                onChange={(event) => setCourse(event.target.value)}
                placeholder="Course (optional)"
                className={fieldClass}
              />
              <select
                value={materialType}
                onChange={(event) => setMaterialType(event.target.value)}
                className={fieldClass}
              >
                {TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <input
              value={externalUrl}
              onChange={(event) => setExternalUrl(event.target.value)}
              placeholder="Link to the resource (optional if you upload a file)"
              className={fieldClass}
            />
            <input
              type="file"
              onChange={(event) => setFile(event.target.files?.[0] ?? null)}
              className="w-full rounded-lg border border-dashed border-border bg-surface px-4 py-3 text-sm text-muted-foreground"
            />
            <button
              type="submit"
              disabled={busy}
              className="rounded-lg bg-foreground px-5 py-3 font-mono text-[11px] uppercase tracking-[0.12em] text-background transition-colors hover:bg-foreground/85 disabled:opacity-60"
            >
              {busy ? "Publishing" : "Publish material"}
            </button>
          </form>
        </section>

        <aside className="rounded-2xl border border-border bg-glass p-5 ring-1 ring-black/5 backdrop-blur-xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
            Published · {materials?.length ?? 0}
          </p>
          <ul className="mt-4 space-y-3">
            {(materials ?? []).slice(0, 10).map((material) => (
              <li key={material.id} className="rounded-lg border border-border bg-surface p-3">
                <p className="font-display text-sm font-semibold tracking-tight">
                  {material.title}
                </p>
                <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
                  {material.subject} · {material.material_type}
                </p>
              </li>
            ))}
          </ul>
        </aside>
      </main>
      <SiteFooter />
    </div>
  );
}
