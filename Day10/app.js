const express = require('express')
const app = express()
const userModel = require('./models/userModel')


app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.get('/', (req,res)=>{
    res.send('Hey')
})

app.post('/create',async (req, res)=>{
    let user = await userModel.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    })

    console.log(user)
    res.send(user)
})

app.post('/:name/post', async (req,res)=>{
    let user = await userModel.findOne({name: req.params.name})
    user.post.push({content: 'Ye gyi post teeeesraaaaa...'})
    await user.save()
    res.send(user)
})


app.listen(3030, ()=>{
    console.log('Hello bhai log')
})