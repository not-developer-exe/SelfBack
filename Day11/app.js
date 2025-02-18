const express = require("express");
const userModel = require("./models/userModel");
const postModel = require("./models/postModel");
const connectDB = require("./config/mongoose");

const app = express();
const port = 3000;

connectDB();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// app.get("/match", async (req, res) => {
//   let users = await userModel.aggregate([{ $match: { age: 30 } }]);

//   res.send(users);
// });

// /// Group
// app.get("/group", async (req, res) => {
//   let users = await userModel.aggregate([
//     {
//       $group: {
//         _id: "$age",
//         data: { $push: "$$ROOT" },
//       },
//     },
//   ]);

//   res.send(users);
// });

// app.get("/find", async (req, res) => {
//   let users = await postModel.find().populate("author");

//   res.send(users);
// });

// ///Lookup
// app.get("/lookup", async (req, res) => {
//   let users = await postModel.aggregate([
//     {
//       $lookup: {
//         from: "users",
//         localField: "author",
//         foreignField: "_id",
//         as: "author",
//       },
//     },
//   ]);

//   res.send(users);
// });

// /// Project
// app.get("/project", async (req, res) => {
//   let users = await userModel.aggregate([
//     {
//       $project: {
//         name: 1,
//         createdAt: 1,
//         age: 1,
//       },
//     },
//   ]);

//   res.send(users);
// });

/// Example -1 (Find all post made by Tony Stark)
// app.get('/posts', async (req, res) => {
//   let posts = await postModel.aggregate([
//     {
//       $lookup:{
//         from: 'users',
//         localField: 'author',
//         foreignField: '_id',
//         as: 'author'
//       }
//     },
//     {
//       $unwind: '$author'
//     },
//     {
//       $match: {
//         'author.name' : 'Tony Stark'
//       }
//     }
//   ]);

//   res.send(posts);
// });


/// Get all post with author name and email includued
app.get('/posts', async (req, res)=>{
  let posts = await postModel.aggregate([
    {
      $lookup:{
        from: 'users',
        localField: 'author',
        foreignField: '_id',
        as: 'author'
      }
    },
    {
      $unwind: '$author'
    },
    {
      $project:{
        title: 1,
        content: 1,
        'author.name': 1,
        'author.email': 1
      }
    }
  ])

  res.send(posts);
})

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
