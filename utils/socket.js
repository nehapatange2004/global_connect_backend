import express from "express";
import http from "http";
import { Server } from "socket.io";
import Message from "../models/Message.js";
const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [
      "http://192.168.38.162:5173",
      "http://192.168.43.162:5173",
      "http://192.168.176.162:5173",
      "http://localhost:5173",
      "https://gncipl-professional-networking-platform-frontend-h3ps27scl.vercel.app",
      "https://gncipl-professional-networking-platform-frontend-g5aiosxzc.vercel.app",
      
      "http://localhost:5173"
    ],
  },
});

export const getReceiverSocketId = (userId) => {
  return onlineUsersSocketMap[userId];
};
const onlineUsersSocketMap = [];

io.on("connection", (socket) => {
  //   console.log("A user connected: ", socket.id);
  const userId = socket.handshake.query.userId;
  if (userId) {
    // console.log("userId: ", userId);
    onlineUsersSocketMap[userId] = socket.id;
    io.emit("getOnlineUsers", Object.keys(onlineUsersSocketMap));
    console.log("onlnie Users: ", onlineUsersSocketMap);
  }

  socket.on("sendTypingStatus", ({ to, from }) => {
    console.log("to: ", to);
    const receiverSocketId = onlineUsersSocketMap[to];
    if (receiverSocketId) {
      console.log("Typeing send");
      io.to(receiverSocketId).emit("showTypingStatus", {from});
    }
  });

  socket.on("read", (message) => { 
    const messageId = message._id;
    const updateReadFlag = async (messageId) => {
      await Message.updateOne({"_id": messageId},  {"isRead": true});
      const readUpdated = await Message.findOne({"_id": messageId});
      console.log("updated read flag: ", readUpdated);
      const userToRenderReadStatus = getReceiverSocketId(message.senderId)
      if(userToRenderReadStatus) {
        socket.to(userToRenderReadStatus).emit("readUpdated", messageId);
      }
      
    }
    updateReadFlag(messageId);
  })

  socket.on("disconnect", () => {
    console.log("a user disconnected: ", socket.id);
    delete onlineUsersSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(onlineUsersSocketMap));
  });

  // socket.on("online-users", () => {});
});

export { app, server, io };
