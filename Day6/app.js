const express = require('express')
const app = express()


app.get('/check', (req, res)=>{
    res.send('Kam krra hai')
})

app.listen(3000, ()=>{
    console.log('Server is running...');
    
})