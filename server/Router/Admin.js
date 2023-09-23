const express = require("express")
const adminRouter = express.Router();
const adminController = require('../Controller/adminController')

adminRouter.post('/adminVerifyLogin',adminController.adminVerifyLogin)

adminRouter.get('/viewDashboard',adminController.viewDashboard)


adminRouter.get('/userManagement',adminController.userManagement)
adminRouter.post('/blockUser',adminController.blockUser)
adminRouter.post('/unblockUser',adminController.unblockUser)

adminRouter.get('/companyManagement',adminController.companyManagement)
adminRouter.post('/blockCompany',adminController.blockCompany)
adminRouter.post('/unblockCompany',adminController.unblockCompany)

adminRouter.post('/jobPosition',adminController.jobPosition)
adminRouter.get('/viewJobManage',adminController.viewJobManage)


module.exports = adminRouter;