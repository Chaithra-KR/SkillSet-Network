const express = require("express")
const userRouter = express.Router();
const userController = require('../Controller/userController')
const {localOtpVariables} = require('../Middleware/otpAuth');
const { UserAuth} = require("../Middleware/userAuth");



userRouter.get('/generateOtp', localOtpVariables, userController.generateOtp)
userRouter.post('/otp', localOtpVariables , userController.otp)

userRouter.post('/verifyLogin' ,userController.verifyLogin)

userRouter.get('/userProfile' ,userController.profileView)
userRouter.post('/EditUserProfile' ,userController.editProfile)

userRouter.get('/jobView' ,userController.jobView)

userRouter.post('/saveJob' ,userController.saveJob)
userRouter.get('/savedJobs', userController.savedJobs)

userRouter.post('/applyJob', userController.applyJob)

userRouter.post('/newPost',userController.newPost)


userRouter.post('/changePassword',userController.changePassword)
userRouter.post('/emailVerify',userController.emailVerify)
userRouter.post('/forgotPassword',userController.forgotPassword)
userRouter.post('/forgotPasswordOtp',userController.forgotPasswordOtp)


userRouter.get('/singlePost', userController.singlePost)
userRouter.post('/postComment', userController.postComment)


userRouter.get('/getChat',userController.getChat)
userRouter.post('/sendMessage',userController.sendMessage)
userRouter.get('/getMessage/:conversationId',userController.getMessage)
userRouter.get('/companies',userController.companies)

userRouter.post('/requestAsEmploy',userController.requestAsEmploy)

userRouter.post('/upgradePayment',userController.upgradePayment)

userRouter.get('/visitNetwork',userController.visitNetwork)

userRouter.post('/sendConnectionRequest',userController.sendConnectionRequest)
userRouter.post('/acceptConnectionRequest',userController.acceptConnectionRequest)

userRouter.post('/reportPost',userController.reportPost)


module.exports = userRouter;