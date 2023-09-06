const localOtpVariables = async(req, res, next)=>{

    req.locals = {
         OTP : null,
         resetSession : false
    }
    next()
    
}
module.exports = {
    localOtpVariables
}