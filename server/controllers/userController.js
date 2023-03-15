const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const jtw = require("jsonwebtoken");

// @desc    Register new user
// @route   POST /api/users/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    res.status(400);
    throw new Error("please add all fields");
  }

  const userExists = await User.findOne({ username });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    username,
    email,
    password: hashedPassword,
  });

  if (user) {
    res.status(201).json({
      _id: user.id,
      username: user.username,
      email: user.email,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// @desc    login user
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { username } = req.body;

  const user = await User.findOne({ username });

  if (!user) {
    res.status(404);
    throw new Error("Invalid username or user not found");
  }

  const isPasswordValid = await bcrypt.compare(
    req.body.password,
    user.password
  );

  if (!isPasswordValid) {
    res.status(400);
    throw new Error("Wrong password");
  }

  const token = jtw.sign(
    { id: user._id, isAdmin: user.isAdmin },
    process.env.JWT_SECRET
  );

  const { password, isAdmin, ...otherDetails } = user._doc;
  res
    .cookie("access_token", token, { httpOnly: true })
    .status(200)
    .json({ details: { ...otherDetails }, isAdmin });
});

// @desc    get user
// @route   GET /api/users/:id
// @access  Public
const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");

  if (!user) {
    res.status(400);
    throw new Error("invalid user Id or user not found");
  }

  res.status(200).json(user);
});

// @desc    get users
// @route   GET /api/users
// @access  Public
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find();

  if (!users) {
    throw new Error("no users found");
  }

  res.status(200).json(users);
});

// @desc    update user
// @route   PUT /api/users/:id
// @access  Public
const updateUser = asyncHandler(async (req, res) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.params.id,
    { $set: req.body },
    { new: true }
  );

  if (!updatedUser) {
    res.status(400);
    throw new Error("User not found");
  }

  res.status(200).json(updateUser);
});

// @desc    delete user
// @route   DEL /api/users/:id
// @access  Public
const deleteUser = asyncHandler(async (req, res) => {
  const { username, password, isAdmin } = req.body;

  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json("user has been deleted");
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  registerUser,
  loginUser,
  getUser,
  getUsers,
  updateUser,
  deleteUser,
};
