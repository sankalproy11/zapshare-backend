// utils/downloadFromS3.js
const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const s3Client = new S3Client({
  region: process.env.REGION,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
  },
});

const generatePresignedUrl = async (Bucket, Key) => {
  const command = new GetObjectCommand({
    Bucket,
    Key,
  });

  // URL expires in 1 hour (3600 seconds)
  const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
  return url;
};

module.exports = { generatePresignedUrl };
