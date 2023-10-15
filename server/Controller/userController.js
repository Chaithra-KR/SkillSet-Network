const otpGenerator = require("otp-generator");
const User = require("../Model/userModel");
const Position = require("../Model/jobPosition");
const AppliedJobs = require("../Model/appliedJobs");
const Job = require("../Model/jobsModel");
const jwtToken = require("jsonwebtoken");
const { sendEmail } = require("../Middleware/nodemailerAuth");
const Posts = require("../Model/posts");
const Conversation = require("../Model/conversation");
const Company = require("../Model/companyModel");
const Messages = require("../Model/messages");
const PremiumRevenue = require("../Model/premiumRevenue");
const stripe = require("stripe")(process.env.STRIPE_KEY);

exports.otp = async (req, res) => {
  try {
    const enteredOtp = parseInt(req.body.otp.join(""));
    const generatedOtp = parseInt(req.app.locals.OTP);
    if (generatedOtp === enteredOtp) {
      const userData = req.body.data;

      const city = userData.location.city;
      const district = userData.location.district;
      const state = userData.location.state;
      const location = {
        city: city,
        district: district,
        state: state,
      };
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
      to: req.query.data,
      subject: "SkillSet Network : One Time Password",
      html:
        "<h4>Hai dear,</h4><br><p>Welcome to SkillSet portal! Thank you for registration. Your One Time Password (OTP) is " +
        OTP +
        "</p><span>Sincerely,</span><h4>SkillSet Network</h4>",
    };

    sendEmail(mailFormat.to, mailFormat.subject, mailFormat.html);

    console.log("you can enter otp on the rendered page");
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error generating OTP:", error);
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
      const seekerData = await User.findOne({ _id: seekerId }).populate(
        "posts"
      );

      const appliedJobs = await AppliedJobs.find({ user: seekerId })
        .populate("job")
        .populate("company");
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
      const companies = await Company.find();
      res.status(200).json({
        status: true,
        seekerData,
        matchedJobs,
        appliedJobs,
        companies,
      });
    } else {
      res.json({ status: false, message: "Invalid seekerId" });
    }
  } catch (error) {
    console.log(error);
  }
};

