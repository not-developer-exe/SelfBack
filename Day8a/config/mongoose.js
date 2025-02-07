const mongoose = require("mongoose");
const debuglog = require("debug")("development:mongoosecongif");

mongoose.connect("mongodb://0.0.0.0:27017/testdb2");

const db = mongoose.connection;

db.on("error", (err) => {
  debuglog(err);
});

db.on("open", () => {
  debuglog("DB Connected");
});

module.exports = db;
