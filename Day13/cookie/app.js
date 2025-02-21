const express = require('express')
const app = express()
const cookie = require('cookie-parser')

app.use(cookie())

app.get('/', (req,res)=>{
    res.send('hey')
})

app.get('/set', (req,res)=>{
    res.cookie('name', 'Aditya')
    res.send('Cookie is set')
})

app.get('/get', (req,res)=>{
    res.send(req.cookies.name)
})

app.listen(3000, ()=>{
    console.log('Server is running on port 3000')
})