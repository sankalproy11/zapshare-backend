const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema(
  {
    uploadID: {
      type: String,
      required: true,
    },
    fileName: {
      type: String,
      required: true,
    },
    mimeType: {
      type: String,
      required: true,
    },
    s3Key: {
      type: String,
      required: true,
    },
    otp: {
      type: String,
      required: true,
      unique: true,
    },
    isDownloaded: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    expiresAt: {
      type: Date,
      default: () => new Date(+new Date() + 5 * 60 * 1000), // 5 minutes from now
    },
  },
  {
    timestamps: true,
  }
);

fileSchema.index({ otp: 1, isDownloaded: 1, expiresAt: 1 });

module.exports = mongoose.model("File", fileSchema);
