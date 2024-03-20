// s3Uploader.js
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const fs = require("fs");
const path = require("path");

// S3 client initialization
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

async function uploadDirectory({
  directoryPath,
  bucketName,
  s3PathPrefix = "",
}) {
  const files = fs.readdirSync(directoryPath);

  for (const file of files) {
    const filePath = path.join(directoryPath, file);
    const fileStat = fs.statSync(filePath);

    if (fileStat.isDirectory()) {
      await uploadDirectory({
        directoryPath: filePath,
        bucketName,
        s3PathPrefix: path.join(s3PathPrefix, file),
      });
    } else {
      const fileContent = fs.readFileSync(filePath);
      const key = path.join(s3PathPrefix, file);

      await s3Client.send(
        new PutObjectCommand({
          Bucket: bucketName,
          Key: key,
          Body: fileContent,
        })
      );

      console.log(`Uploaded ${key} to ${bucketName}`);
    }
  }
}

module.exports = async function (jobData) {
  const { directoryPath, bucketName } = jobData;
  await uploadDirectory({
    directoryPath,
    bucketName,
    s3PathPrefix: jobData.uploadID, // Assuming the S3 path includes the uploadID
  });

  return { message: "Upload completed" };
};
