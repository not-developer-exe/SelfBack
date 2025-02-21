const express = require("express");
const app = express();
const userModel = require("./models/userModel");
const postModel = require("./models/postModel")

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//// Creation of User
app.post("/create", async (req, res) => {
  let user = await userModel.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });

  console.log(user);
  res.send(user);
});


/// Referencing Relationship..
app.post('/:name/create/post',async (req, res)=>{
    let user = await userModel.findOne({name: req.params.name})
    let post = await postModel.create({
       content: "vsjrjvbrhb",
       user: user._id
    })
     
    user.post.push(post._id)
    await user.save()

    res.send({user, post})

})

///Population..
app.get('/posts', async (req,res)=>{
    let post = await postModel.find().populate('user')

    res.send(post)
})

app.get('/users', async (req,res)=>{
    let users = await userModel.find().populate('post')

    res.send(users)
})


app.listen(3030, () => {
  console.log("Hello bhai log");
});
