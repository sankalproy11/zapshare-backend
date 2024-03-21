const File = require("../models/File");
const { generatePresignedUrl } = require("../utils/downloadFromS3");

const downloadFile = async (req, res) => {
  try {
    const { otp } = req.body;

    const file = await File.findOne({
      otp: otp,
      isDownloaded: false,
      expiresAt: { $gt: new Date() },
    });
    if (!file) {
      return res
        .status(404)
        .json({ message: "File not found or OTP is invalid/expired." });
    }

    await File.updateOne({ _id: file._id }, { $set: { isDownloaded: true } });

    const url = await generatePresignedUrl(process.env.BUCKET_NAME, file.s3Key);

    res.json({ url });
  } catch (error) {
    console.error("Download error:", error);
    res
      .status(500)
      .json({ message: "An error occurred during the download process." });
  }
};

module.exports = { downloadFile };
