import {
  useState,
  type FormEvent,
} from "react";

import {
  BookOpen,
  BrainCircuit,
  Library,
  LoaderCircle,
  LogOut,
  Search,
  ShieldCheck,
} from "lucide-react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import toast from "react-hot-toast";

import {
  useAuth,
} from "@/hooks/useAuth";

import {
  searchMaterials,
} from "@/services/materials";

import MaterialCard
  from "@/components/MaterialCard";

import type {
  LearningMaterial,
} from "@/types/material";

export default function LibraryPage() {
  const navigate =
    useNavigate();

  const {
    user,
    profile,
    isAdmin,
    signOut,
  } =
    useAuth();

  const [query, setQuery] =
    useState("");

  const [
    materials,
    setMaterials,
  ] =
    useState<
      LearningMaterial[]
    >([]);

  const [
    loading,
    setLoading,
  ] =
    useState(false);

  const [
    searched,
    setSearched,
  ] =
    useState(false);

  const handleSearch =
    async (
      event:
        FormEvent<HTMLFormElement>,
    ) => {
      event.preventDefault();

      if (
        query.trim().length <
        2
      ) {
        toast.error(
          "Enter a subject or topic.",
        );

        return;
      }

      try {
        setLoading(true);

        setSearched(true);

        const results =
          await searchMaterials(
            query,
          );

        setMaterials(
          results,
        );
      } catch (error) {
        console.error(
          error,
        );

        toast.error(
          error instanceof Error
            ? error.message
            : "Search failed.",
        );
      } finally {
        setLoading(false);
      }
    };

  const searchTopic = (
    topic: string,
  ) => {
    setQuery(topic);
  };

  const handleLogout =
    async () => {
      try {
        await signOut();

        navigate("/");

        toast.success(
          "Signed out.",
        );
      } catch {
        toast.error(
          "Unable to sign out.",
        );
      }
    };

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <header className="sticky top-0 z-30 border-b border-slate-800 bg-slate-950/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link
            to="/"
            className="flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600">
              <BookOpen
                size={21}
              />
            </div>

            <span className="text-xl font-black">
              Franky's
            </span>
          </Link>

          <div className="flex items-center gap-2">
            {isAdmin && (
              <Link
                to="/admin"
                className="hidden rounded-lg border border-slate-700 px-4 py-2 text-sm sm:block"
              >
                <ShieldCheck
                  size={16}
                  className="mr-2 inline"
                />

                Admin
              </Link>
            )}

            <Link
              to="/franky-ai"
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold"
            >
              <BrainCircuit
                size={16}
              />

              Franky's AI
            </Link>

            <button
              type="button"
              onClick={
                handleLogout
              }
              className="rounded-lg border border-slate-700 p-2.5"
            >
              <LogOut
                size={17}
              />
            </button>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-14">
        <div className="mx-auto max-w-4xl text-center">
          <p className="font-semibold text-blue-400">
            Franky's Learning
            Library
          </p>

          <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-6xl">
            What do you want to
            learn?
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-400">
            Welcome{" "}
            {profile?.full_name ||
              user?.email}
            . Search for free
            university textbooks,
            courses, lecture notes
            and other open learning
            resources.
          </p>

          <form
            onSubmit={
              handleSearch
            }
            className="relative mx-auto mt-10 max-w-3xl"
          >
            <Search
              className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500"
              size={22}
            />

            <input
              type="search"
              value={query}
              onChange={(
                event,
              ) =>
                setQuery(
                  event.target
                    .value,
                )
              }
              placeholder="Search calculus, programming, physics, databases..."
              className="w-full rounded-2xl border border-slate-700 bg-slate-900 py-5 pl-14 pr-32 text-lg outline-none focus:border-blue-500"
            />

            <button
              type="submit"
              disabled={loading}
              className="absolute right-2 top-2 bottom-2 rounded-xl bg-blue-600 px-6 font-bold hover:bg-blue-500 disabled:opacity-60"
            >
              {loading
                ? "Searching..."
                : "Search"}
            </button>
          </form>

          <div className="mt-5 flex flex-wrap justify-center gap-2">
            {[
              "Computer Science",
              "Mathematics",
              "Physics",
              "Chemistry",
              "Biology",
              "Engineering",
              "Programming",
              "Calculus",
            ].map(
              (topic) => (
                <button
                  key={topic}
                  type="button"
                  onClick={() =>
                    searchTopic(
                      topic,
                    )
                  }
                  className="rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-400 transition hover:border-blue-500 hover:text-white"
                >
                  {topic}
                </button>
              ),
            )}
          </div>
        </div>

        {loading && (
          <div className="flex min-h-72 items-center justify-center">
            <div className="text-center">
              <LoaderCircle className="mx-auto h-10 w-10 animate-spin text-blue-500" />

              <p className="mt-4 text-slate-400">
                Finding free
                learning
                resources...
              </p>
            </div>
          </div>
        )}

        {!loading &&
          searched &&
          materials.length >
            0 && (
            <section className="mt-14">
              <div className="flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-2xl font-bold">
                  <Library className="text-blue-400" />

                  Learning
                  Resources
                </h2>

                <p className="text-sm text-slate-500">
                  {
                    materials.length
                  }{" "}
                  resources
                </p>
              </div>

              <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {materials.map(
                  (
                    material,
                  ) => (
                    <MaterialCard
                      key={
                        material.id
                      }
                      material={
                        material
                      }
                    />
                  ),
                )}
              </div>
            </section>
          )}

        {!loading &&
          searched &&
          materials.length ===
            0 && (
            <div className="mx-auto mt-16 max-w-xl rounded-2xl border border-dashed border-slate-700 p-12 text-center">
              <BookOpen className="mx-auto h-12 w-12 text-slate-600" />

              <h2 className="mt-5 text-xl font-bold">
                No matching
                resources found
              </h2>

              <p className="mt-2 text-slate-500">
                Try a broader
                subject such as
                Computer Science,
                Mathematics,
                Physics or
                Engineering.
              </p>
            </div>
          )}

        {!searched && (
          <section className="mx-auto mt-20 max-w-5xl">
            <h2 className="text-center text-2xl font-bold">
              Trusted Open
              Learning Sources
            </h2>

            <div className="mt-7 grid gap-5 md:grid-cols-3">
              <Source
                name="OpenStax"
                description="Free peer-reviewed university textbooks."
              />

              <Source
                name="MIT OpenCourseWare"
                description="Open course materials from MIT."
              />

              <Source
                name="LibreTexts"
                description="Free open textbooks and educational resources."
              />
            </div>
          </section>
        )}
      </section>
    </main>
  );
}

function Source({
  name,
  description,
}: {
  name: string;
  description: string;
}) {
  return (
    <article className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
      <BookOpen className="text-blue-400" />

      <h3 className="mt-4 text-lg font-bold">
        {name}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-400">
        {description}
      </p>
    </article>
  );
}
