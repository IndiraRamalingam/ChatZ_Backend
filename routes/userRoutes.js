const express=require('express')
const router=express.Router();
const userController = require('../controllers/user/userController');
const resetPassword = require('../controllers/user/resetPassword')

//Signup and generate the activation link
router.post('/signup',userController.signup);

//Signin and generate JWT token
router.post('/signin',userController.signin);

//token generation and mail send
router.post('/forgot_password',resetPassword.sendToken);

//verfifying token and reset password
router.post('/reset_password/:token',resetPassword.verifyAndUpdatePassword);

//to get all users
router.get('/get_all_id/:id',userController.getAllIds)

//set Avatar route
router.post('setAvatar/:id',userController.setAvatar)

module.exports=router;