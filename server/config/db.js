const mongoose = require("mongoose");

async function connectToDb() {
  try {
    await mongoose.connect(process.env.ATLAS_URI);
    console.log(`successfully connected to db`.cyan.underline);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

module.exports = connectToDb;
