const express = require("express")
const companyRouter = express.Router();
const stripe = require('stripe')(process.env.STRIPE_KEY)
const {localOtpVariables} = require('../Middleware/otpAuth')
const companyController = require('../Controller/companyController');
const { CompanyAuth } = require("../Middleware/companyAuth");

companyRouter.get('/company-generateOtp', localOtpVariables, companyController.generateOtp)
companyRouter.post('/company-otp', localOtpVariables, companyController.otp)

companyRouter.post('/company-payment', companyController.premiumPayment)

companyRouter.post('/verifyCompanyLogin' ,companyController.verifyCompanyLogin)

companyRouter.get('/companyProfile' ,companyController.profileView)
companyRouter.post('/EditCompanyProfile',companyController.editProfile)

companyRouter.post('/JobPosting' ,companyController.JobPosting)
companyRouter.get('/JobDetails' ,companyController.JobDetails)

companyRouter.get('/notifications' ,companyController.notifications)

companyRouter.get('/userProfileView' , companyController.userProfileView)
companyRouter.get('/singlePost' ,companyController.singlePost)

companyRouter.post('/postComment' ,companyController.postComment)

companyRouter.post('/changePassword' ,companyController.changePassword)

companyRouter.get('/getChat',companyController.getChat)
companyRouter.post('/sendMessage',companyController.sendMessage)
companyRouter.get('/getMessage/:conversationId',companyController.getMessage)
companyRouter.get('/seekers',companyController.seekers)

companyRouter.post('/acceptEmployee',companyController.acceptEmployee)
companyRouter.post('/rejectEmployee',companyController.rejectEmployee)



module.exports = companyRouter;