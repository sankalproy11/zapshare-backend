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
      index: { expires: "5m" }, // Automatically delete the document after 5 minutes if not downloaded
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("File", fileSchema);
