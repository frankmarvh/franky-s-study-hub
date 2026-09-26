import "dotenv/config";

import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import materialsRouter from "./routes/materials.js";
import chatRouter from "./routes/chat.js";

const app = express();

const PORT =
  Number(process.env.PORT) || 5000;

const CLIENT_URL =
  process.env.CLIENT_URL ||
  "http://localhost:5173";

// ============================================================
// EXPRESS CONFIGURATION
// ============================================================

app.set(
  "trust proxy",
  1,
);

// ============================================================
// SECURITY MIDDLEWARE
// ============================================================

app.use(
  helmet(),
);

app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
  }),
);

// ============================================================
// BODY PARSERS
// ============================================================

app.use(
  express.json({
    limit: "1mb",
  }),
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "1mb",
  }),
);

// ============================================================
// GENERAL API RATE LIMITER
// ============================================================

const generalLimiter =
  rateLimit({
    windowMs:
      15 * 60 * 1000,

    limit: 300,

    standardHeaders:
      "draft-8",

    legacyHeaders:
      false,

    message: {
      success: false,
      message:
        "Too many requests. Please try again later.",
    },
  });

// ============================================================
// MATERIAL SEARCH RATE LIMITER
// ============================================================

const searchLimiter =
  rateLimit({
    windowMs:
      60 * 1000,

    limit: 30,

    standardHeaders:
      "draft-8",

    legacyHeaders:
      false,

    message: {
      success: false,
      message:
        "Too many searches. Please wait a moment.",
    },
  });

// ============================================================
// FRANKY'S AI RATE LIMITER
// ============================================================

const aiLimiter =
  rateLimit({
    windowMs:
      60 * 1000,

    limit: 10,

    standardHeaders:
      "draft-8",

    legacyHeaders:
      false,

    message: {
      success: false,
      message:
        "You are sending messages too quickly. Please wait a moment.",
    },
  });

// ============================================================
// APPLY GENERAL API RATE LIMIT
// ============================================================

app.use(
  "/api",
  generalLimiter,
);

// ============================================================
// ROOT API ROUTE
// ============================================================

app.get(
  "/api",
  (_req, res) => {
    res.json({
      success: true,

      application:
        "Franky's Study Hub",

      version:
        "1.0.0",

      message:
        "Franky's API is running.",

      services: {
        materials:
          "enabled",

        ai:
          "enabled",
      },
    });
  },
);

// ============================================================
// HEALTH CHECK
// ============================================================

app.get(
  "/api/health",
  (_req, res) => {
    res.status(200).json({
      success: true,

      status:
        "healthy",

      application:
        "Franky's Study Hub",

      timestamp:
        new Date().toISOString(),

      environment:
        process.env.NODE_ENV ||
        "development",
    });
  },
);

// ============================================================
// MATERIAL ROUTES
// ============================================================

app.use(
  "/api/materials",
  searchLimiter,
  materialsRouter,
);

// ============================================================
// FRANKY'S AI ROUTES
// ============================================================

app.use(
  "/api/chat",
  aiLimiter,
  chatRouter,
);

// ============================================================
// 404 HANDLER
// IMPORTANT: Keep this AFTER all valid routes.
// ============================================================

app.use(
  (_req, res) => {
    res.status(404).json({
      success: false,

      message:
        "API route not found.",
    });
  },
);

// ============================================================
// GLOBAL ERROR HANDLER
// IMPORTANT: Keep this last.
// ============================================================

app.use(
  (
    error: Error,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction,
  ) => {
    console.error(
      "Server error:",
      error,
    );

    res.status(500).json({
      success: false,

      message:
        process.env.NODE_ENV ===
        "production"
          ? "Internal server error."
          : error.message,
    });
  },
);

// ============================================================
// START SERVER
// ============================================================

app.listen(
  PORT,
  "0.0.0.0",
  () => {
    console.log("");

    console.log(
      "======================================",
    );

    console.log(
      "       FRANKY'S STUDY HUB API",
    );

    console.log(
      "======================================",
    );

    console.log(
      `Server: http://localhost:${PORT}`,
    );

    console.log(
      `Health: http://localhost:${PORT}/api/health`,
    );

    console.log(
      `Materials: http://localhost:${PORT}/api/materials`,
    );

    console.log(
      `AI: http://localhost:${PORT}/api/chat`,
    );

    console.log(
      `Environment: ${
        process.env.NODE_ENV ||
        "development"
      }`,
    );

    console.log(
      "--------------------------------------",
    );

    console.log(
      "✓ OER material search enabled",
    );

    console.log(
      "✓ Franky's AI enabled",
    );

    console.log(
      "✓ API rate limiting enabled",
    );

    console.log(
      "✓ Security headers enabled",
    );

    console.log(
      "======================================",
    );

    console.log("");
  },
);
