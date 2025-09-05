import express from "express";
import { protectedRoute } from "../middleware/auth.middleware.js";
import { getUsersForChat, getMessages, deleteMessage, editMessage, sendMessage } from "../controllers/message.controller.js";

const messagesRoutes = express.Router();

messagesRoutes.get("/", protectedRoute, getUsersForChat);
messagesRoutes.get("/:userId", protectedRoute, getMessages);
messagesRoutes.post("/:userId", protectedRoute, sendMessage);
messagesRoutes.delete("/:messageId", protectedRoute, deleteMessage)
messagesRoutes.put("/:messageId", protectedRoute, editMessage);
export default messagesRoutes;
