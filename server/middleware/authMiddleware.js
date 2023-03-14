const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const checkAuthentication = asyncHandler(async (req, res, next) => {
  let token;
  try {
    token = req.cookies.access_token;
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    const { isAdmin } = decodedToken;
    if (!isAdmin) {
      throw new Error("not an Admin");
    }

    next();
  } catch (error) {
    console.log(error);
    res.status(401);
    throw new Error("not authorized or invalid token");
  }

  if (!token) {
    res.status(403);
    throw new Error("no token");
  }
});

module.exports = {
  checkAuthentication,
};
