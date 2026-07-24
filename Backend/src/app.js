import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRouter from "./routes/auth.routes.js";
import chatRouter from "./routes/chat.routes.js";
// import sendMessage  from "./controllers/chat.controller.js";
import cookieParser from "cookie-parser";
import cors from "cors"
import morgan from "morgan"

dotenv.config();




const app = express();


app.use(express.json());
app.use(cookieParser());

app.use(morgan("dev"))

app.use(cors({
  origin: (origin, callback) => {
    if (
      !origin ||
      origin.includes("vercel.app") ||
      origin === "http://localhost:5173"
    ) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "DELETE", "PUT"]
}));

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({ message: "Perplexity API is running" });
});

app.get("/health", (req, res) => {
  res.json({ status: "OK" });
});

// Mount auth routes
app.use("/api/auth", authRouter);

app.use("/api/chats", chatRouter);

export { app };
