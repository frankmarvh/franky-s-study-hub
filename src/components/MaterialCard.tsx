import {
  Bookmark,
  BookOpen,
  ExternalLink,
  GraduationCap,
} from "lucide-react";

import toast from "react-hot-toast";

import {
  saveMaterial,
} from "@/services/materials";

import type {
  LearningMaterial,
} from "@/types/material";

interface Props {
  material:
    LearningMaterial;
}

export default function MaterialCard({
  material,
}: Props) {
  const handleSave =
    async () => {
      try {
        await saveMaterial(
          material,
        );

        toast.success(
          "Material saved.",
        );
      } catch (error) {
        console.error(error);

        toast.error(
          error instanceof Error
            ? error.message
            : "Unable to save material.",
        );
      }
    };

  return (
    <article className="flex h-full flex-col rounded-2xl border border-slate-800 bg-slate-900/70 p-6 transition hover:-translate-y-1 hover:border-blue-500/50">
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600/15 text-blue-400">
          <BookOpen
            size={23}
          />
        </div>

        <span className="rounded-full border border-slate-700 bg-slate-950 px-3 py-1 text-xs text-slate-300">
          {material.type.replace(
            "-",
            " ",
          )}
        </span>
      </div>

      <div className="mt-5 flex-1">
        <p className="text-sm font-semibold text-blue-400">
          {material.source}
        </p>

        <h2 className="mt-2 text-xl font-bold">
          {material.title}
        </h2>

        <p className="mt-3 line-clamp-4 text-sm leading-6 text-slate-400">
          {material.description}
        </p>

        <div className="mt-5 flex items-center gap-2 text-sm text-slate-500">
          <GraduationCap
            size={16}
          />

          {material.institution ||
            material.subject}
        </div>

        {material.license && (
          <p className="mt-3 text-xs text-slate-600">
            License:{" "}
            {material.license}
          </p>
        )}
      </div>

      <div className="mt-6 grid grid-cols-[1fr_auto] gap-2">
        <a
          href={material.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold hover:bg-blue-500"
        >
          Open Resource

          <ExternalLink
            size={16}
          />
        </a>

        <button
          type="button"
          onClick={
            handleSave
          }
          title="Save material"
          className="rounded-xl border border-slate-700 px-4 hover:bg-slate-800"
        >
          <Bookmark
            size={18}
          />
        </button>
      </div>
    </article>
  );
}
