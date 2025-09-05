import express from 'express';
import { createPost, getFeed, updatePost, deletePost } from '../controllers/post.controller.js';
import { protectedRoute } from '../middleware/auth.middleware.js';

const postsRoutes = express.Router();

// All post routes are protected and require a valid token
postsRoutes.post('/', protectedRoute, createPost);
postsRoutes.get('/feed', protectedRoute, getFeed);

// Add these new routes for updating and deleting
postsRoutes.put('/:id', protectedRoute, updatePost);
postsRoutes.delete('/:id', protectedRoute, deletePost);

export default postsRoutes;