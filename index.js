import express from "express";
import cors from "cors"
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;
const MONGO_DB_URI = process.env.MONGO_DB_URI;

mongoose.connect(MONGO_DB_URI).then(
    console.log(`\nMongoDB connected successfully 🌱\n`)
).catch((err) => {
    console.log(err)
})
app.use(cors({
    origin: 'http://localhost:5173' // Vite dev server URL

}));
app.use(express.json());

app.use("/api/auth", authRoutes)

// app.use("/api/users", usersRoutes)
// app.use("/api/posts", postsRoutes)
// app.use("/api/jobs", jobsRoutes)
// app.use("/api/messages", messagesRoutes);

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`)
})