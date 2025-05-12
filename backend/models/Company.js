const mongoose = require('mongoose');

const CompanySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    industry: { type: String },
    website: { type: String },
    phone: { type: String },
    address: { type: String },

    // Associate company with a user (creator or owner)
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    isDeleted: { type: Number, default: 0 } // 0 = not deleted, 1 = deleted
  },
  {
    timestamps: true, // createdAt and updatedAt
  }
);

module.exports = mongoose.model('Company', CompanySchema);
