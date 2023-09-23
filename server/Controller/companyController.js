const otpGenerator = require("otp-generator");
const nodemailer = require("nodemailer");
const stripe = require("stripe")(process.env.STRIPE_KEY);
const Company = require("../Model/companyModel");
const User = require("../Model/userModel");
const Job = require("../Model/jobsModel");
const Position = require("../Model/jobPosition");

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
      const companyData = req.body.data;
      console.log("hhhh", companyData);
      res.status(200).json({ success: true, companyData });
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
    console.log("company side datas before reg", req.query.data);
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
      html: `<h4>Hai dear,</h4><br>
                    <p>Welcome to SkillSet portal! Thank you for registration. Your One Time Password (OTP) is "+ OTP + "</p>
                    <span>Sincerely,</span><h4>SkillSet Network</h4>`,
    };
    transporter.sendMail(mailFormat, (error, data) => {
      if (error) {
        return console.log(error);
      } else {
        console.log("you can enter otp to the rendered page");
        res.json({ success: true });
      }
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, serverMessage: "Internal Server Error" });
  }
};

exports.verifyCompanyLogin = async (req, res) => {
  try {
    const { email, password } = req.body.data;
    const validUser = await Company.findOne({ email: email });
    if (validUser) {
      if (validUser.access == false) {
        const validPassword = await Company.findOne({ password: password });
        if (validPassword) {
          const token = jwtToken.sign(
            { id: validPassword._id },
            process.env.COMPANY_SECRET_KEY,
            {
              expiresIn: "30d",
            }
          );
          const necessaryData = {
            token,
            role: validPassword.role,
            company: validUser.company,
          };
          console.log("welcome");
          res.status(200).json({
            success: true,
            necessaryData,
            message: `Welcome ${validUser.company}!`,
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

exports.premiumPayment = async (req, res) => {
  try {
    const { token, amount, currency } = req.body;
    console.log(req.body.data, "datas in payment");
    const companyData = req.body.data;

    const paymentMethod = await stripe.paymentMethods.create({
      type: "card",
      card: {
        token: token,
      },
    });
    const parseAmount = parseInt(amount);
    const paymentIntent = await stripe.paymentIntents.create({
      amount: parseAmount,
      currency,
      payment_method_types: ["card"],
      payment_method: paymentMethod.id,
      confirm: true,
      return_url: "http://localhost:3000/company/company-login",
    });
    console.log("this is the pi", paymentIntent.id);
    const retrievedPaymentIntent = await stripe.paymentIntents.retrieve(
      paymentIntent.id
    );

    if (paymentIntent.status === "requires_action") {
      console.log(req.body.data, "company data from  body");
      const building = companyData.address.building;
      const city = companyData.address.city;
      const pin = companyData.address.pin;
      const district = companyData.address.district;
      const state = companyData.address.state;
      const phone = parseInt(companyData.phone);

      const address = {
        building: building,
        city: city,
        pin: pin,
        district: district,
        state: state,
        phone: phone,
      };
      const newCompany = new Company({
        company: companyData.company,
        email: companyData.email,
        address: address,
        headline: companyData.headline,
        about: companyData.about,
        email: companyData.email,
        password: companyData.password,
        role: "company",
      });
      console.log("data is entering to the last stage");
      await newCompany.save();
      console.log("data was finishid");
      res
        .status(200)
        .json({
          data: paymentIntent.next_action.redirect_to_url.url,
          success: true,
          message: "Registration success",
        });
    } else if (paymentIntent.status === "succeeded") {
      res.status(200).json({ success: true });
    } else {
      res.status(400).json({ success: false });
    }
  } catch (error) {
    console.log(error);
  }
};

exports.profileView = async (req, res) => {
  try {
    const data = req.query.data;
    const decoded = jwtToken.verify(data, process.env.COMPANY_SECRET_KEY);
    const companyId = decoded.id;
    if (companyId) {
      const companyData = await Company.findOne({ _id: companyId }).populate(
        "jobs"
      );
      const allJobSkills = [];
      companyData.jobs.forEach((job) => {
        allJobSkills.push(...job.skills);
      });
      const uniqueSkills = [...new Set(allJobSkills)];
      const matchedUsers = await User.find({ skills: { $in: uniqueSkills } });
      console.log(matchedUsers, "matchedUsers");
      res.status(200).json({ status: true, companyData, matchedUsers });
    } else {
      res.json({ status: false });
    }
  } catch (error) {
    console.log(error);
  }
};

exports.editProfile = async (req, res) => {
  try {
    console.log("ready to edit");
    const token = req.body.token;
    const data = req.body.data;
    console.log(data, "popo");
    const decode = jwtToken.verify(token, process.env.COMPANY_SECRET_KEY);
    const companyId = decode.id;
    if (companyId) {
      await Company.updateOne({ _id: companyId }, data).then((updateAccess) => {
        console.log(updateAccess);
        res.status(200).json({ status: true, updateAccess });
      });
    } else {
      res.json({ status: false });
    }
  } catch (error) {
    console.log(error);
  }
};

exports.JobPosting = async (req, res) => {
  try {
    const { position, salary, time, requirements, skills, description } =
      req.body.data;
    const token = req.body.company;
    const CompanyId = jwtToken.verify(token, process.env.COMPANY_SECRET_KEY);
    const findJobName = await Position.findOne({_id:position})
    const newJob = new Job({
      position: findJobName.position,
      salary: salary,
      time: time,
      skills: skills,
      requirements: requirements,
      description: description,
      company: CompanyId.id,
    });
    const jobOk = await newJob.save();
    if (jobOk) {
      const objectId = jobOk._id;
      const objectIdString = objectId.toString();
      const find = await Job.findOne({ _id: objectIdString });
      await Company.findOneAndUpdate(
        { _id: CompanyId.id },
        { $push: { jobs: objectIdString } },
        { new: true }
      ).then(() => {
        res
          .status(200)
          .json({ status: true, message: "New job uploaded successfully!" });
      });
    } else {
      res.json({ status: false });
    }
  } catch (error) {
    console.log(error);
  }
};

exports.JobDetails = async (req, res) => {
  try {
    const data = req.query.data;
    const decoded = jwtToken.verify(data, process.env.COMPANY_SECRET_KEY);
    const companyId = decoded.id;
    if (companyId) {
      const companyData = await Company.findOne({ _id: companyId }).populate(
        "jobs"
      );

      const jobPosition = await Position.find()
      console.log(companyData,'job positionssssssssssssssssssss');
      res.status(200).json({ status: true, companyData, jobPosition });
    } else {
      res.json({ status: false });
    }
  } catch (error) {
    console.log(error);
  }
};
