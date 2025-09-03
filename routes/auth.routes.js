import express from "express";
import {
  LogInUser,
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
  console.log("USERDETAILS: ", req.user);
  res.status(200).send(req.user);
});

export default authRoutes;