exports.editProfile = async (req, res) => {
  try {
    const token = req.body.token;
    const data = req.body.data;
    const decode = jwtToken.verify(token, process.env.SECRET_KEY);
    const seekerId = decode.id;
    if (seekerId) {
      await User.updateOne({ _id: seekerId }, data).then((updateAccess) => {
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

exports.jobView = async (req, res) => {
  try {
    const data = req.query.data;
    const decoded = jwtToken.verify(data, process.env.SECRET_KEY);
    const seekerId = decoded.id;
    const appliedJobs = await AppliedJobs.find({ user: seekerId })
      .populate("job")
      .populate("company");
    const searchQuery = req.query.q;

    const page = parseInt(req.query.page) || 1;
    const perPage = 4;

    const skip = (page - 1) * perPage;

    const jobPosition = await Position.find();
    console.log(jobPosition, "jobPosition");

    const query = {
      $or: [
        { position: { $regex: new RegExp(searchQuery, "i") } },
        { "company.company": { $regex: new RegExp(searchQuery, "i") } },
      ],
    };

    const jobs = await Job.find(query)
      .populate("company")
      .skip(skip)
      .limit(perPage);

    let matchedJobs = [];
    if (seekerId) {
      const seekerData = await User.findOne({ _id: seekerId });
      if (seekerData && Array.isArray(seekerData.skills)) {
        const uniqueSkills = [...new Set(seekerData.skills)];
        matchedJobs = await Job.find({
          skills: { $in: uniqueSkills },
        }).populate("company");
      }
    }

    const totalCount = await Job.countDocuments(query);
    const paginationCount = Math.ceil(totalCount / perPage);
    res.status(200).json({
      status: true,
      jobs,
      matchedJobs,
      jobPosition,
      page,
      perPage,
      totalCount,
      paginationCount,
      appliedJobs,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: false, message: "Internal Server Error" });
  }
};

exports.saveJob = async (req, res) => {
  try {
    const token = req.body.token;
    const data = req.body.data;
    const newJobToSaveList = data._id;
    const decode = jwtToken.verify(token, process.env.SECRET_KEY);
    // const decode = req.id
    const seekerId = decode.id;
    if (seekerId) {
      await User.findOneAndUpdate(
        { _id: seekerId },
        { $push: { savedJobs: newJobToSaveList } }
      ).then((updateAccess) => {
        console.log(updateAccess);
        res.status(200).json({ status: true, message: "Job saved" });
      });
    } else {
      res.json({ status: false });
    }
  } catch (error) {
    console.log(error);
  }
};

exports.savedJobs = async (req, res) => {
  try {
    const data = req.query.data;
    const decoded = jwtToken.verify(data, process.env.SECRET_KEY);
    // const decoded = req.id
    const seekerId = decoded.id;
    const userData = await User.findById(seekerId);
    if (userData) {
      const savedJobIds = userData.savedJobs;
      const savedJobs = await Job.find({ _id: { $in: savedJobIds } }).populate(
        "company"
      );
      console.log(savedJobs, "savedJobs");
      res.status(200).json({ status: true, jobData: savedJobs });
    } else {
      res.status(404).json({ status: false, message: "User not found" });
    }
  } catch (error) {
    console.log(error);
  }
};

exports.applyJob = async (req, res) => {
  try {
    const { requestData } = req.body;
    const { token, data } = requestData;
    const { cv, skills, name, email, experience, coverLetter, phone, jobId } =
      data;
    const decoded = jwtToken.verify(token, process.env.SECRET_KEY);
    // const decoded = req.id
    const seekerId = decoded.id;
    const jobs = await Job.findOne({ _id: jobId }).populate("company");
    const companyId = jobs.company._id;
    console.log(seekerId, "seekerId");
    const newAppliedJob = new AppliedJobs({
      cv: cv,
      email: email,
      name: name,
      experience: experience,
      skills: skills,
      coverLetter: coverLetter,
      user: seekerId,
      phone: phone,
      job: jobId,
      company: companyId,
    });
    const appliedJobOk = await newAppliedJob.save();
    if (appliedJobOk) {
      const objectId = jobId;
      const find = await Job.findOne({ _id: objectId }).populate("company");
      console.log(find, "find");

      await User.findOneAndUpdate(
        { _id: seekerId },
        { $push: { appliedJobs: objectId } }
      );
      await Job.findOneAndUpdate(
        { _id: objectId },
        { $push: { applicants: seekerId } }
      ).then(() => {
        res.status(200).json({ status: true, message: "Job Applied!" });
      });
    } else {
      res.json({ status: false });
    }
  } catch (error) {
    console.log(error);
  }
};

exports.newPost = async (req, res) => {
  try {
    const { data, token } = req.body;
    const { caption, picture } = data;
    const decoded = jwtToken.verify(token, process.env.SECRET_KEY);
    // const decoded = req.id
    const seekerId = decoded.id;
    console.log(seekerId, "seekerId");
    if (seekerId) {
      const newPost = new Posts({
        caption: caption,
        picture: picture,
        user: seekerId,
      });
      await newPost.save();
      await User.findOneAndUpdate(
        { _id: seekerId },
        { $push: { posts: newPost } }
      );
      res.status(200).json({ status: true, message: "New post uploaded!" });
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
    const decoded = jwtToken.verify(token, process.env.SECRET_KEY);
    // const decoded = req.id
    const seekerId = decoded.id;
    console.log(seekerId);
    const user = await User.findById(seekerId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    const userWithCurrentPassword = await User.findOne({
      _id: seekerId,
      password: currentPassword,
    });

    if (!userWithCurrentPassword) {
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
    user.password = password;
    await user.save();
    return res
      .status(200)
      .json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    console.error("Error changing password:", error);
  }
};

exports.singlePost = async (req, res) => {
  try {
    const { imageId } = req.query;
    if (imageId) {
      const seekerData = await Posts.findOne({ _id: imageId });
      res.status(200).json({ status: true, seekerData });
    } else {
      res.json({ status: false });
    }
  } catch (error) {
    console.log(error);
  }
};

exports.getChat = async (req, res) => {
  try {
    const userId = req.query.data;
    const decoded = jwtToken.verify(userId, process.env.SECRET_KEY);
    const seekerId = decoded.id;
    const conversations = await Conversation.find({
      members: { $in: [seekerId] },
    });

    const receiverData = await Promise.all(
      conversations.map(async (conversation) => {
        const receiverId = conversation.members.find(
          (member) => member !== seekerId
        );
        const company = await Company.findById(receiverId);
        return {
          company: {
            email: company.email,
            company: company.company,
            image: company.image,
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
    const decoded = jwtToken.verify(senderId, process.env.SECRET_KEY);
    const seekerId = decoded.id;
    if (!seekerId || !message) return res.json("fill required fields");
    if (conversationId == "new" && receiverId) {
      const newChat = new Conversation({ members: [seekerId, receiverId] });
      await newChat.save();
      const newMessage = new Messages({
        conversationId: newChat._id,
        senderId: seekerId,
        message,
      });
      await newMessage.save();
      res.status(200).json({
        conversationId,
        newMessage,
        message: "Message sent successfully",
      });
    } else {
      const newMessage = new Messages({
        conversationId,
        senderId: seekerId,
        message,
      });
      await newMessage.save();
      res.status(200).json({
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
    const messageSeekerData = await Promise.all(
      messages.map(async (message) => {
        const seeker = await User.findById(message.senderId);
        if (seeker && seeker.email) {
          return {
            seeker: {
              email: seeker.email,
              username: seeker.username,
              image: seeker.image,
            },
            message: message.message,
          };
        } else {
          return {
            seeker: { email: "N/A", username: "N/A", image: "N/A" },
            message: message.message,
          };
        }
      })
    );
    console.log(messageSeekerData, "messageCompanyData");
    res.status(200).json({ success: true, messageSeekerData });
  } catch (error) {
    console.log(error);
    // res.status(500).json({ success: false, error: "Internal Server Error" });
    console.log(error);
  }
};

exports.companies = async (req, res) => {
  try {
    const data = req.query.data;
    const decoded = jwtToken.verify(data, process.env.SECRET_KEY);
    const seekerId = decoded.id;
    if (seekerId) {
      const seekerData = await User.findOne(
        { _id: seekerId },
        { _id: 1, username: 1, image: 1 }
      );
      const companies = await Company.find(
        {},
        { _id: 1, company: 1, email: 1, image: 1 }
      );
      res
        .status(200)
        .json({ status: true, companies: companies, seeker: seekerData });
    } else {
      res.json({ status: false });
    }
  } catch (error) {
    console.log(error);
  }
};

exports.requestAsEmploy = async (req, res) => {
  try {
    const { token, companyId } = req.body.data;
    const decoded = jwtToken.verify(token, process.env.SECRET_KEY);
    const seekerId = decoded.id;
    const request = {
      userId: seekerId,
      status: "pending",
      companyId: companyId,
    };

    await User.findByIdAndUpdate(seekerId, {
      $push: { userRequests: request },
    });
    await Company.findByIdAndUpdate(companyId, {
      $push: { userRequests: request },
    });

    res.status(200).json({
      success: true,
      status: "pending",
      message: "Request sent successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

exports.upgradePayment = async (req, res) => {
  try {
    const { token, userToken, amount, currency } = req.body;
    const decoded = jwtToken.verify(userToken, process.env.SECRET_KEY);
    const seekerId = decoded.id;
    if (seekerId) {
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
        return_url: "http://localhost:3000/posts",
      });
      const retrievedPaymentIntent = await stripe.paymentIntents.retrieve(
        paymentIntent.id
      );
      if (paymentIntent.status === "requires_action") {
        await User.findOneAndUpdate({ _id: seekerId }, { premiumStatus: true });
        const premiumRevenue = new PremiumRevenue({
          user: seekerId,
          amount: 1000,
          premiumStatus: true,
        });
        await premiumRevenue.save();
        res.status(200).json({
          data: paymentIntent.next_action.redirect_to_url.url,
          success: true,
          message: "Premium upgraded!",
        });
      } else if (paymentIntent.status === "succeeded") {
        res.status(200).json({ success: true });
      } else {
        res.status(400).json({ success: false });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

// exports.upgradePayment = async (req, res) => {
//   try {
//     const { token, amount, currency } = req.body;
//     console.log("token", token);
//     const decoded = jwtToken.verify(token, process.env.SECRET_KEY);
//     const seekerId = decoded.id;

//     if (!seekerId) {
//       throw new Error("Invalid or expired token");
//     }

//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ["card"],
//       line_items: [
//         {
//           price_data: {
//             currency: "inr",
//             unit_amount: parseInt(amount) * 100,
//           },
//         },
//       ],
//       mode: "payment",
//       success_url: "http://localhost:3000/posts",
//       cancel_url: "http://localhost:3000/login",
//     });
//     console.log(session.id);
//     await User.findOneAndUpdate({ _id: seekerId }, { premiumStatus: true });
//     const premiumRevenue = new PremiumRevenue({
//       user: seekerId,
//       amount: 1000,
//       premiumStatus: true,
//     });
//     await premiumRevenue.save();
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, error: "Internal server error" });
//   }
// };
