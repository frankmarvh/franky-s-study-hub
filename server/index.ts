import "dotenv/config";

import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

const app = express();

const PORT = Number(process.env.PORT) || 5000;

const CLIENT_URL =
  process.env.CLIENT_URL || "http://localhost:5173";

app.set("trust proxy", 1);

app.use(helmet());

app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
  }),
);

app.use(
  express.json({
    limit: "2mb",
  }),
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "2mb",
  }),
);

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: "draft-8",
  legacyHeaders: false,
});

app.use("/api", apiLimiter);

app.get("/api", (_req, res) => {
  res.json({
    success: true,
    application: "Franky's Study Hub",
    message: "Franky's API is running.",
    version: "1.0.0",
  });
});

app.get("/api/health", (_req, res) => {
  res.status(200).json({
    success: true,
    status: "healthy",
    timestamp: new Date().toISOString(),
  });
});

app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found.",
  });
});

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
        process.env.NODE_ENV === "production"
          ? "Internal server error."
          : error.message,
    });
  },
);

app.listen(PORT, "0.0.0.0", () => {
  console.log("");
  console.log("========================================");
  console.log("        FRANKY'S STUDY HUB API");
  console.log("========================================");
  console.log(`Server: http://localhost:${PORT}`);
  console.log(`Health: http://localhost:${PORT}/api/health`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
  console.log("========================================");
  console.log("");
});
