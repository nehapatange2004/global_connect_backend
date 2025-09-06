import express from "express";
import { protectedRoute } from "../middleware/auth.middleware.js";
import {
  sendConnectionRequest,
  acceptConnectionRequest,
  rejectConnectionRequest,
  getConnections,
  getConnectionRequests,
} from "../controllers/connection.controller.js";

const router = express.Router();

// Send request
router.post("/request/:userId", protectedRoute, sendConnectionRequest);

// Accept request
router.post("/accept/:userId", protectedRoute, acceptConnectionRequest);

// Reject request
router.post("/reject/:userId", protectedRoute, rejectConnectionRequest);

// Get all connections
router.get("/", protectedRoute, getConnections);

// Get pending requests
router.get("/requests", protectedRoute, getConnectionRequests);

export default router;
