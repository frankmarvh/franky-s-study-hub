import {
  Router,
} from "express";

import {
  createClient,
} from "@supabase/supabase-js";

import {
  requireAuth,
  type AuthenticatedRequest,
} from "../middleware/auth.js";

import {
  oerCatalog,
} from "../data/oerCatalog.js";

const router =
  Router();

const supabaseUrl =
  process.env.SUPABASE_URL!;

const serviceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase =
  createClient(
    supabaseUrl,
    serviceRoleKey,
    {
      auth: {
        persistSession: false,
      },
    },
  );

router.get(
  "/search",
  requireAuth,

  async (
    req: AuthenticatedRequest,
    res,
  ) => {
    try {
      const query =
        typeof req.query.q ===
        "string"
          ? req.query.q.trim()
          : "";

      if (
        query.length < 2
      ) {
        res.status(400).json({
          success: false,

          message:
            "Enter at least 2 characters.",
        });

        return;
      }

      if (
        query.length > 150
      ) {
        res.status(400).json({
          success: false,

          message:
            "Search query is too long.",
        });

        return;
      }

      const normalized =
        query.toLowerCase();

      const words =
        normalized
          .split(/\s+/)
          .filter(Boolean);

      const ranked =
        oerCatalog
          .map(
            (material) => {
              const searchable =
                [
                  material.title,
                  material.description,
                  material.subject,
                  material.source,
                  material.institution,
                  ...material.topics,
                ]
                  .filter(Boolean)
                  .join(" ")
                  .toLowerCase();

              let score = 0;

              if (
                material.title
                  .toLowerCase()
                  .includes(
                    normalized,
                  )
              ) {
                score += 10;
              }

              if (
                material.subject
                  .toLowerCase()
                  .includes(
                    normalized,
                  )
              ) {
                score += 8;
              }

              for (
                const word
                of words
              ) {
                if (
                  searchable.includes(
                    word,
                  )
                ) {
                  score += 2;
                }
              }

              return {
                ...material,
                score,
              };
            },
          )
          .filter(
            (material) =>
              material.score > 0,
          )
          .sort(
            (a, b) =>
              b.score - a.score,
          )
          .map(
            ({
              score: _score,
              ...material
            }) => material,
          );

      if (
        req.user?.id
      ) {
        await supabase
          .from(
            "material_searches",
          )
          .insert({
            user_id:
              req.user.id,

            query,
          });
      }

      res.json({
        success: true,

        query,

        count:
          ranked.length,

        materials:
          ranked,
      });
    } catch (error) {
      console.error(
        "Material search error:",
        error,
      );

      res.status(500).json({
        success: false,

        message:
          "Unable to search learning materials.",
      });
    }
  },
);

export default router;
