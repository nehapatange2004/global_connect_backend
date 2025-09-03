import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config();
const JWT_SECRET_KEY = process.env.JWT_SECRET;
dotenv.config();

// authentication check for protected routes.
export const protectedRoute = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      console.log("No token!");
      return res.status(401).send({ messsage: "No token found!" });
    }
    // console.log(1);
    const decoded = jwt.verify(token, JWT_SECRET_KEY);
    // console.log(2);
    // console.log("Decoded: ", decoded);
    if (!decoded) {
      return res.status(401).send({ messsage: "Authentication failed!" });
    }
    const user = await User.findOne({ _id: decoded.userId }).select(
      "-password"
    );

    if (!user) {
      return res.status(401).send({ messsage: "User not found" });
    }
    req.user = user;
    // console.log("The req.user: ", user);

    // console.log(3);
    //   req.user = decoded;
    // console.log(4);
    next();
  } catch (err) {
    console.log("error in verification!");
    return res.status(401).send({ messsage: "Token is invalid!" });
    //   res.send("error in token verification");
  }
};
