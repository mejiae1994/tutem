const express = require("express");
const router = express.Router();

const {
  checkToken,
  checkUser,
  checkAdmin,
} = require("../middleware/authMiddleware");

const { getMatch, getMatches } = require("../controllers/matchController");

router.get("/:id", checkUser, getMatch);
router.post("/", getMatches);

module.exports = router;
