const express = require("express")
const adminRouter = express.Router();

adminRouter.get('/login')
adminRouter.post('/login')
adminRouter.get('/logout')

adminRouter.get('/userManagement')
adminRouter.post('/blockUser')
adminRouter.post('/unblockUser')

adminRouter.get('/companyManagement')
adminRouter.post('/blockCompany')
adminRouter.post('/unblockCompany')

module.exports = adminRouter;