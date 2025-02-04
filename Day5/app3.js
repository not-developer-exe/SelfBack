const express = require('express')
const app = express()

app.set('view engine', 'ejs')
app.use(express.json())
app.use(express.urlencoded({extended: true}))


app.get('/', (req, res)=>{
    res.render('index')
})

app.post('/create', (req, res)=>{
    console.log(req.body);
    res.send('Form Submitted')
})

app.listen(4000, ()=>{
    console.log('Systumm paaaadh denge');
    
})