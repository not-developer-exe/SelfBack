const mongoose = require('mongoose')

mongoose.connect('mongodb://0.0.0.0:27017/Day10')

const userSchema = mongoose.Schema({
    name: String,
    email: String,
    password: String,
    post:[
        {
            content: String,
            date: {
                type: Date,
                default: Date.now()
            }
        }
    ]
})

mongoose.exports = mongoose.model('user', userSchema)