const express = require('express');
const { todoModel } = require('../models/todo.model');

const todoRoutes = express.Router()

//Read
todoRoutes.get("/:userid", async (req, res) => {
    const userid = req.params.userid
    const note = await todoModel.find({ userid })
    res.send(note)
})


//Create
todoRoutes.post("/:userid/create", async (req, res) => {
    const userid = req.params.userid
    const { taskname, status, tag } = req.body
    try {
        const new_todo = new todoModel({
            taskname,
            status,
            tag,
            userid
        })
        await new_todo.save()
        res.send({ responce: 1 })
    } catch (error) {
        console.log(error);
        res.send({ responce: 0 })
    }
})

//update
todoRoutes.patch("/:userid/edit/:todoid", async (req, res) => {
    const userid = req.params.userid
    const todoid = req.params.todoid
    
    try {
        const user = await todoModel.findOne({_id:todoid})
        if(userid != user.userid){
            return res.send({responce:-1})
        }
        await todoModel.findByIdAndUpdate(todoid,req.body)
        res.send({responce:1})
    } catch (error) {
        console.log(error);
        res.send({ responce: 0 })
    }
})

//delete
todoRoutes.delete("/:userid/delete/:todoid", async (req, res) => {
    const userid = req.params.userid
    const todoid = req.params.todoid
    
    try {
        const user = await todoModel.findOne({_id:todoid})
        if(userid != user.userid){
            return res.send({responce:-1})
        }
        await todoModel.findByIdAndDelete(todoid,req.body)
        res.send({responce:1})
    } catch (error) {
        console.log(error);
        res.send({ responce: 0 })
    }
})

todoRoutes.get("/6396f068409057969eea5395/status",(req,res)=>{
    console.log(req.query);
})


module.exports = { todoRoutes }