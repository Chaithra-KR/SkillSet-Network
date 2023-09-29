const express = require("express")
const userRouter = express.Router();
const userController = require('../Controller/userController')
const {localOtpVariables} = require('../Middleware/otpAuth');
const {sendEmail} = require("../Middleware/nodemailerAuth");



userRouter.get('/generateOtp' ,sendEmail ,localOtpVariables, userController.generateOtp)
userRouter.post('/otp', localOtpVariables, userController.otp)

userRouter.post('/verifyLogin',userController.verifyLogin)

userRouter.get('/userProfile',userController.profileView)
userRouter.post('/EditUserProfile',userController.editProfile)

userRouter.get('/jobView',userController.jobView)

userRouter.post('/saveJob',userController.saveJob)
userRouter.get('/savedJobs',userController.savedJobs)

userRouter.post('/applyJob',userController.applyJob)

userRouter.post('/newPost',userController.newPost)



module.exports = userRouter;