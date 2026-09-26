import {
  useEffect,
  useState,
} from "react";

import {
  ArrowLeft,
  BookOpen,
  Download,
  ExternalLink,
  FileText,
  LoaderCircle,
} from "lucide-react";

import {
  Link,
  useParams,
} from "react-router-dom";

import toast from "react-hot-toast";

import {
  getMaterialById,
  getMaterialSignedUrl,
} from "@/services/materials";

import type {
  Material,
} from "@/types/material";

export default function MaterialPage() {
  const { id } =
    useParams<{
      id: string;
    }>();

  const [material, setMaterial] =
    useState<Material | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [
    openingFile,
    setOpeningFile,
  ] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!id) {
        setLoading(false);
        return;
      }

      try {
        const result =
          await getMaterialById(id);

        setMaterial(result);
      } catch (error) {
        console.error(error);

        toast.error(
          "Unable to load this material.",
        );
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [id]);

  const openFile = async () => {
    if (!material?.file_path) {
      return;
    }

    try {
      setOpeningFile(true);

      const url =
        await getMaterialSignedUrl(
          material.file_path,
        );

      window.open(
        url,
        "_blank",
        "noopener,noreferrer",
      );
    } catch (error) {
      console.error(error);

      toast.error(
        "Unable to open the material file.",
      );
    } finally {
      setOpeningFile(false);
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <LoaderCircle className="h-10 w-10 animate-spin text-blue-500" />
      </main>
    );
  }

  if (!material) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-center text-white">
        <div>
          <FileText className="mx-auto h-14 w-14 text-slate-600" />

          <h1 className="mt-5 text-3xl font-black">
            Material not found
          </h1>

          <Link
            to="/library"
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold hover:bg-blue-500"
          >
            <ArrowLeft size={18} />

            Return to Library
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-slate-800">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
          <Link
            to="/library"
            className="flex items-center gap-2 text-slate-400 transition hover:text-white"
          >
            <ArrowLeft size={18} />

            Library
          </Link>

          <Link
            to="/"
            className="flex items-center gap-2 font-black"
          >
            <BookOpen
              size={20}
              className="text-blue-500"
            />

            Franky's
          </Link>
        </div>
      </header>

      <article className="mx-auto max-w-5xl px-6 py-12">
        <p className="font-semibold uppercase tracking-widest text-blue-400">
          {material.unit_code ||
            material.material_type.replace(
              "_",
              " ",
            )}
        </p>

        <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
          {material.title}
        </h1>

        <p className="mt-4 text-xl text-slate-400">
          {material.unit_name}
        </p>

        <div className="mt-8 flex flex-wrap gap-3 text-sm">
          <InfoBadge>
            {material.university}
          </InfoBadge>

          <InfoBadge>
            {material.course}
          </InfoBadge>

          {material.year_of_study && (
            <InfoBadge>
              Year{" "}
              {
                material.year_of_study
              }
            </InfoBadge>
          )}

          {material.semester && (
            <InfoBadge>
              Semester{" "}
              {material.semester}
            </InfoBadge>
          )}
        </div>

        {material.description && (
          <section className="mt-10 rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
            <h2 className="text-xl font-bold">
              About this material
            </h2>

            <p className="mt-3 whitespace-pre-wrap leading-8 text-slate-400">
              {material.description}
            </p>
          </section>
        )}

        <div className="mt-6 flex flex-wrap gap-3">
          {material.file_path && (
            <button
              type="button"
              onClick={openFile}
              disabled={openingFile}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold hover:bg-blue-500 disabled:opacity-60"
            >
              {openingFile ? (
                <LoaderCircle
                  size={18}
                  className="animate-spin"
                />
              ) : (
                <Download size={18} />
              )}

              Open Material
            </button>
          )}

          {material.external_url && (
            <a
              href={
                material.external_url
              }
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-xl border border-slate-700 px-5 py-3 font-semibold hover:bg-slate-900"
            >
              <ExternalLink
                size={18}
              />

              External Resource
            </a>
          )}
        </div>

        {material.content && (
          <section className="mt-10 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8">
            <h2 className="text-2xl font-black">
              Study Content
            </h2>

            <div className="mt-6 whitespace-pre-wrap leading-8 text-slate-300">
              {material.content}
            </div>
          </section>
        )}

        {!material.content &&
          !material.file_path &&
          !material.external_url && (
            <div className="mt-10 rounded-2xl border border-dashed border-slate-700 p-10 text-center text-slate-500">
              This material currently
              has no attached content.
            </div>
          )}
      </article>
    </main>
  );
}

function InfoBadge({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <span className="rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-slate-300">
      {children}
    </span>
  );
}
