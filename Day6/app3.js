const express = require('express')
const app = express()

let data=[1,2,3,4,5]

app.get('/', (req,res)=>{
    res.send('Hey, wassup??')
})

app.post('/data/:number',(req,res)=>{
   data.push(parseInt(req.params.number))
    res.send(data)
})

app.get('/new', (req,res)=>{
    res.send(data)
})

app.listen(3000, ()=>{
    console.log('Server is running');
    
})