const mongoose = require("mongoose");

const messageSchema = mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
    },
    owner: {
      type: mongoose.ObjectId,
      ref: "User",
      required: true,
    },
    recipient: {
      type: mongoose.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Message", messageSchema);
