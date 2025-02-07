const moongoose = require("mongoose");
const debuglog = require("debug")("development:mongooseconfig");

moongoose.connect("mongodb://0.0.0.0:27017/testdb3");

const db = moongoose.connection;

db.on("error", (err) => {
  debuglog(err);
});

db.on("open", () => {
  debuglog("connected to db");
});

module.exports = db;
