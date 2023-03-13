const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

// const edison = {
//   name: "Edison",
//   email: "edison23@gmail.com",
//   password: "edison123456",
// };

// @desc    Register new user
// @route   GET /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  console.log({ name, email, password });
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("please add all fields");
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  if (user) {
    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// @desc    Register new user
// @route   GET /api/users
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  res.status(200);
});

// @desc    Register new user
// @route   GET /api/users
// @access  Public
const getMe = asyncHandler(async (req, res) => {
  res.status(200);
});

module.exports = {
  registerUser,
  loginUser,
  getMe,
};
