import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import { rateLimit } from "express-rate-limit";
import hpp from "hpp";

import { errorHandler } from "./middlewares/error.middleware.js";
import eventRouter from "./routes/event.route.js";

const app = express();
dotenv.config();
const PORT = process.env.PORT || 8000;

// this is used from documentation
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  limit: 100, // only 100 request allowed by per ip in 15 min
  standardHeaders: "draft-8",
  legacyHeaders: false,
});

// security middleware
app.use(helmet()); // by default it add 14 security related http header
app.use(hpp()); // It prevents parameter pollution by removing duplicate query parameters.
app.use("/api", limiter);

// logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// body parser middleware
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// cors for configuration
// this is also from documentation and we will add allowed headers
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true, // when we using cookies
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD", "OPTIONS"],
  })
);

// api end points
app.use("/api/v1/events", eventRouter);

// 404 handler -> means when the route is not existed
app.use((req, res) => {
  res.status(404).json({
    status: "error",
    statusCode: 404,
    message: "Route not found",
    success: false,
  });
});

// global error handler
app.use(errorHandler);

// running our server
app.listen(PORT, () => {
  console.log(`Server is running on the port ${PORT}`);
});
