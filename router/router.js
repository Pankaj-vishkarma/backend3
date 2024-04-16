const express=require('express')
const {signin,signup,profile, logout}=require('../controller/controller.js')
const auth = require('../middleware/auth.js')
const router=express.Router()


router.post('/signin',signin)
router.post('/signup',signup)
router.get('/profile',auth,profile)
router.get('/logout',auth,logout)

module.exports=router