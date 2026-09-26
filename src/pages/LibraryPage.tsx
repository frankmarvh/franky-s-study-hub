import {
  BookOpen,
  LogOut,
} from "lucide-react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import toast from "react-hot-toast";

import { useAuth } from "@/hooks/useAuth";

export default function LibraryPage() {
  const {
    user,
    profile,
    isAdmin,
    signOut,
  } = useAuth();

  const navigate = useNavigate();

  const handleLogout =
    async () => {
      try {
        await signOut();

        toast.success(
          "You have been signed out.",
        );

        navigate("/");
      } catch (error) {
        console.error(error);

        toast.error(
          "Unable to sign out.",
        );
      }
    };

  return (
    <main className="min-h-screen bg-slate-950 p-6 text-white">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <Link
            to="/"
            className="flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600">
              <BookOpen size={21} />
            </div>

            <span className="text-xl font-black">
              Franky's
            </span>
          </Link>

          <div className="flex items-center gap-3">
            {isAdmin && (
              <Link
                to="/admin"
                className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-semibold hover:bg-slate-700"
              >
                Admin
              </Link>
            )}

            <Link
              to="/franky-ai"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold hover:bg-blue-500"
            >
              Franky's AI
            </Link>

            <button
              onClick={
                handleLogout
              }
              className="flex items-center gap-2 rounded-lg border border-slate-700 px-4 py-2 text-sm hover:bg-slate-900"
            >
              <LogOut size={16} />

              Logout
            </button>
          </div>
        </header>

        <section className="py-16">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-400">
            Study Library
          </p>

          <h1 className="mt-3 text-4xl font-black">
            Welcome{" "}
            {profile?.full_name
              ? profile.full_name
              : user?.email}
          </h1>

          <p className="mt-4 max-w-2xl text-slate-400">
            Your authentication system
            is working. The complete
            materials library will be
            connected in Part 3.
          </p>
        </section>
      </div>
    </main>
  );
}
