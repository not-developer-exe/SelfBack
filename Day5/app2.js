// All about routing

const express = require('express')
const app = express()

app.get('/', (req, res)=>{
    res.send('Main Page')
})

app.get('/about', (req, res)=>{
    res.send('About Page')
})

app.get('/profile/:username', (req,res)=>{
    res.send('This is ' +req.params.username+ "'s page")  ////This is how Dynamic routing is done...
})

app.get('/auth/:username/:age', (req, res)=>{
    res.send(`This page is all about ${req.params.username} who's age is ${req.params.age}`)
})

app.listen(4000, ()=>{
    console.log('Chalne lagiiii... Mera Yasuu Yassuuu');
    
})