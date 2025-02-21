const mongoose = require('mongoose')

const postSchema = mongoose.Schema({
   user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user" ////// Whatever id will come, it'll get searched in User Collection
   },
   content: String

})

module.exports = mongoose.model('post', postSchema)