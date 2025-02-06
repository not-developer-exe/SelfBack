const express = require("express");
const app = express();
const mongooseconnection = require("./config/mongoose");
const userModel = require("./models/user");
const debuglog = require("debug")("development:app");

app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.get("/", (req, res) => {
  res.send("Hey");
});

// app.get("/create", async (req, res) => {
//   let user = await userModel.create({
//     name: "Aditya",
//     age: 23,
//     email: "test@test.com",
//     password: "pass",
//   }); 
//   debuglog("user created");
//   res.send(user);
// });

app.get('/users', async (req, res)=>{
  let users = await userModel.find()

  res.send(users)
})

app.get('/read/:name',async (req, res)=>{
    let userRead = await userModel.findOne({name: req.params.name})

    console.log('User read')
    res.send(userRead)
})

app.get('/update/:username', async (req, res)=>{
    let updated = await userModel.findOneAndUpdate({name: req.params.username}, {name: 'Addditya'}, {new: true})

    console.log("User Updated")
    res.send(updated)
})

app.post('/new',async (req, res)=>{
  let {name, age, email, password} = req.body

  let newUser = await userModel.create({
    name,
    age, 
    email,
    password
  })

  res.send(newUser)
})

app.get('/delete',async (req, res)=>{
  let deleted = await userModel.findOneAndDelete({name:'Aditya'})

  console.log('User Deleted')
  res.send(deleted)
})

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
