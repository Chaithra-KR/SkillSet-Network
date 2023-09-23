const otpGenerator = require("otp-generator");
const nodemailer = require("nodemailer");
const User = require("../Model/userModel");
const Position = require("../Model/jobPosition");
const Job = require("../Model/jobsModel");
const jwtToken = require("jsonwebtoken");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,

  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },
});

exports.otp = async (req, res) => {
  try {
    const enteredOtp = parseInt(req.body.otp.join(""));
    const generatedOtp = parseInt(req.app.locals.OTP);
    if (generatedOtp === enteredOtp) {
      console.log("otp verified");
      const userData = req.body.data;
      
      const city = userData.location.city;
      const district = userData.location.district;
      const state = userData.location.state;
      const location = {
        city: city,
        district: district,
        state: state,
      };
      console.log(location, "itsloca");
      const newUser = new User({
        username: userData.username,
        dob: userData.dob,
        headline: userData.headline,
        about: userData.about,
        email: userData.email,
        password: userData.password,
        location: location,
        phone: userData.phone,
        role: "seeker",
      });
      await newUser.save();

      res.status(200).json({ success: true, message: "Registration success" });
    } else {
      console.log("invalid otp");
      res.json({ success: false, message: "Invalid OTP!" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ success: false, serverMessage: "Internal Server Error" });
  }
};

exports.generateOtp = async (req, res) => {
  try {
    const OTP = otpGenerator.generate(6, {
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });
    console.log(OTP, "otp");
    req.app.locals.OTP = OTP;
    const mailFormat = {
      from: "narphocart@gmail.com",
      to: req.query.data,
      subject: "SkillSet Network : One Time Password",
      html:
        "<h4>Hai dear,</h4><br><p>Welcome to SkillSet portal! Thank you for registration. Your One Time Password (OTP) is " +
        OTP +
        "</p><span>Sincerely,</span><h4>SkillSet Network</h4>",
    };
    transporter.sendMail(mailFormat, (error, data) => {
      if (error) {
        return console.log(error);
      } else {
        console.log("you can enter otp to the rendered page");
        res.status(200).json({ success: true });
      }
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, serverMessage: "Internal Server Error" });
  }
};

exports.verifyLogin = async (req, res) => {
  try {
    console.log("ready to login");
    const { email, password } = req.body.data;
    const validUser = await User.findOne({ email: email });

    if (validUser) {
      if (validUser.access == false) {
        const validPassword = await User.findOne({ password: password });
        if (validPassword) {
          const token = jwtToken.sign(
            { id: validPassword._id },
            process.env.SECRET_KEY,
            {
              expiresIn: "30d",
            }
          );
          const necessaryData = {
            token,
            role: validPassword.role,
            username: validUser.username,
          };
          console.log(token, "its token");
          console.log("welcome");
          res.status(200).json({
            success: true,
            necessaryData,
            message: `Welcome ${validUser.username}!`,
          });
        } else {
          console.log("!password");
          res.json({ success: false, message: "Incorrect password!" });
        }
      } else {
        res.json({
          success: false,
          accessBlocked:
            "This website has prevented you from browsing this URL!",
        });
      }
    } else {
      console.log(!email);
      res.json({
        success: false,
        emailMessage: "Email did not match our records, Please Register!",
      });
    }
  } catch (error) {
    res
      .status(500)
      .json({ success: false, serverMessage: "Internal Server Error" });
  }
};

exports.profileView = async (req, res) => {
  try {
    const data = req.query.data;
    const decoded = jwtToken.verify(data, process.env.SECRET_KEY);
    const seekerId = decoded.id;
    console.log(seekerId);

    if (seekerId) {
      const seekerData = await User.findOne({ _id: seekerId }).populate('jobs');
      console.log('Seeker Data:', seekerData);

      if (!seekerData) {
        return res.status(404).json({ status: false, message: 'User not found' });
      }

      if (!Array.isArray(seekerData.skills)) {
        return res.status(400).json({ status: false, message: 'User skills not found or not an array.' });
      }

      const uniqueSkills = [...new Set(seekerData.skills)];
      console.log('Unique Skills:', uniqueSkills);

      const matchedJobs = await Job.find({ skills: { $in: uniqueSkills } }); 
      console.log('Matched Jobs:', matchedJobs);

      res.status(200).json({ status: true, seekerData, matchedJobs });
    } else {
      res.json({ status: false, message: 'Invalid seekerId' });
    }
  } catch (error) {
    console.log(error);
  }
};

exports.editProfile = async (req,res) =>{
    try {
        const token = req.body.token
        const data = req.body.data
        const decode = jwtToken.verify(token,process.env.SECRET_KEY)
        const seekerId = decode.id
        if(seekerId){
        await User.updateOne({_id:seekerId},data).then((updateAccess)=>{
                console.log(updateAccess);
                res.status(200).json({ status: true, updateAccess });
            })
            
        }else{
            res.json({ status: false });
        }
    } catch (error) {
        console.log(error);
    }
}

exports.jobView = async (req, res) => {
  try {
    const data = req.query.data;
    const decoded = jwtToken.verify(data, process.env.SECRET_KEY);
    const seekerId = decoded.id;
    console.log(seekerId);
    const searchQuery = req.query.q;

    const jobPosition = await Position.find()
    // Perform a regular job search based on the searchQuery
    const jobs = await Job.find({
      $or: [
        { 'position': { $regex: new RegExp(searchQuery, 'i') } },
        { 'company.company': { $regex: new RegExp(searchQuery, 'i') } },
      ],
    }).populate('company'); 

    // Include matchedJobs if seekerId is provided
    let matchedJobs = [];
    if (seekerId) {
      const seekerData = await User.findOne({ _id: seekerId }).populate('jobs');

      if (seekerData && Array.isArray(seekerData.skills)) {
        const uniqueSkills = [...new Set(seekerData.skills)];
        matchedJobs = await Job.find({ skills: { $in: uniqueSkills } }).populate('company');
      }
    }
    res.status(200).json({ status: true, jobs, matchedJobs , jobPosition});
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: false, message: 'Internal Server Error' });
  }
};

