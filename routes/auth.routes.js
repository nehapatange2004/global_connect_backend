import express from "express";
import {
  LogInUser,
  logoutUser,
  registerUser,
  
} from "../controllers/auth.controller.js";
import { protectedRoute } from "../middleware/auth.middleware.js";
import User from "../models/User.js";

const authRoutes = express.Router();

// logging in the user
authRoutes.post("/login", LogInUser);

// register new user
authRoutes.post("/register", registerUser);


//when page refreshes this will re-fetch the user details.
authRoutes.get("/dash", protectedRoute, async (req, res) => {
  console.log("User is Authenticated")
  res.status(200).send(req.user);
});

// To logout user i.e claer the token cookie
authRoutes.get("/logout", logoutUser);

export default authRoutes;
