const express = require('express')
const app = express()
const cookieparser = require('cookie-parser')

app.use(cookieparser())

app.get('/', (req, res)=>{
    res.send('Hello DuniaWalo')
})

app.get('/check', (req, res)=>{
    console.log(req.cookies.isDead);
    res.send('check terminal bsdk')
})

app.get('/dead', (req, res)=>{
    res.cookie('isDead', 'true')
    res.send('dead')
})

app.listen(3000, ()=>{
    console.log('nacho');
    
})

