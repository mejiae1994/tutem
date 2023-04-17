const mongoose = require("mongoose");

//might need to add  for swipes [{ type : ObjectId, ref: 'User' }]
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
    rightSwipe: [{ type: mongoose.ObjectId, ref: "User" }],
    leftSwipe: [{ type: mongoose.ObjectId, ref: "User" }],
    userPreferences: {
      role: {
        type: String,
        enum: ["Educator", "Pupil"],
        default: "Pupil",
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
        default:
          "https://static.vecteezy.com/system/resources/thumbnails/002/608/327/small/mobile-application-avatar-web-button-menu-digital-silhouette-style-icon-free-vector.jpg",
      },
    },
    interests: {
      type: [
        {
          interest: {
            type: String,
            required: true,
          },
          enabled: {
            type: Number,
            required: true,
            default: 0,
          },
        },
      ],
      default: [
        {
          interest: "Web Dev",
          enabled: 0,
        },
        {
          interest: "Game Developer",
          enabled: 0,
        },
        {
          interest: "Data Science",
          enabled: 0,
        },
        {
          interest: "Programming Math",
          enabled: 0,
        },
      ],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
