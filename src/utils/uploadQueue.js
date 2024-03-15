const Queue = require("bull");
const { uploadToS3 } = require("./s3Uploader");

// Create a Bull queue for file uploads
const uploadQueue = new Queue("upload-queue", {
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
});

uploadQueue.process(async (job, done) => {
  try {
    const { file, s3Key } = job.data;
    await uploadToS3(file, s3Key);
    done();
  } catch (error) {
    console.error("Failed to upload file to S3:", error);
    done(error);
  }
});

module.exports = { uploadQueue };
