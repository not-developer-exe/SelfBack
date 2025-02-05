//// Error handling

const express = require("express");
const app = express()


app.get('/', (req,res, next)=>{
    try{
        res.send(hey)
    }catch(err){
        next(err)
    }
})

app.get('/check', (req,res)=>{
    res.send('hey')
})


/// Error handler
app.use((err, req, res, next)=>{
    res.status(500).send('Something went wrong')
})



app.listen(3000, ()=>{
    console.log('kaam krra hai code');
    
})