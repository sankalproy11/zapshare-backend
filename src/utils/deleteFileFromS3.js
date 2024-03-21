const { S3Client, DeleteObjectCommand } = require("@aws-sdk/client-s3");

const s3Client = new S3Client({
  region: process.env.REGION,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
  },
});

const deleteFileFromS3 = async (Bucket, Key) => {
  console.log("Bucket:", Bucket);
  console.log("Key:", Key);

  if (!Bucket || !Key) {
    console.error(`Invalid S3 Bucket (${Bucket}) or Key (${Key})`);
    return;
  }

  const deleteCommand = new DeleteObjectCommand({
    Bucket,
    Key,
  });

  try {
    await s3Client.send(deleteCommand);
    console.log(`File deleted successfully: ${Key}`);
  } catch (error) {
    console.error("Error deleting file from S3:", error);
    throw error;
  }
};

module.exports = deleteFileFromS3;
