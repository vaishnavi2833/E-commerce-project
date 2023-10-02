const User = require('../models/user');
const errorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');

const registerUser= catchAsyncErrors(async(req,res,err,next)=>{
    const {name,email,password}=req.body;
    const user = await User.create({
        name,
        email,
        password,
        avatar:{
            public_id:'this is a sample id',
            url:'profilepic.jpg'
        }
    })
    res.status(201).json({
        success: true,
        user
    });
})

module.exports = {registerUser}