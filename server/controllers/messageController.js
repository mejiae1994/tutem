const asyncHandler = require("express-async-handler");
const Message = require("../models/messageModel");

const createMessage = asyncHandler(async (req, res) => {
  let messageId = Array.from(req.user.id + req.body.recipient)
    .sort()
    .join("");

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

  const headers = {
    "Content-Type": "text/event-stream",
    Connection: "keep-alive",
    "Cache-Control": "no-cache",
  };

  res.writeHead(200, headers);

  const initialMessages = await Message.find({ id: messageId });
  const eventData = `data: ${JSON.stringify(initialMessages)}\n\n`;
  res.write(eventData);

  const messages = Message.watch(
    { id: messageId },
    { operationType: "insert" }
  );

  messages.on("change", async () => {
    const initialMessages = await Message.find({ id: messageId });
    const eventData = `data: ${JSON.stringify(initialMessages)}\n\n`;
    res.write(eventData);
  });

  messages.on("error", (error) => console.log(error));

  req.on("close", () => {
    console.log("Client connection closed");
    res.end();
    messages.close();
  });
});

module.exports = {
  createMessage,
  getMessages,
};
