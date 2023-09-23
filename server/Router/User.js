const express = require("express")
const userRouter = express.Router();
const userController = require('../Controller/userController')
const {localOtpVariables} = require('../Middleware/otpAuth')


userRouter.get('/generateOtp', localOtpVariables, userController.generateOtp)
userRouter.post('/otp', localOtpVariables, userController.otp)

userRouter.post('/verifyLogin',userController.verifyLogin)

userRouter.get('/userProfile',userController.profileView)
userRouter.post('/EditUserProfile',userController.editProfile)

userRouter.get('/jobView',userController.jobView)


module.exports = userRouter;