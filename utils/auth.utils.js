import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET_KEY = process.env.JWT_SECRET;
const AUTH_EMAIL = process.env.AUTH_EMAIL;
const AUTH_PASS = process.env.AUTH_PASS;
const CLIENT_URL = process.env.CLIENT_URL;


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
    expiresIn: '10d',
  });

  console.log(token);
  return token;
};

export const sendPasswordResetEmail = async (email) => {
  try {

    const transporter = nodemailer.createTransport({
     secure: true,
      service: "gmail",
      auth: {
        user: AUTH_EMAIL,
        pass: AUTH_PASS,
      },
      logger: true,
      debug: true,
    });
    // generate token valid for 15 mins
    const token = jwt.sign({ email }, JWT_SECRET_KEY, {
      expiresIn: '15m',
    });

    const resetLink = `${CLIENT_URL}/reset-password?token=${token}`;

    await transporter.sendMail({
      from: AUTH_EMAIL,
      to: email,
      subject: "Global Connect: Password Reset",
      html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
    });

    console.log("Reset email sent! with token: ", token);
  } catch (err) {
    console.log("Error in sending email", err);
    throw Error("Error in sending email")
  }
}
