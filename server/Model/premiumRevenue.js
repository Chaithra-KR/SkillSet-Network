const mongoose = require('mongoose');

const premiumRevenueSchema = mongoose.Schema({
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
  },
  amount: {
    type: Number,
    required: true,
  },
  paymentDate: {
    type: Date,
    default: Date.now,
  },
  premiumStatus:{
    type:Boolean,
    default:false
},
});

module.exports = mongoose.model('PremiumRevenue', premiumRevenueSchema);
