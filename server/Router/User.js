const express = require("express")
const userRouter = express.Router();
const userController = require('../Controller/userController')
const {localOtpVariables} = require('../Middleware/otpAuth')


userRouter.get('/generateOtp', localOtpVariables, userController.generateOtp)
userRouter.post('/otp', localOtpVariables, userController.otp)

userRouter.get('/userLogin')
userRouter.post('/userLogin')
userRouter.get('/userLogout')

userRouter.get('/userProfile')
userRouter.get('/EditUserProfile')
userRouter.post('/EditUserProfile')

module.exports = userRouter;