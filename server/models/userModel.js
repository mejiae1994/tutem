const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Please add a username"],
      unique: true,
    },
    email: {
      type: String,
      required: [true, "Please add an email"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please add a password"],
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    userPreferences: {
      interest: {
        type: String,
        enum: ["teach", "learn"],
        default: "learn",
      },
      preferredLanguage: {
        type: String,
        default: "English",
      },
      bio: {
        type: String,
        maxlength: 500,
      },
      profileImg: {
        type: String,
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
