import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter, AmbientLight } from "@/components/SiteFooter";
import { FrankyChat } from "@/components/FrankyChat";

export const Route = createFileRoute("/franky-ai")({
  head: () => ({
    meta: [
      { title: "Franky's AI — your unlimited study assistant" },
      {
        name: "description",
        content:
          "Chat with Franky's AI to gather information on any topic, with no limit on how much you write.",
      },
      { property: "og:title", content: "Franky's AI — your unlimited study assistant" },
      {
        property: "og:description",
        content:
          "Chat with Franky's AI to gather information on any topic, with no limit on how much you write.",
      },
    ],
  }),
  component: FrankyAiPage,
});

function FrankyAiPage() {
  return (
    <div className="min-h-screen">
      <AmbientLight />
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-6 py-14">
        <h1 className="font-display text-4xl font-bold tracking-tight text-balance">
          Ask Franky's AI anything.
        </h1>
        <p className="mt-3 text-pretty text-muted-foreground">
          Paste a whole chapter, describe an assignment, or ask a single quick question — there's no
          limit on how much you send.
        </p>
        <div className="mt-8">
          <FrankyChat tall />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
