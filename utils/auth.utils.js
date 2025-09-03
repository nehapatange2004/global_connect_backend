import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET_KEY = process.env.JWT_SECRET;

export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

export const comparePasswords = async (pass1, hash) => {
  //we compare the plain text password witht hte hashed one!
  try {
    const isMatch = await bcrypt.compare(pass1, hash);
    console.log("isMatch1: ", isMatch);
    return isMatch;
  } catch (err) {
    console.log("Error: ", err);
  }
};

export const generateToken = (userId, email) => {
  const token = jwt.sign({ userId, email }, JWT_SECRET_KEY, {
    expiresIn: "30d",
  });

  console.log(token);
  return token;
};

