import User from "../models/User.js";
import { error } from "../utils/error.utils.js";
import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_secret: process.env.API_SECRET,
    api_key: process.env.API_KEY,
});


export const getAllUsers = async (req, res) => {
    try {
        const allUserProfiles = await User.find().select("-password -connectionRequests -savedJobs");
        return res.send(allUserProfiles)

    } catch (err) {
        console.log("Error in getUserProfile", err)
        return res.status(500).send(error("Error in getting all users", { err }));
    }
}

export const getUserProfile = async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await User.findById(userId).lean();

        delete user.password;

        if (userId.toString() !== req.user._id.toString()) {
            delete user.connectionRequests;
            delete user.savedJobs;
            return res.status(200).send(user);
        }

        return res.status(200).send(user);
    } catch (err) {
        console.log("Error in getUserProfile", err)
        return res.status(500).send(error("Error in getting profile", err));
    }
}

export const updateUserProfile = async (req, res) => {
    try {
        const userId = req.params.userId;
        const updates = req.body;
        console.log(`userID: ${userId}, \nreq._id: ${req.user._id}`)
        if (userId.toString() !== req.user._id.toString()) {
            return res.status(400).send(error("UnAuthorized!"))
        }

        // Restricted fields which are updatable
        const allowedFields = [
            "name",
            "bio",
            "experience",
            "education",
            "skills",
        ];

        const filteredUpdates = {};

        if (req.body.profilePic) {
            const response = await cloudinary.uploader.upload(req.body.profilePic, {
                public_id: `profilePic-${userId}`,
                overwrite: true,
                folder: "samples/test1",
            });
            filteredUpdates["profilePic"] = response.secure_url
        }

        for (const key of allowedFields) {
            if (updates[key] !== undefined) {
                filteredUpdates[key] = updates[key];
            }
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            { $set: filteredUpdates },
            { new: true, runValidators: true }
        ).select("-password");

        if (!updatedUser) {
            return res.status(404).send(err("User Not Found!"));
        }
        console.log("updatedUser: ", updatedUser)


        return res.status(200).send(updatedUser);

    } catch (err) {
        console.log("Error in updateUserProfile", err);
        return res.status(500).status(error("The profile update failed", err))
    }
}