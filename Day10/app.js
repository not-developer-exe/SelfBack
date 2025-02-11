const express = require('express')
const app = express()
const userModel = require('./models/userModel')

app.get('/', (req,res)=>{
    res.send('Hey')
})

app.post('./create',async (req, res)=>{
    let user = await userModel.create({
        name: req.params.name,
        email: req.params.email,
        pasword: req.params.password
    })

    res.send(user)
})

app.listen(3000, ()=>{
    console.log('Hello bhai log')
})