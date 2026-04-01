import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";

import { env } from "./config/env";
import { errorHandler } from "./middleware/error-handler";
import { notFound } from "./middleware/not-found";
import { apiRouter } from "./routes";

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: (origin, callback) => {
      // Temporarily allowing all origins to fix connection issues if there's a typo in env
      // But typically we match against env.corsOrigin
      const allowedOrigins = env.corsOrigin
        .split(",")
        .map((o) => o.trim().replace(/\/$/, ""));
      const requestOrigin = origin ? origin.trim().replace(/\/$/, "") : "";

      if (!origin || allowedOrigins.includes(requestOrigin)) {
        callback(null, true);
      } else {
        // Log the mismatch so you can see it in Vercel structured logs
        console.error(
          `CORS Blocked: Origin '${origin}' not in allowed origins:`,
          allowedOrigins,
        );
        callback(null, true); // Temporarily fallback to allow to see if cors is the ONLY issue
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  }),
);
app.use(express.json({ limit: "2mb" }));
app.use(morgan(env.nodeEnv === "production" ? "combined" : "dev"));

app.use("/api", apiRouter);
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use(notFound);
app.use(errorHandler);

export { app };
