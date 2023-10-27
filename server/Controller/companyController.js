const otpGenerator = require("otp-generator");
const stripe = require("stripe")(process.env.STRIPE_KEY);
const Company = require("../Model/companyModel");
const User = require("../Model/userModel");
const Job = require("../Model/jobsModel");
const Position = require("../Model/jobPosition");
const AppliedJobs = require("../Model/appliedJobs");
const Posts = require("../Model/posts");
const PremiumRevenue = require("../Model/premiumRevenue");
const Messages = require("../Model/messages");
const Conversation = require("../Model/conversation");
const bcrypt = require("bcrypt");
const { sendEmail } = require("../Middleware/nodemailerAuth");
const jwtToken = require("jsonwebtoken");

exports.otp = async (req, res) => {
  try {
    const enteredOtp = parseInt(req.body.otp.join(""));
    const generatedOtp = parseInt(req.app.locals.OTP);
    if (generatedOtp === enteredOtp) {
      const companyData = req.body.data;
      res.status(200).json({ success: true, companyData });
    } else {
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
      to: req.query.data,
      subject: "SkillSet Network : One Time Password",
      html: `<h4>Hai dear,</h4><br>
                    <p>Welcome to SkillSet portal! Thank you for registration. Your One Time Password (OTP) is "+ OTP + "</p>
                    <span>Sincerely,</span><h4>SkillSet Network</h4>`,
    };
    sendEmail(mailFormat.to, mailFormat.subject, mailFormat.html);

    console.log("you can enter otp on the rendered page");
    res.status(200).json({ success: true });
  } catch (error) {
    res.json({ success: false, serverMessage: "Internal Server Error" });
  }
};

