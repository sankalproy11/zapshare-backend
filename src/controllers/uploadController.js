const FileTransfer = require("../models/File");
const uploadQueue = require("../utils/uploadQueue");
const deleteFileQueue = require("../utils/deleteFileQueue");

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
    const job = await uploadQueue.add({
      directoryPath: `./uploads/${req.uploadID}`,
      bucketName: process.env.BUCKET_NAME,
      uploadID: req.uploadID,
    });

    // Listen for job completion to send the response
    job
      .finished()
      .then(() => {
        res.json({
          message: "File uploaded successfully to S3.",
          otp: otp,
        });
      })
      .catch((error) => {
        res.status(500).json({
          message: "Error during file upload",
          error: error.message,
        });
      });

    // Schedule deletion of the file from S3 after 5 minutes
    await deleteFileQueue.add(
      {
        Bucket: process.env.BUCKET_NAME,
        Key: newFile.s3Key,
        uploadID: req.uploadID,
      },
      {
        delay: 5 * 60 * 1000,
      }
    );
  } catch (saveError) {
    res.status(500).json({
      message: "Error saving file information",
      error: saveError.message,
    });
  }
};

module.exports = { uploadFile };
