import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/User.js";

import { error } from "../utils/error.utils.js";
dotenv.config();
const JWT_SECRET_KEY = process.env.JWT_SECRET;

// authentication check for protected routes
export const protectedRoute = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    console.log(`token in cookies: ${token}`);
    if (!token) {
      console.log("No token!");
      return res.status(401).send(error("Please log-in"));
    }

    const decoded = jwt.verify(token, JWT_SECRET_KEY);
    console.log("Decoded token:", decoded);

    if (!decoded) {
      return res.status(401).send({ message: "Authentication failed!" });
    }

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(401).send({ message: "User not found" });
    }

    // ✅ Attach user to request
    req.user = user;            // full mongoose user document
    req.user._id = user._id;    // always ObjectId
    // (Don't overwrite as "id", because controllers rely on _id)

    console.log("The req.user: ", req.user._id.toString());

    next();
  } catch (err) {
    console.log("Error in verification!", err);
    return res
      .status(500)
      .send(error("Failed to authenticate user", "Internal Server Error"));
  }
};
