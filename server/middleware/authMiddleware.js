const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

//check the token
//all we know is the token information where we store the user ID and isAdmin
const checkToken = asyncHandler(async (req, res, next) => {
  try {
    let token = req.cookies.access_token;

    if (!token) {
      res.status(401);
      throw new Error("no token");
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decodedToken;
    next();
  } catch (error) {
    res.status(403);
    throw new Error("invalid token");
  }
});

// check the user
const checkUser = asyncHandler(async (req, res, next) => {
  checkToken(req, res, next);

  if (!(req.user.id === req.params.id || req.user.isAdmin)) {
    res.status(403);
    throw new Error("not allowed to request user");
  }
});

const checkAdmin = asyncHandler(async (req, res, next) => {
  checkToken(req, res, next);

  const { isAdmin } = req.user;
  if (!isAdmin) {
    res.status(403);
    throw new Error("not an Admin");
  }
});

module.exports = {
  checkToken,
  checkUser,
  checkAdmin,
};
