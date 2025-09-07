import User from "../models/User.js";
import Message from "../models/Message.js";
import { getReceiverSocketId, io } from "../utils/socket.js";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config();
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_secret: process.env.API_SECRET,
  api_key: process.env.API_KEY,
});


export const getUsersForChat = async (req, res) => {
  try {
    // console.log(req.user);
    const loggedInUser = req.user.id;
    const allUsers = await User.find({ _id: { $ne: loggedInUser } });
    // console.log("Here all users: ", allUsers);
    res.status(200).send(allUsers);
  } catch (err) {
    console.log("error in gettiing users for chat: ", err);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const receiverId = req.params.userId;
    const myId = req.user._id;
    const allMessages = await Message.find({
      $or: [
        { senderId: myId, receiverId: receiverId },
        { senderId: receiverId, receiverId: myId },
      ],
    });
    return res.send({
      my: myId,
      receiver: receiverId,
      allMessages: allMessages,
    });
  } catch (err) {
    console.log("error in gettiing user messages: ", err);
    return res.status(500).send({ message: "Internal Server Error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    console.log("Body of the sendMessage api: ", req.body);
    if(req.file) {
      console.log(`A file uploaded in message`)
    }
    const text = req.body.text;
    const image = req.body.file;
    console.log("text: ", text);
    

    let img_url = "";
    // const filePath = req.file?.path;
    if (image) {
      const response = await cloudinary.uploader.upload(image, {
        public_id: "MessageImg",
        overwrite: true,
        folder: "samples/test1",
      });
      // console.log("The cloudinary response: ", response);
      img_url = response.secure_url;
      // fs.unlinkSync(filePath);
    }
    const senderId = req.user._id;
    const receiverId = req.params.userId;
    const newMessage = new Message({
      senderId: senderId,
      receiverId: receiverId,
      text: text,
      image: image ? img_url : null,
    });
    newMessage.save();
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }
    console.log("new Message: ", newMessage);
    res.status(201).send(newMessage);
  } catch (err) {
    console.log("error in sending message: ", err);
    return res.status(500).send({ message: "Internal Server Error" });
  }
};

export const deleteMessage = async (req, res) => {
  try {
    const messageId = req.params.messageId;
    if (!messageId) {
      return res.status(404).send({ message: "No message Id received" });
    }
    const message = await Message.findOne({ _id: messageId });
    console.log("The messageId to be deleted is: ", message);
    console.log("The messageId to be deleted is: ", message._id);
    await Message.deleteOne({ _id: messageId });
    console.log("Message deleted succesfully");
    const receiverSocketId = getReceiverSocketId(message.receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("deletedMessage", message);
    }
    res.status(200).send(message);
  } catch (err) {
    console.log("error in sending message: ", err);
    return res.status(500).send({ message: "Internal Server Error" });
  }
};

export const editMessage = async (req, res) => {
  try {
    const messageId = req.params.messageId
    const modifiedText = req.body.text;
    const message = await Message.findOne({_id: messageId});
    if(!message) {
      console.log("No message found with id: ", messageId);
      return res.status(404).send({message: "Message not found!"});
    }
    await Message.updateOne({_id: messageId}, {$set: {
      text: modifiedText
    }})
    const updatedMessage = await Message.findOne({_id: messageId});
    const receiverSocketId = getReceiverSocketId(updatedMessage.receiverId);
    if(receiverSocketId){
      io.to(receiverSocketId).emit("updatedMessage", updatedMessage);
    }
    res.status(200).send(updatedMessage);
  } catch (err) {
    console.log("error in sending message: ", err);
    return res.status(500).send({ message: "Internal Server Error" });
  }
};
