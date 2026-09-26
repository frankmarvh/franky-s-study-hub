import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  BookMarked,
  ExternalLink,
  LoaderCircle,
  Search,
  Trash2,
} from "lucide-react";

import toast from "react-hot-toast";

import AppHeader
  from "@/components/AppHeader";

import {
  getSavedMaterials,
  removeSavedMaterial,
} from "@/services/materials";

import type {
  SavedMaterial,
} from "@/types/material";

export default function SavedMaterialsPage() {
  const [
    materials,
    setMaterials,
  ] =
    useState<
      SavedMaterial[]
    >([]);

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    deletingId,
    setDeletingId,
  ] =
    useState<
      string | null
    >(null);

  const [
    search,
    setSearch,
  ] =
    useState("");

  useEffect(() => {
    const load =
      async () => {
        try {
          const data =
            await getSavedMaterials();

          setMaterials(
            data,
          );
        } catch (error) {
          console.error(
            error,
          );

          toast.error(
            "Unable to load saved materials.",
          );
        } finally {
          setLoading(
            false,
          );
        }
      };

    void load();
  }, []);

  const filtered =
    useMemo(() => {
      const query =
        search
          .trim()
          .toLowerCase();

      if (!query) {
        return materials;
      }

      return materials.filter(
        (material) =>
          [
            material.title,
            material.description,
            material.subject,
            material.source,
            material.resource_type,
          ].some(
            (value) =>
              value
                ?.toLowerCase()
                .includes(
                  query,
                ),
          ),
      );
    }, [
      materials,
      search,
    ]);

  const handleDelete =
    async (
      material:
        SavedMaterial,
    ) => {
      const confirmed =
        window.confirm(
          `Remove "${material.title}" from your saved materials?`,
        );

      if (!confirmed) {
        return;
      }

      try {
        setDeletingId(
          material.id,
        );

        await removeSavedMaterial(
          material.id,
        );

        setMaterials(
          (current) =>
            current.filter(
              (item) =>
                item.id !==
                material.id,
            ),
        );

        toast.success(
          "Removed from saved materials.",
        );
      } catch (error) {
        console.error(
          error,
        );

        toast.error(
          "Unable to remove material.",
        );
      } finally {
        setDeletingId(
          null,
        );
      }
    };

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <AppHeader />

      <section className="mx-auto max-w-7xl px-6 py-12">
        <div>
          <p className="font-semibold text-blue-400">
            Your Learning
            Collection
          </p>

          <h1 className="mt-2 text-4xl font-black sm:text-5xl">
            Saved Materials
          </h1>

          <p className="mt-4 max-w-2xl text-slate-400">
            Resources you save
            from the Franky's
            library appear here
            so you can quickly
            return to them.
          </p>
        </div>

        <div className="relative mt-9 max-w-2xl">
          <Search
            size={19}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
          />

          <input
            type="search"
            value={
              search
            }
            onChange={(
              event,
            ) =>
              setSearch(
                event.target
                  .value,
              )
            }
            placeholder="Search your saved materials..."
            className="w-full rounded-xl border border-slate-700 bg-slate-900 py-3 pl-12 pr-4 outline-none focus:border-blue-500"
          />
        </div>

        {loading ? (
          <div className="flex min-h-80 items-center justify-center">
            <LoaderCircle className="h-10 w-10 animate-spin text-blue-500" />
          </div>
        ) : filtered.length >
          0 ? (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map(
              (material) => (
                <article
                  key={
                    material.id
                  }
                  className="flex flex-col rounded-2xl border border-slate-800 bg-slate-900/70 p-6"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600/15 text-blue-400">
                    <BookMarked
                      size={22}
                    />
                  </div>

                  <div className="mt-5 flex-1">
                    <p className="text-sm font-semibold text-blue-400">
                      {
                        material.source
                      }
                    </p>

                    <h2 className="mt-2 text-xl font-bold">
                      {
                        material.title
                      }
                    </h2>

                    {material.description && (
                      <p className="mt-3 line-clamp-4 text-sm leading-6 text-slate-400">
                        {
                          material.description
                        }
                      </p>
                    )}

                    {material.subject && (
                      <p className="mt-4 text-sm text-slate-500">
                        Subject:{" "}
                        {
                          material.subject
                        }
                      </p>
                    )}

                    {material.license && (
                      <p className="mt-2 text-xs text-slate-600">
                        License:{" "}
                        {
                          material.license
                        }
                      </p>
                    )}
                  </div>

                  <div className="mt-6 grid grid-cols-[1fr_auto] gap-2">
                    <a
                      href={
                        material.source_url
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold hover:bg-blue-500"
                    >
                      Open

                      <ExternalLink
                        size={
                          16
                        }
                      />
                    </a>

                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(
                          material,
                        )
                      }
                      disabled={
                        deletingId ===
                        material.id
                      }
                      title="Remove saved material"
                      className="flex min-w-12 items-center justify-center rounded-xl border border-slate-700 text-slate-400 transition hover:border-red-500/50 hover:text-red-400 disabled:opacity-50"
                    >
                      {deletingId ===
                      material.id ? (
                        <LoaderCircle
                          size={
                            18
                          }
                          className="animate-spin"
                        />
                      ) : (
                        <Trash2
                          size={
                            18
                          }
                        />
                      )}
                    </button>
                  </div>
                </article>
              ),
            )}
          </div>
        ) : (
          <div className="mt-10 rounded-2xl border border-dashed border-slate-700 px-6 py-20 text-center">
            <BookMarked className="mx-auto h-14 w-14 text-slate-600" />

            <h2 className="mt-5 text-2xl font-bold">
              {materials.length ===
              0
                ? "No saved materials yet"
                : "No matching materials"}
            </h2>

            <p className="mx-auto mt-3 max-w-md text-slate-500">
              {materials.length ===
              0
                ? "Search the learning library and bookmark useful resources."
                : "Try a different search term."}
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
