import {
  ArrowRight,
  BookOpen,
  BrainCircuit,
  GraduationCap,
  ShieldCheck,
} from "lucide-react";

import {
  Link,
} from "react-router-dom";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center px-6 py-24 text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-sm text-blue-300">
          <GraduationCap size={18} />

          AI-Powered Learning Platform
        </div>

        <h1 className="max-w-5xl text-5xl font-black tracking-tight sm:text-6xl lg:text-7xl">
          Study smarter with{" "}
          <span className="text-blue-500">
            Franky's
          </span>
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-400">
          Access university study materials,
          revision resources and intelligent
          academic assistance from one secure
          learning platform.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            to="/library"
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold transition hover:bg-blue-500"
          >
            Explore Library

            <ArrowRight size={18} />
          </Link>

          <Link
            to="/franky-ai"
            className="rounded-xl border border-slate-700 px-6 py-3 font-semibold transition hover:border-blue-500 hover:bg-slate-900"
          >
            Ask Franky's AI
          </Link>
        </div>

        <div className="mt-20 grid w-full max-w-5xl gap-5 md:grid-cols-3">
          <Feature
            icon={<BookOpen />}
            title="Study Library"
            description="Find notes, past papers and other academic resources."
          />

          <Feature
            icon={<BrainCircuit />}
            title="Franky's AI"
            description="Get AI-powered explanations and study assistance."
          />

          <Feature
            icon={<ShieldCheck />}
            title="Secure Accounts"
            description="Your account and private learning information are protected."
          />
        </div>
      </section>
    </main>
  );
}

function Feature({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <article className="rounded-2xl border border-slate-800 bg-slate-900/60 p-7 text-left">
      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600/15 text-blue-400">
        {icon}
      </div>

      <h2 className="text-xl font-bold">
        {title}
      </h2>

      <p className="mt-2 leading-7 text-slate-400">
        {description}
      </p>
    </article>
  );
}
