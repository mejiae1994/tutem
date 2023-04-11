const asyncHandler = require("express-async-handler");
const Message = require("../models/messageModel");
const User = require("../models/userModel");

const createMessage = asyncHandler(async (req, res) => {
  let messageId = Array.from(req.user.id + req.body.recipient)
    .sort()
    .join("");
  console.log(messageId);

  const message = await Message.create({
    id: messageId,
    owner: req.user.id,
    recipient: req.body.recipient,
    content: req.body.messageContent,
  });

  if (message) {
    res.status(201).json(message);
  } else {
    res.status(400);
    throw new Error("Invalid message");
  }
});

const getMessages = asyncHandler(async (req, res) => {
  let messageId = Array.from(req.user.id + req.params.id)
    .sort()
    .join("");
  const messages = await Message.find({ id: messageId });

  if (!messages) {
    throw new Error("no messages found");
  }

  res.status(200).json(messages);
});

module.exports = {
  createMessage,
  getMessages,
};
