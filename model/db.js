const mongoose = require("mongoose");
require("dotenv").config();
const uriDb = process.env.URI_DB;

const db = mongoose.connect(uriDb, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

mongoose.connection.on("connected", () => {
  console.log("mongoose connection to db");
});

mongoose.connection.on("error", (err) => {
  console.log(`mongoose connection error: ${err.message}`);
});

mongoose.connection.on("disconnected", () => {
  console.log("mongoose disconnected");
});

process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.log("Connection for db closed");
  process.exit(1);
});

module.exports = db;
