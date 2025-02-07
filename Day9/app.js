const express = require('express')
const app = express()
const mongooseConnection = require('./config/mongoose')
const userModel = require('./models/user')

app.get('/', (req,res)=>{
    res.send('hey')
})

app.get('/create', async (req,res)=>{
    const user = await userModel.create({
        username: 'aditya13',
        name: 'Aditya',
        email: 'test@tes.com',
        password: 'pass'
    })


    res.send(user)
})

app.listen(3000, ()=>{
    console.log("server is running")
})