const mongoose = require('mongoose')

mongoose.connect('mongodb://0.0.0.0:27017/JOI')

const userSchema = mongoose.Schema({
    username: {
        type: String,
        minLength: 3,
        required: true
    },
    name: {
        type: String,
        minLength:3,
        required: true
    },
    age: {
        type: Number,
        min: 18,
        required: true
    },
    contact: {
        type: String,
        minLength: 10,
        required: true
    },
    email: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('user', userSchema)