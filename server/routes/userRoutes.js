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
} = require("../controllers/userController");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/:id", checkUser, getUser);
router.get("/", checkAdmin, getUsers);
router.put("/:id", checkUser, updateUser);
router.delete("/:id", checkUser, deleteUser);

module.exports = router;
