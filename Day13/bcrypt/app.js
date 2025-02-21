const express = require("express");
const app = express();
const bcrypt = require("bcrypt");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.post("/hash", async (req, res) => {
  let salt = await bcrypt.genSalt(10);
  let hash = await bcrypt.hash("rakshu@1314", salt);

  res.send({
    hash: hash,
    salt: salt,
  });
});

app.post("/compare", async (req, res) => {
  let ans = await bcrypt.compare(
    "rakshu@1314",
    "$2b$10$VHRIXxSPRkxiX4YxZgjVM.HxIzgeY77jOiOzeqCxdg2NjQdZENiG."
  );

  res.send(ans)
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
