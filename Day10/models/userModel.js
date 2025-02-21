const mongoose = require('mongoose')

mongoose.connect('mongodb://0.0.0.0:27017/Day10')

const userSchema = mongoose.Schema({
    name: String,
    email: String,
    password: String,
    post: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "post" ////// Whatever id will come, it'll get searched in Post Collection
    }]
}) 

module.exports = mongoose.model('user', userSchema)