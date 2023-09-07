const otpGenerator = require('otp-generator')
const nodemailer = require('nodemailer')
const User = require('../Model/userModel')


const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,

    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS,
    },
});

exports.otp = async(req,res)=>{
    try {
        const enteredOtp = parseInt(req.body.otp.join(""))
        const generatedOtp = parseInt(req.app.locals.OTP)
        if (generatedOtp === enteredOtp) {
            console.log("otp verified");
            const userData = req.body.data
            const newUser = new User({
                username: userData.username,
                dob: userData.dob,
                headline: userData.headline,
                about: userData.about,
                email: userData.email,
                password: userData.password
            })
            await newUser.save()
            res.status(200).json({success: true , message: "Registration success"})
        }else{
            console.log("invalid otp");
            res.json({success:false, message:"Invalid OTP!"})
        }
    } catch (error) {
        res.status(500).json({ success: false, serverMessage: "Internal Server Error" });
    }
}

exports.generateOtp = async(req,res)=>{
    try {
        const OTP = otpGenerator.generate(6,{lowerCaseAlphabets:false, upperCaseAlphabets:false, specialChars:false})
        console.log(OTP,"otp");
        req.app.locals.OTP = OTP
        const mailFormat = {
            from: "narphocart@gmail.com",
            
            to: req.query.data,
            subject: "SkillSet Network : One Time Password",
            html: "<h4>Hai dear,</h4><br><p>Welcome to SkillSet portal! Thank you for registration. Your One Time Password (OTP) is "+ OTP + "</p><span>Sincerely,</span><h4>SkillSet Network</h4>",
        }
        transporter.sendMail(mailFormat, (error, data) => {
            if (error) {
                return console.log(error);
            } else {
                console.log("you can enter otp to the rendered page");
            }
        })
    } catch (error) {
        res.status(500).json({ success: false, serverMessage: "Internal Server Error" });
    }
}

exports.verifyLogin = async(req,res) => {
    try {
        const {email, password} = req.body.data
        const validUser = await User.findOne({email : email})
        if(validUser){
            const validPassword = await User.findOne({password : password})
            if(validPassword){
                console.log("welcome");
                res.status(200).json({success: true, message: `Welcome ${validPassword.username}!`})
            }else{
                console.log("!pasword");
                res.json({success:false, message:"Incorrect password!"})
            }
        }else{
            console.log(!email);
            res.json({success:false, emailMessage:"Email did not match our records, Please Register!"})
        }
    } catch (error) {
        res.status(500).json({success: false, serverMessage: "Internal Server Error" });
    }
}
