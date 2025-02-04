const express = require('express')
const app = express()

app.get('/', (req, res)=>{
    res.send('hey')
})

app.listen(4040, ()=>{
    console.log('Server is running on port 4040');
    
})