import express from "express";
import {
  createNotification,
  getUserNotifications,
  markAsRead,
} from "../controllers/notificationController.js";

const router = express.Router();

router.post("/", createNotification);          // Create notification
router.get("/:userId", getUserNotifications);  // Fetch notifications
router.patch("/:id/read", markAsRead);         // Mark as read

export default router;  // ✅ default export
