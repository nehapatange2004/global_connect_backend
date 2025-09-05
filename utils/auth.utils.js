import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET_KEY = process.env.JWT_SECRET;
const AUTH_EMAIL = process.env.AUTH_EMAIL;
const AUTH_PASS = process.env.AUTH_PASS;
const CLIENT_URL = process.env.CLIENT_URL?process.env.CLIENT_URL:"http://localhost:5173";


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
  from: `"Global Connect" <${AUTH_EMAIL}>`,
  to: email,
  subject: "Global Connect: Password Reset",
  html: `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Password Reset</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f6f8;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 500px;
            margin: 40px auto;
            background: #ffffff;
            border-radius: 8px;
            padding: 30px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          }
          h2 {
            color: #333333;
            font-size: 20px;
            margin-bottom: 16px;
          }
          p {
            color: #555555;
            font-size: 14px;
            line-height: 1.6;
          }
          .button {
            display: inline-block;
            margin-top: 20px;
            padding: 12px 20px;
            font-size: 14px;
            font-weight: bold;
            color: #ffffff !important;
            background-color: #007bff;
            text-decoration: none;
            border-radius: 6px;
          }
          .footer {
            margin-top: 30px;
            font-size: 12px;
            color: #888888;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>Reset Your Password</h2>
          <p>Hello,</p>
          <p>
            We received a request to reset your password. Click the button below
            to set a new password:
          </p>
          <a href="${resetLink}" class="button">Reset Password</a>
          <p>
            ⚠️ This link is valid for <strong>10 minutes</strong>. After that, it will expire.
          </p>
          <p>
            If you didn’t request a password reset, you can safely ignore this
            email.
          </p>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Global Connect. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `,
});


    console.log("Reset email sent! with token: ", token);
  } catch (err) {
    console.log("Error in sending email", err);
    throw Error("Error in sending email")
  }
}
