const path = require("path");
const express = require("express");
const colors = require("colors");
const cron = require("node-cron");
require("dotenv").config();
const cors = require("cors");
const db = require("./config/db");
const cookieParser = require("cookie-parser");
const { upsertMatches } = require(".//controllers/matchController");
const { errorHandler } = require("./middleware/errorMiddleware");
const port = process.env.PORT || 3000;

db();

const app = express();

//middlewares
app.use(cookieParser());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ extended: false }));

//routes
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/matches", require("./routes/matchRoutes"));
app.use("/api/messages", require("./routes/messageRoutes"));

app.use(errorHandler);

//jobs
let task = cron.schedule("*/1 * * * *", upsertMatches);
task.start();

//start server
app.listen(port, () => {
  console.log(`server listening on port ${port}`);
});
