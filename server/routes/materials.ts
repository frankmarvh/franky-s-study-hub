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
  process.env.SUPABASE_URL;

const serviceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY;

if (
  !supabaseUrl ||
  !serviceRoleKey
) {
  throw new Error(
    "Missing Supabase server environment variables.",
  );
}

const supabase =
  createClient(
    supabaseUrl,
    serviceRoleKey,
    {
      auth: {
        persistSession:
          false,

        autoRefreshToken:
          false,
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
                score += 12;
              }

              if (
                material.subject
                  .toLowerCase()
                  .includes(
                    normalized,
                  )
              ) {
                score += 10;
              }

              if (
                material.topics.some(
                  (topic) =>
                    topic
                      .toLowerCase()
                      .includes(
                        normalized,
                      ),
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
                material,
                score,
              };
            },
          )
          .filter(
            (result) =>
              result.score > 0,
          )
          .sort(
            (a, b) =>
              b.score -
              a.score,
          )
          .map(
            (result) =>
              result.material,
          );

      if (
        req.user?.id
      ) {
        const {
          error,
        } =
          await supabase
            .from(
              "material_searches",
            )
            .insert({
              user_id:
                req.user.id,

              query,
            });

        if (error) {
          console.error(
            "Unable to save search:",
            error,
          );
        }
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

router.get(
  "/recommended",

  requireAuth,

  async (
    req: AuthenticatedRequest,
    res,
  ) => {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message:
            "Authentication required.",
        });

        return;
      }

      const {
        data: recentSearches,
        error,
      } =
        await supabase
          .from(
            "material_searches",
          )
          .select(
            "query",
          )
          .eq(
            "user_id",
            req.user.id,
          )
          .order(
            "created_at",
            {
              ascending:
                false,
            },
          )
          .limit(5);

      if (error) {
        throw error;
      }

      if (
        !recentSearches ||
        recentSearches.length ===
          0
      ) {
        res.json({
          success: true,

          materials:
            oerCatalog.slice(
              0,
              6,
            ),
        });

        return;
      }

      const words =
        recentSearches
          .flatMap(
            (item) =>
              item.query
                .toLowerCase()
                .split(/\s+/),
          )
          .filter(
            (word) =>
              word.length > 1,
          );

      const scored =
        oerCatalog
          .map(
            (material) => {
              const searchable =
                [
                  material.title,
                  material.subject,
                  material.description,
                  ...material.topics,
                ]
                  .join(" ")
                  .toLowerCase();

              const score =
                words.reduce(
                  (
                    total,
                    word,
                  ) =>
                    searchable.includes(
                      word,
                    )
                      ? total + 1
                      : total,
                  0,
                );

              return {
                material,
                score,
              };
            },
          )
          .sort(
            (a, b) =>
              b.score -
              a.score,
          );

      const recommendations =
        scored
          .filter(
            (item) =>
              item.score > 0,
          )
          .slice(
            0,
            6,
          )
          .map(
            (item) =>
              item.material,
          );

      res.json({
        success: true,

        materials:
          recommendations.length >
          0
            ? recommendations
            : oerCatalog.slice(
                0,
                6,
              ),
      });
    } catch (error) {
      console.error(
        "Recommendation error:",
        error,
      );

      res.status(500).json({
        success: false,

        message:
          "Unable to load recommendations.",
      });
    }
  },
);

export default router;
