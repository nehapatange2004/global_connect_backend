import mongoose from "mongoose";
import User from "../models/User.js";

// ============================
// Send connection request
// ============================
export const sendConnectionRequest = async (req, res) => {
  try {
    const { userId } = req.params; // target user (receiver)
    const senderId = req.user._id; // logged-in user (_id always use)

    console.log("📩 sendConnectionRequest called");
    console.log("senderId:", senderId, "receiverId:", userId);

    if (senderId.toString() === userId.toString()) {
      return res
        .status(400)
        .json({ success: false, message: "You can't connect with yourself" });
    }

    const sender = await User.findById(senderId);
    const receiver = await User.findById(userId);

    if (!receiver) {
      console.log("❌ Receiver not found");
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    console.log("✅ Receiver found:", receiver.email);

    // Already connected?
    const alreadyConnected = sender.connections.some(
      (id) => id.toString() === userId.toString()
    );
    if (alreadyConnected) {
      return res
        .status(400)
        .json({ success: false, message: "Already connected" });
    }

    // Already requested?
    const alreadyRequested = receiver.connectionRequests.some(
      (id) => id.toString() === senderId.toString()
    );
    if (!alreadyRequested) {
      receiver.connectionRequests.push(senderId);
      await receiver.save();
      console.log("💾 Request saved for:", receiver.email);
    }

    res
      .status(200)
      .json({ success: true, message: "Connection request sent" });
  } catch (error) {
    console.error("🔥 Error in sendConnectionRequest:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============================
// Accept connection request
// ============================
export const acceptConnectionRequest = async (req, res) => {
  try {
    const { userId } = req.params; // who sent the request
    const receiverId = req.user._id; // logged-in user (_id always use)

    const receiver = await User.findById(receiverId);
    const sender = await User.findById(userId);

    if (!sender)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    const hasRequest = receiver.connectionRequests.some(
      (id) => id.toString() === userId.toString()
    );
    if (!hasRequest) {
      return res
        .status(400)
        .json({ success: false, message: "No request from this user" });
    }

    // Remove from pending requests
    receiver.connectionRequests = receiver.connectionRequests.filter(
      (id) => id.toString() !== userId.toString()
    );

    // Add to each other's connections
    if (!receiver.connections.some((id) => id.toString() === userId.toString())) {
      receiver.connections.push(userId);
    }
    if (!sender.connections.some((id) => id.toString() === receiverId.toString())) {
      sender.connections.push(receiverId);
    }

    await receiver.save();
    await sender.save();

    console.log("✅ Receiver connections after save:", receiver.connections);
    console.log("✅ Sender connections after save:", sender.connections);

    res
      .status(200)
      .json({ success: true, message: "Connection request accepted" });
  } catch (error) {
    console.error("🔥 Error in acceptConnectionRequest:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============================
// Reject connection request
// ============================
export const rejectConnectionRequest = async (req, res) => {
  try {
    const { userId } = req.params;
    const receiverId = req.user._id;

    const receiver = await User.findById(receiverId);

    const hasRequest = receiver.connectionRequests.some(
      (id) => id.toString() === userId.toString()
    );
    if (!hasRequest) {
      return res
        .status(400)
        .json({ success: false, message: "No request from this user" });
    }

    receiver.connectionRequests = receiver.connectionRequests.filter(
      (id) => id.toString() !== userId.toString()
    );

    await receiver.save();

    res
      .status(200)
      .json({ success: true, message: "Connection request rejected" });
  } catch (error) {
    console.error("🔥 Error in rejectConnectionRequest:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============================
// Get all connections
// ============================
export const getConnections = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate(
      "connections",
      "name email profilePic"
    );

    console.log("📡 Connections fetched:", user.connections);

    res.status(200).json({
      success: true,
      connections: user.connections,
      count: user.connections.length,
    });
  } catch (error) {
    console.error("🔥 Error in getConnections:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============================
// Get pending connection requests
// ============================
export const getConnectionRequests = async (req, res) => {
  try {
    console.log("📥 getConnectionRequests called for:", req.user._id);

    const user = await User.findById(req.user._id).populate(
      "connectionRequests",
      "name email profilePic"
    );

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    console.log("Pending requests:", user.connectionRequests);

    res.status(200).json({
      success: true,
      requests: user.connectionRequests,
    });
  } catch (error) {
    console.error("🔥 Error in getConnectionRequests:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
