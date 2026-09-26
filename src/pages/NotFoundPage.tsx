import {
  ArrowLeft,
} from "lucide-react";

import {
  Link,
} from "react-router-dom";

export default function NotFoundPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-center text-white">
      <div>
        <p className="text-7xl font-black text-blue-500">
          404
        </p>

        <h1 className="mt-4 text-3xl font-bold">
          Page not found
        </h1>

        <p className="mt-3 text-slate-400">
          The page you requested does not
          exist.
        </p>

        <Link
          to="/"
          className="mt-8 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold hover:bg-blue-500"
        >
          <ArrowLeft size={18} />

          Back Home
        </Link>
      </div>
    </main>
  );
}
