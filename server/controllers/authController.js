const User = require('../models/user');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const sendToken = require('../utils/jwtTokens');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');
const mongoose = require('mongoose')


//register: /api/v1/register
const registerUser= catchAsyncErrors(async(req,res,next)=>{
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
    sendToken(user,200,res);
    // const token = user.getJwtToken();
    // res.status(201).json({
    //     success: true,
    //     user,
    //     token
    // });
})

//login: /api/v1/login
const loginUser = catchAsyncErrors(async(req,res,next)=>{
    const {email,password}=req.body;
    //check if email and password is entered by user
    if(!email || !password){
        return next(new ErrorHandler('Please enter email and password',400));
    }
    //Finding user in database
    const user= await User.findOne({email}).select('+password');
    if(!user){
        return next(new ErrorHandler('Invalid email or password',401));
    }
    //check if password is correct or not
    const isPasswordMatched = await user.comparePassword(password);
    if(!isPasswordMatched){
        return next(new ErrorHandler('Invalid email or password',401));
    }
    // const token = user.getJwtToken();
    // res.status(200).json({
    //     success:true,
    //     token
    // })
    sendToken(user,200,res); 
})

//Forgot password: /api/v1/password/forgot
const forgotPassword = catchAsyncErrors(async(req,res,next)=>{
    const user = await User.findOne({email:req.body.email});
    if(!user){
        return next(new ErrorHandler('User not found with this email',404));
    }
    //get reset token
    const resetToken = user.getResetPasswordToken();
    await user.save({validateBeforeSave:false});

    //create reset password url
    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/password/reset/${resetToken}`;

    const message = `Your password reset token is as follows:\n\n ${resetUrl}\n\nIf you have not requested this email, then ignore it.`

    try{
        await sendEmail({
            email:user.email,
            subject:'Password Recovery',
            message
        })
        res.status(200).json({
            success:true,
            message:`Email sent to ${user.email}`
        })
    }catch(error){
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({validateBeforeSave:false});
        return next(new ErrorHandler(error.message,500));
    }
})


//logout: /api/v1/logout
const logOutUser = catchAsyncErrors(async(req,res,next)=>{
    res.cookie('token',null,{
        expires:new Date(Date.now()),
        httpOnly:true
    })
    res.status(200).json({
        success:true,
        message:'Logged out'
    })
})

//reset password: /api/v1/password/reset/:token
const resetPassword = catchAsyncErrors(async(req,res,next)=>{
    //hash url token
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire:{$gt:Date.now()}
    })
    if(!user){
        return next(new ErrorHandler('Password reset token is invalid or has been expired',400));
    }
    if(req.body.password !== req.body.confirmPassword){
        return next(new ErrorHandler('Password does not match',400));
    }
    //setup new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    sendToken(user,200,res);
    // const token = user.getJwtToken();
    // res.status(200).json({
    //     success:true,
    //     token
    // })
})

//Update user profile => /api/v1/me/update
const updateProfile = catchAsyncErrors(async(req,res,next)=>{

    const newData={
        name:req.body.name,
        email:req.body.email
    }

    //Update Avatar


    const user = await User.findByIdAndUpdate(req.user.id,newData,{
        new:true,
        runValidators:true,
        useFindAndModify:false
    });

    res.status(200).json({
        success:true,
        user
    })

})

//Update/Change password => /api/v1/password/update
const updatePassword = catchAsyncErrors(async(req,res,next)=>{

    const user = await User.findById(req.user.id).select('+password');

    const isMatched = await user.comparePassword(req.body.oldPassword)

    if(!isMatched){
        return next(new ErrorHandler('Password does not match'),400);
    }

    user.password=req.body.password;
    await user.save();
    sendToken(user,200,res);
})


//Get currently logged in user details: /api/v1/me
const getUserProfile = catchAsyncErrors(async(req,res,next)=>{
    const user= await User.findById(req.user.id);
    if(!user){
        return next(new ErrorHandler('No such user exists',400));
    }
    res.status(200).json({
        success:true,
        user
    })
})


//Admin Routes

//get all users => /api/v1/admin/users
const getAllUsers = catchAsyncErrors(async(req,res,next)=>{
    const users= await User.find();
    res.status(200).json({
        success:true,
        users,
    })
})

//get single user details => /api/v1/admin/user/:id
const getSingleUser = catchAsyncErrors(async(req,res,next)=>{
    const userId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return next(new ErrorHandler('Invalid User ID', 400));
    }
    const user = await User.findById(req.params.id);
    if(!user){
        return next(new ErrorHandler('No such user found',400));
    }
    res.status(200).json({
        success: true,
        user
    })
})

//update user profile by admin =>/api/v1/admin/:id
const updateUser = catchAsyncErrors(async(req,res,next)=>{
    const userId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return next(new ErrorHandler('Invalid User ID', 400));
    }
    const newData={
        name:req.body.name,
        email: req.body.email,
        role:req.body.role
    }
    const user = await User.findByIdAndUpdate(req.params.id,newData,{
        new:true,
        runValidators:true,
        useFindAndModify:false
    })
    res.status(200).json({
        success:true,
        user
    })
})

//Delete user =>/api/v1/admin/user/:id
const deleteUser = catchAsyncErrors(async(req,res,next)=>{
    const userId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return next(new ErrorHandler('Invalid User ID', 400));
    }
    const user = await User.findById(req.params.id);
    if(!user){
        return next(new ErrorHandler('No such user found',400));
    }
    //Remove avatar from cloudinary

    await user.deleteOne();
    res.status(200).json({
        success:true,
        user
    })
})

module.exports = {registerUser,loginUser,logOutUser,forgotPassword,resetPassword,getUserProfile,updatePassword,updateProfile,getAllUsers,getSingleUser,updateUser,deleteUser}