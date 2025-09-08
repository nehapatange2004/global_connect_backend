import express from "express";
import { protectedRoute } from "../middleware/auth.middleware.js";
import { getUsersForChat, getMessages, deleteMessage, editMessage, sendMessage } from "../controllers/message.controller.js";
import upload from "../middleware/upload.middleware.js";

const messagesRoutes = express.Router();

messagesRoutes.get("/", protectedRoute, getUsersForChat);
messagesRoutes.get("/:userId", protectedRoute, getMessages);
messagesRoutes.post("/:userId", protectedRoute, upload.array("media", 5), sendMessage);
messagesRoutes.delete("/:messageId", protectedRoute, deleteMessage)
messagesRoutes.put("/:messageId", protectedRoute, upload.array("media", 5), editMessage);
export default messagesRoutes;
