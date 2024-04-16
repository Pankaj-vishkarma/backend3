const JWT=require('jsonwebtoken')
const mongoose =require('mongoose')
const bcrypt=require('bcrypt')
const {Schema}=mongoose

const userSchema=new Schema({
    firstname:{
        type:String
    },
    lastname:{
        type:String
    },
    email:{
        type:String,
        unique:true
    },
    dateofbirth:{
       type:String
    },
    mobile:{
       type:String
    },
    address:{
       type:String
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

userSchema.methods={
    jwtToken()
    {
        return JWT.sign(
            {id:this._id,email:this.email},
            process.env.SECRET,
            {expiresIn:'24h'}
        )
    }
}

module.exports=mongoose.model('vishwakarma',userSchema)