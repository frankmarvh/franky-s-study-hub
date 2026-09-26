import {
  BookOpen,
  CalendarDays,
  FileText,
  GraduationCap,
} from "lucide-react";

import {
  Link,
} from "react-router-dom";

import type {
  Material,
} from "@/types/material";

interface MaterialCardProps {
  material: Material;
}

const materialLabels = {
  notes: "Notes",
  past_paper: "Past Paper",
  assignment: "Assignment",
  revision: "Revision",
  book: "Book",
  other: "Other",
};

export default function MaterialCard({
  material,
}: MaterialCardProps) {
  return (
    <article className="group flex h-full flex-col rounded-2xl border border-slate-800 bg-slate-900/70 p-5 transition hover:-translate-y-1 hover:border-blue-500/50">
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-600/15 text-blue-400">
          <FileText size={23} />
        </div>

        <span className="rounded-full border border-slate-700 bg-slate-950 px-3 py-1 text-xs font-medium text-slate-300">
          {
            materialLabels[
              material.material_type
            ]
          }
        </span>
      </div>

      <div className="mt-5 flex-1">
        <p className="text-xs font-semibold uppercase tracking-wider text-blue-400">
          {material.unit_code ||
            "Study Material"}
        </p>

        <h2 className="mt-2 text-xl font-bold text-white">
          {material.title}
        </h2>

        <p className="mt-2 text-sm text-slate-400">
          {material.unit_name}
        </p>

        {material.description && (
          <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-400">
            {material.description}
          </p>
        )}
      </div>

      <div className="mt-6 space-y-2 border-t border-slate-800 pt-4 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <GraduationCap size={14} />

          <span>
            {material.university}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <BookOpen size={14} />

          <span>
            {material.course}
          </span>
        </div>

        {(material.year_of_study ||
          material.semester) && (
          <div className="flex items-center gap-2">
            <CalendarDays size={14} />

            <span>
              {material.year_of_study
                ? `Year ${material.year_of_study}`
                : ""}

              {material.year_of_study &&
              material.semester
                ? " • "
                : ""}

              {material.semester
                ? `Semester ${material.semester}`
                : ""}
            </span>
          </div>
        )}
      </div>

      <Link
        to={`/material/${material.id}`}
        className="mt-5 block rounded-xl bg-blue-600 px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-blue-500"
      >
        Open Material
      </Link>
    </article>
  );
}
