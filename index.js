import express from "express";
import dotenv from "dotenv";

import { errorHandler } from "./middlewares/error.middleware.js";

const app = express();

dotenv.config();

const PORT = process.env.PORT || 8000;

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// api end points

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

app.listen(PORT, () => {
  console.log(`Server is running on the port ${PORT}`);
});
