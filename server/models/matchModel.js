const mongoose = require("mongoose");

const matchSchema = mongoose.Schema({
  userId: {
    type: mongoose.ObjectId,
    ref: "User",
    required: true,
  },
  matches: [
    {
      type: mongoose.ObjectId,
      ref: "User",
      required: true,
    },
  ],
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Match", matchSchema);
