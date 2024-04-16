const bcrypt=require('bcrypt')
const userSchema=require('../schema/userSchema.js')
const emailvalidator=require('email-validator')

const signin=async(req,res)=>{
    const {firstname,lastname,email,dateofbirth,mobile,address,password,confirmpassword}=req.body

    if(!firstname || !lastname || !email || !dateofbirth || !mobile || !address || !password || !confirmpassword)
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
        
        const token=user.jwtToken()

        user.password=undefined

        const cookieOption={
            maxAge:24*60*60*1000,
            httpOnly:true
        }

        res.cookie('token',token,cookieOption)

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

const profile=async(req,res)=>{
    const userId=req.user.id
     try{
        const user=await userSchema.findById(userId)
        return res.status(200).json({
            success:true,
            data:user
        })
     }catch(e)
     {
       return res.status(400).json({
        success:false,
        message:"e.message"
       })
     }
}

const logout=(req,res)=>{
   try{
        const cookieOption={
            expires:new Date(),
            httpOnly:true
        }

        res.cookie('token',null,cookieOption)
        return res.status(200).json({
            success:true,
            message:"Logged out"
        })

   }catch(e)
   {
      res.status(400).json({
        success:false,
        message:e.message
      })
   }
}

module.exports={signin,signup,profile,logout}