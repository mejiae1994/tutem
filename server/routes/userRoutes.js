const express = require("express");
const router = express.Router();
const { checkAuthentication } = require("../middleware/authMiddleware");

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
router.get("/:id", getUser);
router.get("/", checkAuthentication, getUsers);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

module.exports = router;
