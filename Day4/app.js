const express = require('express')
const app = express()

app.get('/', (req, res)=>{
    res.send('Main Page')
})

app.get('/about', (req, res)=>{
    res.send('About Page')
})

app.get('/contact', (req, res)=>{
    res.send('Contact Page')
})





app.listen(3030, ()=>{
    console.log('Server is running on port $3030');
    
})