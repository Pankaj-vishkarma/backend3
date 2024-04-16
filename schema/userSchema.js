const mongoose =require('mongoose')
const bcrypt=require('bcrypt')
const {Schema}=mongoose

const userSchema=new Schema({
    name:{
        type:String
    },
    email:{
        type:String,
        unique:true
    },
    password:{
        type:String
    }
})

userSchema.pre('save',async function(next)
{
    if(!this.isModified('password'))
    return next()
    this.password=await bcrypt.hash(this.password,10)
    return next()
})

module.exports=mongoose.model('vishwakarma',userSchema)