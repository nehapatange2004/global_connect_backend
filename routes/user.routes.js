import express from "express";
import { protectedRoute } from "../middleware/auth.middleware.js";
import { getAllUsers, getUserProfile, updateUserProfile } from "../controllers/user.controller.js";

const usersRoutes = express.Router();

usersRoutes.get("/", getAllUsers);
usersRoutes.get("/:userId", getUserProfile);
usersRoutes.post("/:userId", protectedRoute, updateUserProfile);


export default usersRoutes;
