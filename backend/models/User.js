const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    isDeleted: { type: Number, default: 0 },  // Soft delete flag (0 for not deleted, 1 for deleted)
  },
  {
    timestamps: { createdAt: true, updatedAt: true }, // automatically handles createdAt and updatedAt
  }
);

module.exports = mongoose.model('User', UserSchema);
