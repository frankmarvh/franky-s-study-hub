import {
  ArrowLeft,
  BrainCircuit,
} from "lucide-react";

import { Link } from "react-router-dom";

export default function FrankyAIPage() {
  return (
    <main className="min-h-screen bg-slate-950 p-6 text-white">
      <div className="mx-auto max-w-5xl">
        <Link
          to="/library"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white"
        >
          <ArrowLeft size={18} />

          Library
        </Link>

        <section className="py-20 text-center">
          <BrainCircuit className="mx-auto h-16 w-16 text-blue-500" />

          <h1 className="mt-6 text-4xl font-black">
            Franky's AI
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-slate-400">
            Authentication is ready.
            The secure AI backend and
            conversation system will be
            added after the materials
            system.
          </p>
        </section>
      </div>
    </main>
  );
}
