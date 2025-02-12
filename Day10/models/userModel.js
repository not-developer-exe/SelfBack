const mongoose = require('mongoose')

mongoose.connect('mongodb://0.0.0.0:27017/Day10')

const postSchema = mongoose.Schema({
    
        content: String,
        date: {
            type: Date,
            default: Date.now()
        }
    }
)

const userSchema = mongoose.Schema({
    name: String,
    email: String,
    password: String,
    post:[postSchema]
}) 

module.exports = mongoose.model('user', userSchema)