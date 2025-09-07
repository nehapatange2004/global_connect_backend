import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/auth.routes.js";
import postsRoutes from "./routes/post.routes.js";
import jobsRoutes from "./routes/job.routes.js"; // ✅ added
import usersRoutes from "./routes/user.routes.js";
import connectionRoutes from "./routes/connection.routes.js"; // ✅ added
dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;
const MONGO_DB_URI = process.env.MONGO_DB_URI;

// ✅ Proper MongoDB connection with correct logging
mongoose
  .connect(MONGO_DB_URI)
  .then(() => console.log("\nMongoDB connected successfully 🌱\n"))
  .catch((err) => console.error("MongoDB connection error:", err));

// ✅ Needed for __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173", // Vite dev server URL
    credentials: true,
  })
);
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ limit: "5mb", extended: true }));
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/posts", postsRoutes);
app.use("/api/jobs", jobsRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/connections", connectionRoutes); // ✅ added
// app.use("/api/users", usersRoutes);
// app.use("/api/messages", messagesRoutes);

// ✅ Serve uploaded files (images/videos)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
