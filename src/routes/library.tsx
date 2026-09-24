import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter, AmbientLight } from "@/components/SiteFooter";
import { MaterialsLibrary } from "@/components/MaterialsLibrary";
import { FrankyChat } from "@/components/FrankyChat";

export const Route = createFileRoute("/library")({
  head: () => ({
    meta: [
      { title: "Library — Franky's" },
      {
        name: "description",
        content:
          "Browse every free study material on Franky's: textbooks, lecture notes, past papers and summaries across subjects.",
      },
      { property: "og:title", content: "Library — Franky's" },
      {
        property: "og:description",
        content:
          "Browse every free study material on Franky's: textbooks, lecture notes, past papers and summaries across subjects.",
      },
    ],
  }),
  component: LibraryPage,
});

function LibraryPage() {
  return (
    <div className="min-h-screen">
      <AmbientLight />
      <SiteHeader />
      <main className="mx-auto grid max-w-[1440px] grid-cols-1 gap-10 px-6 py-14 lg:grid-cols-[1.15fr_0.85fr]">
        <MaterialsLibrary />
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <FrankyChat />
        </aside>
      </main>
      <SiteFooter />
    </div>
  );
}
