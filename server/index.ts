import "dotenv/config";

import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import materialsRouter
  from "./routes/materials.js";

const app =
  express();

const PORT =
  Number(
    process.env.PORT,
  ) || 5000;

const CLIENT_URL =
  process.env.CLIENT_URL ||
  "http://localhost:5173";

app.set(
  "trust proxy",
  1,
);

app.use(
  helmet(),
);

app.use(
  cors({
    origin:
      CLIENT_URL,

    credentials: true,
  }),
);

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

const generalLimiter =
  rateLimit({
    windowMs:
      15 * 60 * 1000,

    limit: 300,

    standardHeaders:
      "draft-8",

    legacyHeaders:
      false,
  });

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

app.use(
  "/api",
  generalLimiter,
);

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
    });
  },
);

app.get(
  "/api/health",
  (_req, res) => {
    res.json({
      success: true,

      status:
        "healthy",

      timestamp:
        new Date().toISOString(),
    });
  },
);

app.use(
  "/api/materials",
  searchLimiter,
  materialsRouter,
);

app.use(
  (_req, res) => {
    res.status(404).json({
      success: false,

      message:
        "API route not found.",
    });
  },
);

app.use(
  (
    error: Error,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction,
  ) => {
    console.error(error);

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

app.listen(
  PORT,
  "0.0.0.0",
  () => {
    console.log("");
    console.log(
      "======================================",
    );

    console.log(
      "      FRANKY'S STUDY HUB",
    );

    console.log(
      "======================================",
    );

    console.log(
      `API: http://localhost:${PORT}`,
    );

    console.log(
      `Health: http://localhost:${PORT}/api/health`,
    );

    console.log(
      "OER material search enabled",
    );

    console.log(
      "======================================",
    );
  },
);
