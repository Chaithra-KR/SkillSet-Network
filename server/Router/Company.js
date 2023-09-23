const express = require("express")
const companyRouter = express.Router();
const stripe = require('stripe')(process.env.STRIPE_KEY)
const {localOtpVariables} = require('../Middleware/otpAuth')
const companyController = require('../Controller/companyController')

companyRouter.get('/company-generateOtp', localOtpVariables, companyController.generateOtp)
companyRouter.post('/company-otp', localOtpVariables, companyController.otp)

companyRouter.post('/company-payment', companyController.premiumPayment)

companyRouter.post('/verifyCompanyLogin',companyController.verifyCompanyLogin)

companyRouter.get('/companyProfile',companyController.profileView)
companyRouter.post('/EditCompanyProfile',companyController.editProfile)

companyRouter.post('/JobPosting',companyController.JobPosting)
companyRouter.get('/JobDetails',companyController.JobDetails)


module.exports = companyRouter;