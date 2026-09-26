import {
  ArrowLeft,
  ShieldCheck,
} from "lucide-react";

import { Link } from "react-router-dom";

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-slate-950 p-6 text-white">
      <div className="mx-auto max-w-7xl">
        <Link
          to="/library"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white"
        >
          <ArrowLeft size={18} />

          Library
        </Link>

        <section className="py-20 text-center">
          <ShieldCheck className="mx-auto h-16 w-16 text-blue-500" />

          <h1 className="mt-6 text-4xl font-black">
            Admin Dashboard
          </h1>

          <p className="mt-4 text-slate-400">
            You successfully passed the
            administrator authorization
            check.
          </p>
        </section>
      </div>
    </main>
  );
}
