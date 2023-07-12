import { NextApiRequest, NextApiResponse } from "next";
import { GetObjectRequest } from "aws-sdk/clients/s3";

const AWS = require("aws-sdk");
AWS.config.update({
  accessKeyId: process.env.S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  region: "eu-central-1",
});

// TODO: Implement Security
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { nftName } = req.query;

  // connect aws API
  const s3 = new AWS.S3();

  const getParams: GetObjectRequest = {
    Bucket: "grimace-nft",
    Key: `${nftName}.jpg` as string,
  };
  try {
    const imageObject = await s3.getObject(getParams).promise();
    console.log({ imageObject });
    res.setHeader("Content-Type", "image/jpeg");
    res.send(imageObject.Body);
  } catch (e) {
    res.status(500).end();
  }
}
