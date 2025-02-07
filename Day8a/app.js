const express = require('express')
const app = express()
const mongooseconnection = require('./config/mongoose')
const userModel = require('./models/user')

const users = [
    { name: "Alice Johnson", email: "alice@example.com", password: "alice123", age: "25" },
    { name: "Bob Smith", email: "bob@example.com", password: "bob456", age: "30" },
    { name: "Charlie Brown", email: "charlie@example.com", password: "charlie789", age: "28" },
    { name: "David Lee", email: "david@example.com", password: "david101", age: "35" },
    { name: "Emma Wilson", email: "emma@example.com", password: "emma202", age: "27" },
    { name: "Frank Thomas", email: "frank@example.com", password: "frank303", age: "32" },
    { name: "Grace Miller", email: "grace@example.com", password: "grace404", age: "29" },
    { name: "Henry Davis", email: "henry@example.com", password: "henry505", age: "31" },
    { name: "Ivy Clark", email: "ivy@example.com", password: "ivy606", age: "26" },
    { name: "Jack White", email: "jack@example.com", password: "jack707", age: "33" }
];

app.get('/', (req, res)=>{
    res.send('Hey')
})

app.get('/create', async (req,res)=>{
    let user = await userModel.insertMany(users)
    res.send(user)
})

app.get('/find', async (req,res)=>{
    let find = await userModel.find({age: {$ne: 25}})
    res.send(find)
})

app.get('/finder', async (req,res)=>{
    let find = await userModel.find({age: {$in: [25,30,28]}})
    res.send(find)
})



app.listen(3000)