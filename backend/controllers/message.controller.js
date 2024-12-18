import Conversation from "../modals/conversion.modals.js";
import Message from "../modals/message.modal.js";
import mongoose from "mongoose";

import { getReceiverSocketId, io } from "../socket/socket.js";
export const sendMessage = async (req, res) => {
  console.log("sendMessage function called");
  try {
    const { message } = req.body;
    const senderId = req.user._id;
    const reciverId = req.params.reciverId;
    // console.log("senderId:", senderId);
    // console.log("reciverId:", reciverId);
    // console.log("Type of reciverId:", typeof reciverId);
    if (!mongoose.Types.ObjectId.isValid(reciverId)) {
      return res.status(400).json({ error: "Invalid reciverId" });
    }

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, reciverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, reciverId],
      });
    }

    const newMessage = new Message({
      senderId,
      reciverId,
      message,
    });
    if (newMessage) {
      conversation.messages.push(newMessage._id);
    }

    // await conversation.save();
    // await newMessage.save();
    await Promise.all([conversation.save(), newMessage.save()]);

    const reciverSocketId = getReceiverSocketId(reciverId);
    if (reciverSocketId) {
      io.to(reciverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (e) {
    console.log("error in  Send Message  " + e.message);
    return res.status(500).json({ error: "Internal Error" });
  }
};

export const getMessages = async (req, res) => {
  console.log("sendMessage function called");
  try {
    const senderId = req.user._id;
    const chatWithId = req.params.Id;

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, chatWithId] },
    }).populate("messages");

    if (!conversation) {
      return res.status(200).json([]);
    }
    res.status(200).json(conversation);
  } catch (e) {
    console.log("error in  Send Message  " + e.message);
    return res.status(500).json({ error: "Internal Error" });
  }
};
