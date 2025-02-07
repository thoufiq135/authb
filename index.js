const express=require("express")
const mongoose=require("mongoose")

const cors=require("cors")
const jwt=require("jsonwebtoken")
require("dotenv").config()
const app=express()
app.use(cors())
app.use(express.json())
const uri=process.env.MONGU
mongoose.connect(uri).then(()=>console.log("Connected to mongo db")).catch(err=>console.log("Cannot connect to mongo db"))
const schema=new mongoose.Schema({
    name:String,
    email:String,
    password:String
})
const Power=mongoose.model("data",schema)

const port=5000
// --------------------------------------------------------------login---------------------------------------------
app.post("/loginin",(req,res)=>{
    const token=req.headers["authorization"];
    const {email,password}=req.body
    console.log(email,password)
    console.log("token=",token)
   try{
    const pay=jwt.verify(token.split(" ")[1],process.env.scretekey)
    console.log("pay=",pay.name)
    if(pay.email&&pay.password){
        if(pay.email===email&&pay.password===password){
            res.status(200).json({message:pay.name})
        }else{
            res.status(401).json({message:"Invalid email or password"})
        }
    }else{
        res.status(401).json({message:"Use not Exists!"})
    }
   }catch(err){
    res.status(404).json({message:"Token not exists!"})
   }
    
})
// -----------------------------------------------------------signup---------------------------------------------
app.use(async(req,res,next)=>{
    const{email}=req.body
    const existing =await Power.find({email:{$eq:email}})
    if (existing.length === 0) {
        next();
    } else {
        return res.status(400).json({ message: "User already exists!" });
    }
})
app.post("/Signup",(req,res)=>{
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
    Power.insertMany([{name:name,email:email,password:password}]).then(()=>console.log("inserted")).catch((e)=>console.log("gaya"))
    }catch(err){
        console.log(err)

    }
})
// --------------------------------------------------------------------------------------------------------------------------------------------
app.get("/",(req,res)=>{    
    res.send("<h1>Hello world</h1>") 
})
app.listen(port,()=>{
    console.log(`server is working on port ${port}...`)
})
module.exports=Power