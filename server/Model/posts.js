const mongoose = require("mongoose");
const posts = mongoose.Schema({
  user: {
    type: String,
    ref: "User",
  },
  caption: {
    type: String,
    required: true,
  },
  picture: {
    type: String,
  },
  postDate: {
    type: Date,
    default: Date.now,
  },
  commentSection: [
    {
      comment: {
        type: String,
      },
      company: {
        name: String,
        image: String,
      },
      commentDate: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  reports: [
    {
      seeker: {
        type: String,
        ref: "User",
      },
      reason: {
        type: String,
      },
    },
  ],    
});

module.exports = mongoose.model("Posts", posts);
