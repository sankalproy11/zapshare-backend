const multer = require("../middlewares/multer");
const FileTransfer = require("../models/File");
// const { uploadQueue } = require("../utils/uploadQueue");

const generateOtp = () => {
  return Math.random().toString().slice(-6);
};

const uploadFile = async (req, res, next) => {
  let otp = generateOtp();
  let otpExists = true;

  while (otpExists) {
    const existingOtp = await FileTransfer.findOne({
      otp: otp,
      createdAt: { $gt: new Date(Date.now() - 5 * 60 * 1000) },
    });
    if (!existingOtp) {
      otpExists = false;
    } else {
      otp = generateOtp();
    }
  }

  const newFile = new FileTransfer({
    uploadID: req.uploadID,
    fileName: req.file.originalname,
    mimeType: req.file.mimetype,
    s3Key: `${req.uploadID}/${req.file.filename}`,
    otp: otp,
    isDownloaded: false,
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + 5 * 60 * 1000),
  });

  try {
    await newFile.save();

    //   uploadQueue.add({
    //     filePath: req.file.path,
    //     fileName: req.file.originalname,
    //     s3Key: req.file.filename,
    //   });

    res.json({
      message: "File uploaded successfully, processing for S3.",
      otp: otp,
    });
  } catch (saveError) {
    res.status(500).json({
      message: "Error saving file information",
      error: saveError.message,
    });
  }
};

module.exports = { uploadFile };
