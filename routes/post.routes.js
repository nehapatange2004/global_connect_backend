import express from "express";
import { createPost, getFeed, updatePost, deletePost } from "../controllers/post.controller.js";
import { protectedRoute } from "../middleware/auth.middleware.js";
import upload from "../middleware/upload.middleware.js";

const postsRoutes = express.Router();

// Create a post with multiple files (max 5)
postsRoutes.post("/", protectedRoute, upload.array("media", 5), createPost);

// Get feed
postsRoutes.get("/feed", protectedRoute, getFeed);

// Update post
postsRoutes.put("/:id", protectedRoute, upload.array("media", 5), updatePost);

// Delete post
postsRoutes.delete("/:id", protectedRoute, deletePost);

export default postsRoutes;
