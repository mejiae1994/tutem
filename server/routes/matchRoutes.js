const express = require("express");
const router = express.Router();

const {
  checkToken,
  checkUser,
  checkAdmin,
} = require("../middleware/authMiddleware");

const { getMatch, getMatches } = require("../controllers/matchController");

router.get("/", checkToken, getMatches);
router.get("/:id", checkUser, getMatch);

module.exports = router;
