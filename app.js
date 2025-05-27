import express from "express";
import cors from "cors";

const app = express();
import authRoutes from "./src/routes/authRoutes.js";
import { globalErrorHandler } from "./src/middlewares/errorHandlers.js";
import cookieParser from "cookie-parser";

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/auth", authRoutes)

app.get("/", (req, res) => {
  res.send("API is running...");
});

/* app.all("*", (req, res, next) => {
  const error = new Error(`Can't find ${req.originalUrl} on this server!`);
  error.statusCode = 404;
  error.status = "fail";
  next(error);
}) */

app.use(globalErrorHandler);

export default app;
