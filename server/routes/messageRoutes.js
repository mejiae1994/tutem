const express = require("express");
const router = express.Router();

const { checkToken } = require("../middleware/authMiddleware");

const {
  createMessage,
  getMessages,
} = require("../controllers/messageController");

router.post("/", checkToken, createMessage);
router.get("/:id", checkToken, getMessages);

module.exports = router;
