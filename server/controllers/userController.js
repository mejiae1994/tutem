const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const jtw = require("jsonwebtoken");
const { performance } = require("perf_hooks");

// @desc    Register new user
// @route   POST /api/users/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    res.status(400);
    throw new Error("Please add all fields");
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
  const start = performance.now();
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

  const { password, ...data } = user._doc;
  res.cookie("access_token", token, { httpOnly: true }).status(200).json(data);
  const end = performance.now();
  console.log(`Execution time for api/users/login ${end - start} ms`);
});

// @desc    logout user
// @route   POST /api/users/logout
// @access  Public
const logoutUser = asyncHandler(async (req, res) => {
  const start = performance.now();
  res
    .clearCookie("access_token", {
      sameSite: "none",
      secure: true,
    })
    .status(200)
    .send("User has been logged out.");
  const end = performance.now();
  console.log(`Execution time for api/users/logout ${end - start} ms`);
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
  res.status(200).json(users);
});

// @desc    get filtered users
// @route   GET /api/users/filtered
// @access  Public
const getFilteredUsers = asyncHandler(async (req, res) => {
  const start = performance.now();
  const userSwipes = await User.findById(req.user.id).select(
    "rightSwipe leftSwipe userPreferences"
  );

  if (!userSwipes) {
    res.status(200).json([]);
    return;
  }

  const { rightSwipe, leftSwipe, userPreferences } = userSwipes;
  let swipeSet = new Set([...rightSwipe, ...leftSwipe, req.user.id]);

  //convert back to array to use as filter
  let swipesArray = Array.from(swipeSet);
  //filter users
  const users = await User.find({ _id: { $nin: swipesArray } })
    .where("userPreferences.role")
    .ne(userPreferences.role);

  res.status(200).json(users);
  const end = performance.now();
  console.log(`Execution time for get api/users/filtered ${end - start} ms`);
});

// @desc    update user
// @route   PUT /api/users/:id
// @access  Public
const updateUser = asyncHandler(async (req, res) => {
  const start = performance.now();
  let requestBody = flattenObject(req.body);

  if (checkObjectProp("userPreferences.profileImg", requestBody)) {
    const currentUserImg = await User.findById(req.params.id).select(
      "userPreferences.profileImg"
    );

    const publicImgId = extractPublicId(
      currentUserImg["userPreferences"].profileImg
    );

    //push imgId into the user collection array property
    await User.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          oldImages: publicImgId,
        },
      },
      {
        new: true,
      }
    );
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.params.id,
    {
      $set: requestBody,
    },
    {
      new: true,
    }
  );

  if (!updatedUser) {
    res.status(400);
    throw new Error("User not found");
  }

  res.status(200).json(updatedUser);
  const end = performance.now();
  console.log(`Execution time for put api/users/:id ${end - start} ms`);
});

// @desc    update userSwipe
// @route   PUT /api/users/swipe
// @access  Public
//req.user.id has the id of the person doing the request. user will just update its own rightSwipe array
const updateUserSwipe = asyncHandler(async (req, res) => {
  const updatedSwipe = await User.findByIdAndUpdate(
    req.user.id,
    {
      $push: { rightSwipe: req.body.rightSwipe, leftSwipe: req.body.leftSwipe },
    },
    {
      new: true,
    }
  );

  if (!updatedSwipe) {
    req.status(400);
    throw new Error("swipe not updated");
  }

  res.status(200).json(updatedSwipe);
});

// @desc    delete user
// @route   DEL /api/users/:id
// @access  Public
const deleteUser = asyncHandler(async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json("user has been deleted");
  } catch (error) {
    res.status(204);
    throw new Error(error);
  }
});

//flatten object properties user { userPreferences: { bio} } becomes userPreferences.bio
function flattenObject(obj) {
  const result = {};

  function recurse(obj, currentKey) {
    for (let key in obj) {
      let value = obj[key];

      if (value === null || value === "") {
        continue;
      }
      let newKey = currentKey ? `${currentKey}.${key}` : key;

      if (typeof value === "object") {
        recurse(value, newKey);
      } else {
        result[newKey] = value;
      }
    }
  }

  recurse(obj, "");

  return result;
}
//check if object contains property and its not empty
function checkObjectProp(property, obj) {
  return property in obj && obj[property].length > 0 ? true : false;
}

function extractPublicId(imgUrl) {
  const index = imgUrl.lastIndexOf("/") + 1;
  return imgUrl.substring(index, imgUrl.lastIndexOf("."));
}

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getUser,
  getUsers,
  updateUser,
  deleteUser,
  updateUserSwipe,
  getFilteredUsers,
};
