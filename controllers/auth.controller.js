import {
  comparePasswords,
  generateToken,
  hashPassword,
} from "../utils/auth.utils.js";
import User from "../models/User.js";

import dotenv from "dotenv";
import { error } from "../utils/error.utils.js";
dotenv.config();

export const LogInUser = async (req, res) => {
  try {
    if(!req.body.email || !req.body.password) {
      console.log("All fields are required")
      return res.send(error("All fields marked * are required", "please fill all feilds"))
    }
    const user = await User.findOne({ email: req.body.email }).lean();

    //match the password
    if (!user) {
      return res.status(401).send(error("User not found!"));
    }

    const isMatch = await comparePasswords(req.body.password, user.password);

    if (!isMatch) {
      return res.status(401).send(error("Invalid Credentials!"));
    }
    delete user.password;
    const token = generateToken(user._id, user.email)
    user.token = token;
    res.cookie("token", token, {
      // expiresIn: "10s",
      maxAge: 30000,
      httpOnly: true,
      
    })
    return res.send(user);
  } catch (err) {
    console.log(err);
    return res.status(500).send(error("Can't login right now", "Internal Server Error"))
  }
};

export const registerUser = async (req, res) => {
  try {
    // console.log(req.body.name);
    // console.log(req.body.email);
    // console.log(req.body.password);
    if(!req.body.name || !req.body.email || req.body.password) {
      return res.send(err("All fields marked * are required"))
    }
    console.log("1")
    console.log(`Body: ${req.body}`)
    const user = await User.findOne({ email: req.body.email });

    if (user) {
      console.log("User already exists: ", user);
      return res
        .status(403)
        .send(error("Already have an account! Consider logging in!"));
    }
    const hashedPassword = await hashPassword(req.body.password);

    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    });
    await newUser.save();
    const createdUser = await User.findOne({ email: req.body.email });
    // const foundUser = {
    //   email: createdUser?.email,
    //   name: createdUser?.name,
    //   token: generateToken(createdUser?._id, createdUser?.email),
    // };

    const foundUser = {
      _id: createdUser?._id,
      name: createdUser?.name,
      email: createdUser?.email,
      token: generateToken(createdUser?._id, createdUser?.email),
    };

    console.log("Account Created successfully!");
    return res.send(foundUser);
  } catch (err) {
    console.log("Error while getting data from mongo: ", err);
    return res.send({ error: err });
  }
};
