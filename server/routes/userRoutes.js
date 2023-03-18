const express = require("express");
const router = express.Router();
const {
  checkToken,
  checkUser,
  checkAdmin,
} = require("../middleware/authMiddleware");

const {
  registerUser,
  loginUser,
  getUser,
  getUsers,
  updateUser,
  deleteUser,
  updateUserSwipe,
} = require("../controllers/userController");

const { createMatches } = require("../controllers/matchController");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.put("/swipe", checkToken, updateUserSwipe);
router.get("/:id", checkUser, getUser);
router.get("/", checkAdmin, getUsers);
router.put("/:id", checkUser, updateUser);
router.delete("/:id", checkUser, deleteUser);

module.exports = router;
