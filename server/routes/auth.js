const express=require('express');
const router=express.Router();
const {isAuthenticated,authorizeRoles}=require('../middlewares/auth')
const{registerUser,loginUser,logOutUser,forgotPassword,resetPassword,getUserProfile,updatePassword,updateProfile,getAllUsers, getSingleUser,updateUser,deleteUser}=require('../controllers/authController');

router.route('/register')
    .post(registerUser);

router.route('/login')
    .post(loginUser);

router.route('/logout')
    .get(logOutUser);

router.route('/password/forgot')
    .post(forgotPassword);

router.route('/password/reset/:token')
    .put(resetPassword);

router.route('/me')
    .get(isAuthenticated,getUserProfile)

router.route('/password/update')
    .put(isAuthenticated,updatePassword)

router.route('/me/update')
    .put(isAuthenticated,updateProfile)

router.route('/admin/users')
    .get(isAuthenticated,authorizeRoles('admin'),getAllUsers)

router.route('/admin/user/:id')
    .get(isAuthenticated,authorizeRoles('admin'),getSingleUser)
    .put(isAuthenticated,authorizeRoles('admin'),updateUser)
    .delete(isAuthenticated,authorizeRoles('admin'),deleteUser)

module.exports=router;