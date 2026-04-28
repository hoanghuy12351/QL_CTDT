import cors from "cors";
import express from "express";
import { env } from "./config/env.js";
import routes from "./routes/index.js";
import { errorMiddleware, notFoundMiddleware } from "./common/middlewares/error.middleware.js";

const app = express();

app.use(
  cors({
    origin: env.corsOrigin,
    credentials: true,
  }),
);

app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1", routes);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;
