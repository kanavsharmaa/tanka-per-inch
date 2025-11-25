import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

// Middleware ---->
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS Configuration ---->
app.use(
  cors({
    origin: "*",
  })
);

// routes import ---->
import userRouter from "./routes/user.route.js";
import categoryRouter from "./routes/category.route.js";

// routes declaration ---->
app.use("/api/v1/users", userRouter);
app.use("/api/v1/categories", categoryRouter);

export default app;
