const express = require("express")
const companyRouter = express.Router();

companyRouter.get('/companyRegister')
companyRouter.post('/companyRegister')

companyRouter.get('/otp')
companyRouter.post('/otp')

companyRouter.get('/companyLogin')
companyRouter.post('/companyLogin')
companyRouter.get('/companyLogout')

companyRouter.get('/companyProfile')
companyRouter.get('/EditCompanyProfile')
companyRouter.post('/EditCompanyProfile')

module.exports = companyRouter;