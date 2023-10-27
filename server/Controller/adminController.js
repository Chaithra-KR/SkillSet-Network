const Admin = require("../Model/adminModel");
const Company = require("../Model/companyModel");
const User = require("../Model/userModel");
const Position = require("../Model/jobPosition");
const Posts = require("../Model/posts");
const PremiumRevenue = require("../Model/premiumRevenue");
const jwtToken = require("jsonwebtoken");

exports.adminVerifyLogin = async (req, res) => {
  try {
    const { email, password } = req.body.data;
    const isAdmin = await Admin.findOne({ email: email });
    if (isAdmin) {
      const validPassword = await Admin.findOne({ password: password });
      if (validPassword) {
        const token = jwtToken.sign(
          { id: validPassword._id },
          process.env.ADMIN_SECRET_KEY,
          {
            expiresIn: "50d",
          }
        );
        const necessaryData = {
          token,
          role: validPassword.role,
          admin: isAdmin.admin,
        };
        console.log("welcome");
        res.status(200).json({
          success: true,
          necessaryData,
          message: `Welcome Admin!`,
        });
      } else {
        console.log("!password");
        res.json({ success: false, message: "Incorrect password!" });
      }
    } else {
      console.log(!email);
      res.json({
        success: false,
        message: "Incorrect email!",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

exports.userManagement = async (req, res) => {
  try {
    let userData = await User.find();
    console.log(userData);
    res.status(200).json({ success: true, userData });
  } catch (error) {
    console.log(error);
  }
};

exports.companyManagement = async (req, res) => {
  try {
    console.log("re");
    let companyData = await Company.find();
    console.log(companyData);
    res.status(200).json({ success: true, companyData });
  } catch (error) {
    console.log(error);
  }
};

exports.blockUser = async (req, res) => {
  try {
    const userId = req.body.data;
    const user = await User.findByIdAndUpdate(
      { _id: userId },
      { access: true }
    );
    const name = user.username;
    res.status(200).json({ success: true, message: `${name} is blocked!` });
  } catch (error) {
    console.log(error);
  }
};

exports.unblockUser = async (req, res) => {
  try {
    const userId = req.body.data;
    const user = await User.findByIdAndUpdate(
      { _id: userId },
      { access: false }
    );
    const name = user.username;
    res.status(200).json({ success: true, message: `${name} is unblocked!` });
  } catch (error) {
    console.log(error);
  }
};

exports.blockCompany = async (req, res) => {
  try {
    const companyId = req.body.data;
    const company = await Company.findByIdAndUpdate(
      { _id: companyId },
      { access: true }
    );
    const name = company.company;
    res.status(200).json({ success: true, message: `${name} is blocked!` });
  } catch (error) {
    console.log(error);
  }
};

exports.unblockCompany = async (req, res) => {
  try {
    const companyId = req.body.data;
    const company = await Company.findByIdAndUpdate(
      { _id: companyId },
      { access: false }
    );
    const name = company.company;
    res.status(200).json({ success: true, message: `${name} is unblocked!` });
  } catch (error) {
    console.log(error);
  }
};

exports.viewDashboard = async (req, res) => {
  try {
    const usersCount = await User.find().countDocuments();
    const companiesCount = await Company.find().countDocuments();
    const revenue = await PremiumRevenue.aggregate([
      {
        $match: {
          premiumStatus: true,
        },
      },
      {
        $group: {
          _id: null,
          subtotal: { $sum: "$amount" },
        },
      },
    ]);
    const premiumAccountsCount = await PremiumRevenue.find().countDocuments();
    res.status(200).json({
      success: true,
      companiesCount,
      usersCount,
      revenue: revenue[0].subtotal,
      premiumAccountsCount,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.jobPosition = async (req, res) => {
  try {
    const { job } = req.body.data;
    const token = req.body.token;
    const adminId = jwtToken.verify(data, process.env.ADMIN_SECRET_KEY);
    // const adminId = req.id
    console.log(job, "job");
    const checkJob = await Position.findOne({ position: job });
    if (!checkJob) {
      const newJob = new Position({
        position: job,
        admin: adminId.id,
      });
      const JobTitle = await newJob.save();
      console.log("success", JobTitle);
      res.status(200).json({
        success: true,
        JobTitle,
        message: "New job position uploaded successfully!",
      });
    } else {
      console.log("already exist");

      res.json({
        success: false,
        message: "Job position already exist!",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

exports.viewJobManage = async (req, res) => {
  try {
    const data = req.query.data;
    const decoded = jwtToken.verify(data, process.env.ADMIN_SECRET_KEY);
    // const decoded = req.id
    const adminId = decoded.id;
    if (adminId) {
      let jobPosition = await Position.find();
      console.log(jobPosition, "jobPosition");
      res.status(200).json({ status: true, jobPosition });
    } else {
      res.json({ status: false });
    }
  } catch (error) {
    console.log(error);
  }
};

exports.accounts = async (req, res) => {
  try {
    const accounts = await PremiumRevenue.find()
      .populate("company")
      .populate("user");
    if (accounts) {
      console.log(accounts, "accounts");
      res.status(200).json({ status: true, accounts });
    } else {
      res.json({ status: false });
    }
  } catch (error) {
    console.log(error);
  }
};

exports.postReported = async (req, res) => {
  try {
    const data = req.query.data;
    const decoded = jwtToken.verify(data, process.env.ADMIN_SECRET_KEY);
    const adminId = decoded.id;

    if (adminId) {
      const posts = await Posts.find()
        .populate({
          path: "user",
          select: ["-password", "-userRequests", "-savedJobs", "-appliedJobs"],
        })
        .populate("reports.seeker");
      const reports = posts.filter((val) => {
        return val.reports.length > 0;
      });
      console.log(reports);
      res.status(200).json({ status: true, Reports: reports });
    } else {
      res.json({ status: false });
    }
  } catch (error) {
    console.log(error);
  }
};

exports.removeReportedPost = async (req, res) => {
  try {
    const { postId, token } = req.body.data;
    const decoded = jwtToken.verify(token, process.env.ADMIN_SECRET_KEY);
    const adminId = decoded.id;

    if (adminId) {
      const postToDrop = await Posts.findOne({ _id: postId });

      if (postToDrop) {
        const deletedPost = await Posts.findOneAndDelete({ _id: postId });
        await User.findOneAndUpdate(
          { _id: deletedPost.user._id },
          { $pull: { posts: postId } }
        );
        res.status(200).json({ success: true, message: "Post removed" });
      } else {
        res.json({ success: false, message: "Post not found" });
      }
    } else {
      res.json({ success: false, message: "Admin not authorized" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "An error occurred" });
  }
};
