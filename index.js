const express = require('express');
const { connection } = require('./config/db');
const jwt = require('jsonwebtoken');
const cors = require("cors")
const { userModel } = require('./models/user.model');
const { todoRoutes } = require('./routes/todo.route');
require("dotenv").config()

const app=express()

app.use(express.json())
app.use(cors({
    origin : "*"
}))

app.get("/",(req,res)=>{
    res.send({"greeting":"welcome"})
})

app.post("/signup",async(req,res)=>{
    const ipAddress = req.ip;
    const {email,password}=req.body
    const ispresent=await userModel.findOne({email})
    if(ispresent){
        return res.send({responce:-1})
    }
    try {
        const new_user=new userModel({
            email,
            password,
            ipaddress:ipAddress
        })
        await new_user.save()
        return res.send({responce:1})
    } catch (error) {
        res.send({responce:0})
    }    
})

app.post("/login",async (req,res)=>{
    const {email,password}=req.body
    const user = await userModel.findOne({email,password})
    if(!user){
        return res.send({responce:-1})
    }
    try {
        const token=await jwt.sign({email},process.env.secret);
        return res.send({responce:1,token:token,userid:user._id})
    } catch (error) {
        console.log(error);
        return res.send({responce:-1})
    }
})

const authentication = (req,res,next)=>{
    if(!req.headers.token){
        return res.send({responce:"user not login"})
    }
    const user_token=req.headers.token
    jwt.verify(user_token, process.env.secret, function (err, decoded) {
        if (err) {
            console.log(err);
        }
        next()
    });
}

app.use(authentication)
app.use("/todos",todoRoutes)

app.listen(process.env.port,async ()=>{
    try {
        await connection
        console.log("database Connected");
    } catch (error) {
        console.log("Some error with connection :"+error);
    }
    console.log("Server Running at http://localhost:"+process.env.port);
})