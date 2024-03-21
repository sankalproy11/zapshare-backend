const Bull = require("bull");
const deleteFileFromS3 = require("../utils/deleteFileFromS3");
const deleteFolderAndFiles = require("../utils/deleteFolderAndFiles");
const path = require("path");

const deleteFileQueue = new Bull("deleteQueue", {
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD,
  },
});

deleteFileQueue.process(async (job) => {
  console.log("Job data:", job.data);
  const { Bucket, Key, uploadID } = job.data; // Assuming uploadID is part of job.data now
  await deleteFileFromS3(Bucket, Key);

  // If the job should also delete a folder (based on some condition or job data)
  if (uploadID) {
    const folderPath = path.join(__dirname, "..", "..", "uploads", uploadID); // Adjust based on your structure
    console.log("Deleting folder:", folderPath);
    await deleteFolderAndFiles(folderPath);
  }
});

module.exports = deleteFileQueue;
