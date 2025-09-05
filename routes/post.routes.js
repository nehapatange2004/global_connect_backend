import express from 'express';
import { createPost, getFeed, updatePost, deletePost } from '../controllers/post.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

// All post routes are protected and require a valid token
router.post('/', authMiddleware, createPost);
router.get('/feed', authMiddleware, getFeed);

// Add these new routes for updating and deleting
router.put('/:id', authMiddleware, updatePost);
router.delete('/:id', authMiddleware, deletePost);

export default router;