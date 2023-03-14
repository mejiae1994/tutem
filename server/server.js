const path = require("path");
const express = require("express");
const colors = require("colors");
require("dotenv").config();
const cors = require("cors");
const db = require("./config/db");
const cookieParser = require("cookie-parser");
const port = process.env.PORT || 3000;

db();

const app = express();

//middlewares
app.use(cookieParser());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ extended: false }));

//routes
app.use("/api/users", require("./routes/userRoutes"));

//start server
app.listen(port, () => {
  console.log(`server listening on port ${port}`);
});
