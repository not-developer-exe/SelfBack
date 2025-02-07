const express = require("express");
const app = express();
const userModel = require("./models/user");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("hey");
});

app.post("/create", async (req, res) => {
  const user = await userModel.create({
    name: req.body.name,
  });

  res.send(user)
});

app.listen(3000, () => {
  console.log("server is running");
});
