import {
  BookOpen,
  BrainCircuit,
  GraduationCap,
  Search,
} from "lucide-react";

import SiteFooter
  from "@/components/SiteFooter";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white">
      <section className="mx-auto max-w-6xl px-6 py-20">
        <p className="font-bold text-blue-500">
          About Franky's
        </p>

        <h1 className="mt-3 max-w-4xl text-4xl font-black sm:text-6xl">
          Helping students find,
          understand and organize
          learning resources.
        </h1>

        <p className="mt-7 max-w-3xl text-lg leading-8 text-slate-500">
          Franky's Study Hub
          combines open
          educational resources
          with an AI study
          assistant to create a
          simpler university
          learning experience.
        </p>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          <Feature
            icon={
              <Search />
            }
            title="Discover"
            text="Find legitimate free and open educational resources."
          />

          <Feature
            icon={
              <BrainCircuit />
            }
            title="Understand"
            text="Ask Franky's AI to explain difficult academic concepts."
          />

          <Feature
            icon={
              <GraduationCap />
            }
            title="Learn"
            text="Save useful resources and build your own study collection."
          />
        </div>

        <div className="mt-16 rounded-3xl bg-blue-600 p-8 text-white sm:p-12">
          <BookOpen
            size={35}
          />

          <h2 className="mt-5 text-3xl font-black">
            Learning resources
            remain with their
            original providers.
          </h2>

          <p className="mt-4 max-w-3xl leading-7 text-blue-100">
            Franky's Study Hub
            links students to
            legitimate educational
            sources rather than
            claiming ownership of
            external learning
            materials.
          </p>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}

function Feature({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-7 dark:border-slate-800 dark:bg-slate-900">
      <div className="text-blue-500">
        {icon}
      </div>

      <h2 className="mt-5 text-xl font-bold">
        {title}
      </h2>

      <p className="mt-3 leading-7 text-slate-500">
        {text}
      </p>
    </article>
  );
}