exports.verifyCompanyLogin = async (req, res) => {
  try {
    const { email, password } = req.body.data;
    const validUser = await Company.findOne({ email: email });

    if (validUser) {
      if (validUser.access == false) {
        const passwordMatch = await bcrypt.compare(
          password,
          validUser.password
        );

        if (passwordMatch) {
          const token = jwtToken.sign(
            { id: validUser._id },
            process.env.COMPANY_SECRET_KEY,
            {
              expiresIn: "30d",
            }
          );

          const necessaryData = {
            token,
            role: validUser.role, // Use validUser.role, not validPassword.role
            company: validUser.company,
          };

          res.status(200).json({
            success: true,
            necessaryData,
            message: `Welcome ${validUser.company}!`,
          });
        } else {
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

// exports.verifyCompanyLogin = async (req, res) => {
//   try {
//     const { email, password } = req.body.data;
//     const validUser = await Company.findOne({ email: email });
//     if (validUser) {
//       if (validUser.access == false) {
//         const validPassword = await Company.findOne({ password: password });
//         if (validPassword) {
//           const token = jwtToken.sign(
//             { id: validPassword._id },
//             process.env.COMPANY_SECRET_KEY,
//             {
//               expiresIn: "30d",
//             }
//           );
//           const necessaryData = {
//             token,
//             role: validPassword.role,
//             company: validUser.company,
//           };
//           res.status(200).json({
//             success: true,
//             necessaryData,
//             message: `Welcome ${validUser.company}!`,
//           });
//         } else {
//           res.json({ success: false, message: "Incorrect password!" });
//         }
//       } else {
//         res.json({
//           success: false,
//           accessBlocked:
//             "This website has prevented you from browsing this URL!",
//         });
//       }
//     } else {
//       res.json({
//         success: false,
//         emailMessage: "Email did not match our records, Please Register!",
//       });
//     }
//   } catch (error) {
//     res
//       .status(500)
//       .json({ success: false, serverMessage: "Internal Server Error" });
//   }
// };

exports.premiumPayment = async (req, res) => {
  try {
    const { token, amount, currency } = req.body;
    const companyData = req.body.data;

    const paymentMethod = await stripe.paymentMethods.create({
      type: "card",
      card: {
        token: token,
      },
    });
    const parseAmount = parseInt(amount) * 100;
    const paymentIntent = await stripe.paymentIntents.create({
      amount: parseAmount,
      currency,
      payment_method_types: ["card"],
      payment_method: paymentMethod.id,
      confirm: true,
      return_url:process.env.PAYMENT_SUCCESS_URL,

    });
    const retrievedPaymentIntent = await stripe.paymentIntents.retrieve(
      paymentIntent.id
    );
    if (paymentIntent.status === "requires_action") {
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

      const hashedPassword = await bcrypt.hash(companyData.password, 10);

      const newCompany = new Company({
        company: companyData.company,
        email: companyData.email,
        address: address,
        headline: companyData.headline,
        about: companyData.about,
        email: companyData.email,
        password: hashedPassword,
        role: "company",
        premium: 5000,
        premiumStatus: true,
      });
      await newCompany.save();
      const premiumRevenue = new PremiumRevenue({
        company: newCompany._id,
        amount: 5000,
        premiumStatus: true,
      });
      await premiumRevenue.save();
      res.status(200).json({
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
    // const decoded = req.id
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
      const user = await AppliedJobs.find().populate("user").populate("job");
      const applicantData = user.filter((value) => {
        return value.company === companyId;
      });

      const Employees = await User.aggregate([
        {
          $unwind: "$userRequests",
        },
        {
          $match: {
            "userRequests.status": "accepted",
          },
        },
      ]);

      console.log(Employees, "Employees");

      res
        .status(200)
        .json({ status: true, companyData, applicantData, matchedUsers, Employees });
    } else {
      res.json({ status: false });
    }
  } catch (error) {
    console.log(error);
  }
};

exports.editProfile = async (req, res) => {
  try {
    const token = req.body.token;
    const data = req.body.data;
    const decode = jwtToken.verify(token, process.env.COMPANY_SECRET_KEY);
    // const decode = req.id

    const companyId = decode.id;
    if (companyId) {
      await Company.updateOne({ _id: companyId }, data).then((updateAccess) => {
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
    // const CompanyId = req.id
    const findJobName = await Position.findOne({ _id: position });
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
    // const decoded = req.id

    const companyId = decoded.id;
    if (companyId) {
      const companyData = await Company.findOne({ _id: companyId }).populate(
        "jobs"
      );

      const jobPosition = await Position.find();
      res.status(200).json({ status: true, companyData, jobPosition });
    } else {
      res.json({ status: false });
    }
  } catch (error) {
    console.log(error);
  }
};

exports.notifications = async (req, res) => {
  try {
    const data = req.query.data;
    const decoded = jwtToken.verify(data, process.env.COMPANY_SECRET_KEY);
    // const decoded = req.id
    const companyId = decoded.id;
    if (companyId) {
      const companyData = await Company.findOne({ _id: companyId })
        .populate("jobs")
        .populate("userRequests.userId");

      const user = await AppliedJobs.find()
        .populate("user")
        .populate("job")
        .sort({ appliedDate: -1 });

      const applicantData = user.filter((value) => {
        return value.company === companyId;
      });
      const allJobSkills = [];
      companyData.jobs.forEach((job) => {
        allJobSkills.push(...job.skills);
      });
      const uniqueSkills = [...new Set(allJobSkills)];
      const matchedUsers = await User.find({ skills: { $in: uniqueSkills } });
      console.log(companyData, "companyData");
      res
        .status(200)
        .json({ status: true, companyData, applicantData, matchedUsers });
    } else {
      res.json({ status: false });
    }
  } catch (error) {
    console.log(error);
  }
};

exports.userProfileView = async (req, res) => {
  try {
    const { userId } = req.query;
    if (userId) {
      const seekerData = await User.findOne({ _id: userId }).populate("posts");
      if (!seekerData) {
        return res
          .status(404)
          .json({ status: false, message: "User not found" });
      }

      if (!Array.isArray(seekerData.skills)) {
        return res.status(400).json({
          status: false,
          message: "User skills not found or not an array.",
        });
      }

      const uniqueSkills = [...new Set(seekerData.skills)];

      const matchedJobs = await Job.find({ skills: { $in: uniqueSkills } });

      res.status(200).json({ status: true, seekerData, matchedJobs });
    } else {
      res.json({ status: false });
    }
  } catch (error) {
    console.log(error);
  }
};

exports.singlePost = async (req, res) => {
  try {
    const { imageId } = req.query;
    if (imageId) {
      const seekerData = await Posts.findOne({ _id: imageId }).populate("user");
      res.status(200).json({ status: true, seekerData });
    } else {
      res.json({ status: false });
    }
  } catch (error) {
    console.log(error);
  }
};

exports.postComment = async (req, res) => {
  try {
    const { imageId, company } = req.body;
    const comment = req.body.data;
    const decode = jwtToken.verify(company, process.env.COMPANY_SECRET_KEY);
    // const decode = req.id
    const companyId = decode.id;
    if (companyId) {
      const post = await Posts.findById(imageId);
      const companyName = await Company.findOne({ _id: companyId });
      const newComment = {
        comment: comment.comment,
        company: {
          name: companyName.company,
          image: companyName.image,
        },
      };

      post.commentSection.push(newComment);
      await post.save();
      res
        .status(200)
        .json({ success: true, message: "Commented on the post!" });
    } else {
      res.json({ status: false });
    }
  } catch (error) {
    console.log(error);
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { password, confirmPassword, currentPassword } = req.body.data;

    const token = req.body.token;
    const decoded = jwtToken.verify(token, process.env.COMPANY_SECRET_KEY);
    const companyId = decoded.id;

    const company = await Company.findById(companyId);

    if (!company) {
      return res
        .status(404)
        .json({ success: false, message: "Company not found" });
    }

    // Compare the provided currentPassword with the stored bcrypt-hashed password
    const passwordMatch = await bcrypt.compare(
      currentPassword,
      company.password
    );

    if (!passwordMatch) {
      return res.json({
        success: false,
        message: "Incorrect current password",
      });
    }

    if (password !== confirmPassword) {
      return res.json({
        success: false,
        message: "Passwords do not match on confirm",
      });
    }

    // Hash the new password and update the company's password
    const hashedPassword = await bcrypt.hash(password, 10);
    company.password = hashedPassword;

    await company.save();

    return res
      .status(200)
      .json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    console.error("Error changing password:", error);
  }
};

// exports.changePassword = async (req, res) => {
//   try {
//     const { password, confirmPassword, currentPassword } = req.body.data;

//     const token = req.body.token;
//     const decoded = jwtToken.verify(token, process.env.COMPANY_SECRET_KEY);
//     // const decoded = req.id
//     const companyId = decoded.id;
//     console.log(companyId);
//     const company = await Company.findById(companyId);

//     if (!company) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Company not found" });
//     }
//     const companyWithCurrentPassword = await Company.findOne({
//       _id: companyId,
//       password: currentPassword,
//     });

//     if (!companyWithCurrentPassword) {
//       console.log(companyWithCurrentPassword);
//       return res.json({
//         success: false,
//         message: "Incorrect current password",
//       });
//     }
//     if (password !== confirmPassword) {
//       return res.json({
//         success: false,
//         message: "Passwords do not match on confirm",
//       });
//     }
//     company.password = password;
//     await company.save();
//     return res
//       .status(200)
//       .json({ success: true, message: "Password updated successfully" });
//   } catch (error) {
//     console.error("Error changing password:", error);
//   }
// };

exports.getChat = async (req, res) => {
  try {
    const token = req.query.data;
    const decoded = jwtToken.verify(token, process.env.COMPANY_SECRET_KEY);
    const companyId = decoded.id;
    const conversations = await Conversation.find({
      members: { $in: [companyId] },
    });
    const receiverData = await Promise.all(
      conversations.map(async (conversation) => {
        const receiverId = conversation.members.find(
          (member) => member !== companyId
        );
        const seeker = await User.findById(receiverId);
        return {
          seeker: {
            email: seeker.email,
            username: seeker.username,
            image: seeker.image,
          },
          conversationId: conversation._id,
        };
      })
    );
    res.status(200).json({ success: true, receiverData });
  } catch (error) {
    console.log(error);
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { conversationId, senderId, message, receiverId } = req.body;
    const decoded = jwtToken.verify(senderId, process.env.COMPANY_SECRET_KEY);
    const companyId = decoded.id;
    if (!companyId || !message) return res.json("fill required fields");
    if (conversationId == "new" && receiverId) {
      const newChat = new Conversation({ members: [companyId, receiverId._id] });
      await newChat.save();
      const newMessage = new Messages({
        conversationId: newChat._id,
        senderId: companyId,
        message,
      });
      await newMessage.save();
      res.status(200).json({
        success:true,
        conversationId,
        newMessage,
        message: "Message sent successfully",
      });
    } else {
      const newMessage = new Messages({
        conversationId,
        senderId: companyId,
        message,
      });
      await newMessage.save();
      res.status(200).json({
        success:true,
        conversationId,
        newMessage,
        message: "Message sent successfully",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

exports.getMessage = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { senderId, receiverId } = req.query;
    if (conversationId === "new") return res.status(200).json([]);
    const messages = await Messages.find({ conversationId });
    const messageCompanyData = await Promise.all(
      messages.map(async (message) => {
        const company = await Company.findById(message.senderId);
        if (company && company.email) {
          return {
            company: {
              email: company.email,
              company: company.company,
              image: company.image,
            },
            message: message.message,
          };
        } else {
          return {
            company: { email: "N/A", company: "N/A", image: "N/A" },
            message: message.message,
          };
        }
      })
    );
    console.log(messageCompanyData, "messageCompanyData");
    res.status(200).json({ success: true, messageCompanyData });
  } catch (error) {
    console.log(error);
    // res.status(500).json({ success: false, error: "Internal Server Error" });
    console.log(error);
  }
};

exports.seekers = async (req, res) => {
  try {
    const token = req.query.data;
    const decoded = jwtToken.verify(token, process.env.COMPANY_SECRET_KEY);
    const companyId = decoded.id;
    if (companyId) {
      const companyData = await Company.findOne(
        { _id: companyId },
        { _id: 1, company: 1, image: 1 }
      );
      const seekers = await User.find(
        {},
        { _id: 1, username: 1, email: 1, image: 1 }
      );
      res
        .status(200)
        .json({ status: true, seekers: seekers, company: companyData });
    } else {
      res.json({ status: false });
    }
  } catch (error) {
    console.log(error);
  }
};

exports.acceptEmployee = async (req, res) => {
  try {
    const userId = req.body.data;
    const { company } = req.body;
    console.log(company);
    const decoded = jwtToken.verify(company, process.env.COMPANY_SECRET_KEY);
    const companyId = decoded.id;
    if (companyId) {
      const updatedCompany = await Company.findOneAndUpdate(
        {
          _id: companyId,
          "userRequests.userId": userId,
          "userRequests.status": "pending",
        },
        {
          $set: { "userRequests.$.status": "accepted" },
        }
      );

      const updatedUser = await User.findOneAndUpdate(
        {
          _id: userId,
          "userRequests.companyId": companyId,
          "userRequests.status": "pending",
        },
        {
          $set: { "userRequests.$.status": "accepted" },
        }
      );

      if (updatedCompany && updatedUser) {
        res.status(200).json({
          success: true,
          status: "accepted",
          message: "Request accepted",
        });
      } else {
        res.status(200).json({ status: false });
      }
    } else {
      res.json({ status: false });
    }
  } catch (error) {
    console.log(error);
  }
};

exports.rejectEmployee = async (req, res) => {
  try {
    const userId = req.body.data;
    const { company } = req.body;
    console.log(company);
    const decoded = jwtToken.verify(company, process.env.COMPANY_SECRET_KEY);
    const companyId = decoded.id;
    if (companyId) {
      const updatedCompany = await Company.findOneAndUpdate(
        {
          _id: companyId,
          "userRequests.userId": userId,
          "userRequests.status": "pending",
        },
        {
          $set: { "userRequests.$.status": "rejected" },
        }
      );

      const updatedUser = await User.findOneAndUpdate(
        {
          _id: userId,
          "userRequests.companyId": companyId,
          "userRequests.status": "pending",
        },
        {
          $set: { "userRequests.$.status": "rejected" },
        }
      );

      if (updatedCompany && updatedUser) {
        res.status(200).json({
          success: true,
          status: "rejected",
          message: "Request rejected",
        });
      } else {
        res.status(200).json({ status: false });
      }
    } else {
      res.json({ status: false });
    }
  } catch (error) {
    console.log(error);
  }
};
