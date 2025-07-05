const QRCode = require("qrcode");
const AWS = require("aws-sdk");
const s3 = new AWS.S3({ region: "us-east-1" });

const BUCKET_NAME = "ai-product-bot"; // your actual bucket

exports.generateQRCode = async (text) => {
  return await QRCode.toDataURL(text);
};

exports.uploadToS3 = async (product_id, base64Image) => {
  const base64 = base64Image.replace(/^data:image\/png;base64,/, "");
  const buffer = Buffer.from(base64, "base64");

  const params = {
    Bucket: BUCKET_NAME,
    Key: `qrs/${product_id}.png`,
    Body: buffer,
    ContentEncoding: "base64",
    ContentType: "image/png",
    ACL: "public-read" // Dev only; for prod use signed URLs
  };

  await s3.putObject(params).promise();

  return `https://${BUCKET_NAME}.s3.amazonaws.com/${params.Key}`;
};
