import {
  useEffect,
  useState,
  type FormEvent,
} from "react";

import {
  BookOpen,
  Clock3,
  Library,
  LoaderCircle,
  Search,
  Sparkles,
  Trash2,
} from "lucide-react";

import toast from "react-hot-toast";

import {
  useAuth,
} from "@/hooks/useAuth";

import AppHeader
  from "@/components/AppHeader";

import MaterialCard
  from "@/components/MaterialCard";

import {
  clearSearchHistory,
  getRecommendedMaterials,
  getSearchHistory,
  searchMaterials,
} from "@/services/materials";

import type {
  LearningMaterial,
  SearchHistoryItem,
} from "@/types/material";

const categories = [
  "Computer Science",
  "Programming",
  "Mathematics",
  "Calculus",
  "Physics",
  "Chemistry",
  "Biology",
  "Engineering",
];

export default function LibraryPage() {
  const {
    user,
    profile,
  } =
    useAuth();

  const [
    query,
    setQuery,
  ] =
    useState("");

  const [
    materials,
    setMaterials,
  ] =
    useState<
      LearningMaterial[]
    >([]);

  const [
    recommendations,
    setRecommendations,
  ] =
    useState<
      LearningMaterial[]
    >([]);

  const [
    history,
    setHistory,
  ] =
    useState<
      SearchHistoryItem[]
    >([]);

  const [
    loading,
    setLoading,
  ] =
    useState(false);

  const [
    initialLoading,
    setInitialLoading,
  ] =
    useState(true);

  const [
    searched,
    setSearched,
  ] =
    useState(false);

  useEffect(() => {
    const initialize =
      async () => {
        try {
          const [
            recent,
            recommended,
          ] =
            await Promise.all([
              getSearchHistory(),
              getRecommendedMaterials(),
            ]);

          setHistory(
            recent,
          );

          setRecommendations(
            recommended,
          );
        } catch (error) {
          console.error(
            error,
          );
        } finally {
          setInitialLoading(
            false,
          );
        }
      };

    void initialize();
  }, []);

  const runSearch =
    async (
      searchQuery: string,
    ) => {
      const clean =
        searchQuery.trim();

      if (
        clean.length < 2
      ) {
        toast.error(
          "Enter at least 2 characters.",
        );

        return;
      }

      try {
        setLoading(true);

        setSearched(true);

        setQuery(clean);

        const results =
          await searchMaterials(
            clean,
          );

        setMaterials(
          results,
        );

        const [
          recent,
          recommended,
        ] =
          await Promise.all([
            getSearchHistory(),
            getRecommendedMaterials(),
          ]);

        setHistory(
          recent,
        );

        setRecommendations(
          recommended,
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

  const handleSubmit =
    (
      event:
        FormEvent<HTMLFormElement>,
    ) => {
      event.preventDefault();

      void runSearch(
        query,
      );
    };

  const handleClearHistory =
    async () => {
      try {
        await clearSearchHistory();

        setHistory([]);

        toast.success(
          "Search history cleared.",
        );
      } catch (error) {
        console.error(
          error,
        );

        toast.error(
          "Unable to clear history.",
        );
      }
    };

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <AppHeader />

      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="mx-auto max-w-4xl text-center">
          <p className="font-semibold text-blue-400">
            Franky's Learning
            Library
          </p>

          <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-6xl">
            What do you want
            to learn?
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-400">
            Welcome{" "}
            <span className="font-semibold text-slate-200">
              {profile?.full_name ||
                user?.email}
            </span>
            . Find free and
            open university
            learning resources.
          </p>

          <form
            onSubmit={
              handleSubmit
            }
            className="relative mx-auto mt-10 max-w-3xl"
          >
            <Search
              size={22}
              className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500"
            />

            <input
              type="search"
              value={
                query
              }
              onChange={(
                event,
              ) =>
                setQuery(
                  event.target
                    .value,
                )
              }
              placeholder="Search databases, calculus, programming, physics..."
              className="w-full rounded-2xl border border-slate-700 bg-slate-900 py-5 pl-14 pr-32 text-base outline-none placeholder:text-slate-600 focus:border-blue-500 sm:text-lg"
            />

            <button
              type="submit"
              disabled={
                loading
              }
              className="absolute bottom-2 right-2 top-2 rounded-xl bg-blue-600 px-5 font-bold transition hover:bg-blue-500 disabled:opacity-60 sm:px-7"
            >
              {loading
                ? "..."
                : "Search"}
            </button>
          </form>

          <div className="mt-5 flex flex-wrap justify-center gap-2">
            {categories.map(
              (
                category,
              ) => (
                <button
                  key={
                    category
                  }
                  type="button"
                  onClick={() =>
                    void runSearch(
                      category,
                    )
                  }
                  className="rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-400 transition hover:border-blue-500 hover:text-white"
                >
                  {category}
                </button>
              ),
            )}
          </div>
        </div>

        {history.length >
          0 && (
          <section className="mx-auto mt-10 max-w-4xl rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
            <div className="flex items-center justify-between gap-4">
              <h2 className="flex items-center gap-2 font-bold">
                <Clock3
                  size={18}
                  className="text-blue-400"
                />

                Recent Searches
              </h2>

              <button
                type="button"
                onClick={() =>
                  void handleClearHistory()
                }
                className="flex items-center gap-1 text-xs text-slate-500 hover:text-red-400"
              >
                <Trash2
                  size={14}
                />

                Clear
              </button>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {history.map(
                (item) => (
                  <button
                    key={
                      item.id
                    }
                    type="button"
                    onClick={() =>
                      void runSearch(
                        item.query,
                      )
                    }
                    className="rounded-full bg-slate-800 px-3 py-1.5 text-sm text-slate-300 transition hover:bg-blue-600"
                  >
                    {
                      item.query
                    }
                  </button>
                ),
              )}
            </div>
          </section>
        )}

        {loading && (
          <div className="flex min-h-72 items-center justify-center">
            <div className="text-center">
              <LoaderCircle className="mx-auto h-10 w-10 animate-spin text-blue-500" />

              <p className="mt-4 text-slate-400">
                Searching learning
                resources...
              </p>
            </div>
          </div>
        )}

        {!loading &&
          searched && (
          <section className="mt-14">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-2xl font-bold">
                <Library className="text-blue-400" />

                Search Results
              </h2>

              <span className="text-sm text-slate-500">
                {
                  materials.length
                }{" "}
                resource
                {materials.length ===
                1
                  ? ""
                  : "s"}
              </span>
            </div>

            {materials.length >
            0 ? (
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
            ) : (
              <div className="mt-6 rounded-2xl border border-dashed border-slate-700 py-16 text-center">
                <BookOpen className="mx-auto h-12 w-12 text-slate-600" />

                <h3 className="mt-5 text-xl font-bold">
                  No matching
                  resources
                </h3>

                <p className="mt-2 text-slate-500">
                  Try a broader
                  subject or topic.
                </p>
              </div>
            )}
          </section>
        )}

        {!searched && (
          <section className="mt-16">
            <div className="flex items-center gap-3">
              <Sparkles className="text-blue-400" />

              <div>
                <h2 className="text-2xl font-bold">
                  Recommended for
                  you
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Suggestions based
                  on available open
                  resources and your
                  recent searches.
                </p>
              </div>
            </div>

            {initialLoading ? (
              <div className="flex min-h-48 items-center justify-center">
                <LoaderCircle className="h-9 w-9 animate-spin text-blue-500" />
              </div>
            ) : recommendations.length >
              0 ? (
              <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {recommendations.map(
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
            ) : (
              <p className="mt-8 text-slate-500">
                Search for a topic
                to start building
                recommendations.
              </p>
            )}
          </section>
        )}
      </section>
    </main>
  );
}
