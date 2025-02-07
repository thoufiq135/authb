const express=require("express")
const route=express.Router()
const jwt=require("jsonwebtoken")

const Power=require("./index")

route.post("/",(req,res)=>{
    const {name,email,password}=req.body
    console.log(name)
    console.log(email)
    console.log(password)
    const payload={
        name:name,
        email:email,
        password:password
    }
    const key=process.env.scretekey;
    try{
        const token=jwt.sign(payload,key)

    res.json(token)
    Power.insertMany([{name:name,mail:email,password:password}]).then(()=>console.log("inserted")).catch((e)=>console.log("gaya"))
    console.log("inserted")
    
    
    }catch(err){
        console.log(err)

    }
})
module.exports=route;