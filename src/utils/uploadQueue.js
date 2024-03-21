// uploadQueue.js
const Bull = require("bull");
const uploadProcess = require("./s3Uploader"); // The function to upload files to S3

const uploadQueue = new Bull("uploadQueue", {
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD,
  },
});

// Process jobs in the queue
uploadQueue.process(async (job, done) => {
  try {
    const result = await uploadProcess(job.data);
    done(null, result);
  } catch (error) {
    done(error);
  }
});

module.exports = uploadQueue;
