const otpGenerator = require('otp-generator')
const nodemailer = require('nodemailer')
const User = require('../Model/userModel')


const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,

    auth: {
        user: "narphocart@gmail.com",
        pass: "eyarkhwribmlsoml",
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
            res.json({success: true , message: "Registration success"})
        }else{
            console.log("invalid otp");
            res.json({success:false, message:"Invalid OTP!"})
        }
    } catch (error) {
        console.log(error);
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
        console.log(error);
    }
}

