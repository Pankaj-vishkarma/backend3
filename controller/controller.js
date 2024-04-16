const bcrypt=require('bcrypt')
const userSchema=require('../schema/userSchema.js')
const emailvalidator=require('email-validator')

const signin=async(req,res)=>{
    const {name,email,password,confirmpassword}=req.body

    if(!name || !email || !password || !confirmpassword)
    {
        return res.status(400).json({
            success:false,
            message:"all fields are required"
        })
    }

    if(password !== confirmpassword)
    {
        return res.status(400).json({
            success:false,
            message:"password and confirmpassword are not match"
        })
    }

    const emailvalid=emailvalidator.validate(email)

    if(!emailvalid)
    {
        return res.status(400).json({
            success:false,
            message:"please provide a valid email"
        })
    }

    const userInfo=await userSchema.findOne({email})

    if(userInfo)
    {
        return res.status(400).json({
            success:false,
            message:"account already exits"
        })
    }

    try{
         
        const usserSave=userSchema(req.body)
        const result= await usserSave.save()

        return res.status(200).json({
            success:true,
            data:result
        })

    }catch(e)
    {
      return res.status(400).json({
        success:false,
        message:e.message
      })
    }
}

const signup=async(req,res)=>{

    const {email,password}=req.body

    if(!email || !password)
    {
        return res.status(400).json({
            success:false,
            message:"email and password are required"
        })
    }

    try{
         
        const user=await userSchema.findOne({email}).select('+password')
        
        if(!user || !(bcrypt.compare(password,user.password)))
        {
            return res.status(400).json({
                success:false,
                message:"invalied details"
            })
        }

        user.password=undefined

        return res.status(200).json({
            success:true,
            data:user
        })

    }catch(e)
    {
       return res.status(400).json({
        success:false,
        message:e.message
       })
    }
}

module.exports={signin,signup}