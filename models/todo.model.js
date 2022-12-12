const mongoose = require('mongoose');

const todoSchema=mongoose.Schema({
    taskname:String,
    status:Boolean,
    tag:String,
    userid:String
})

const todoModel=mongoose.model("todo",todoSchema)

module.exports={todoModel}