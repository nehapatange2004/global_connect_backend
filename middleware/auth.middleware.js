import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/User.js";

import { error } from "../utils/error.utils.js";
dotenv.config();
const JWT_SECRET_KEY = process.env.JWT_SECRET;
dotenv.config();

// authentication check for protected routes.

export const protectedRoute = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    console.log(`token in cookies: ${token}`)
    if (!token) {
      console.log("No token!");
      return res.status(401).send(error("Please log-in"));
    }
    
    const decoded = jwt.verify(token, JWT_SECRET_KEY);
    console.log(2);
    
    if (!decoded) {
      return res.status(401).send({ messsage: "Authentication failed!" });
    }
    console.log("Token decoded");
    const user = await User.findOne({ _id: decoded.userId }).select(
      "-password"
    );

    if (!user) {
      return res.status(401).send({ messsage: "User not found" });
    }
    req.user = user;
    console.log("The req.user: ", user);

    next();
  } catch (err) {
    console.log("error in verification!");
    return res.status(505).send(error("Failed to authenticate user", "Internal Server Error"));
  }
};
