const express = require('express')
const app = express()
const cors = require('cors')

app.use(cors())

app.get('/', (req, res)=>{
    res.send('Hello DuniaWalo')
})

app.get('/share', cors(), (req, res)=>{
    res.send('Gendu Generation...')
})

app.listen(3000, ()=>{
    console.log('nacho');
    
})