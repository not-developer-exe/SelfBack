const mongoose = require('mongoose')
const debuglog = require('debug')('development:mongooseconfig') ///Something new and maybe imp

mongoose.connect('mongodb://0.0.0.0:27017/testdb')

const db = mongoose.connection

db.on('error', (err)=>{
    debuglog(err)
})
db.on('open', ()=>{
    debuglog("connected to server")
})

module.exports = db