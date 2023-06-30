import { NextApiRequest, NextApiResponse } from "next";
import { GetObjectRequest, ListObjectsRequest } from "aws-sdk/clients/s3";
import { JSDOM } from "jsdom";

const AWS = require("aws-sdk");
AWS.config.update({
  accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
  region: "eu-central-1",
});

// TODO: Implement Security
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // tokenURI example "https://<site-name>/metadata/{tokenId}"
  const { nftName } = req.query;

  // connect aws API
  const s3 = new AWS.S3();
  const listObjectsParams: ListObjectsRequest = {
    Bucket: "grimace-nft",
  };
  s3.listObjects(listObjectsParams, (err, data) => {
    if (err) {
      console.error("Error listing objects:", err);
    } else {
      console.log("Files in the bucket:");
      data.Contents.forEach((object) => {
        console.log(object.Key);
      });
    }
  });

  const getParams: GetObjectRequest = {
    Bucket: "grimace-nft",
    Key: "nft1.svg",
  };
  s3.getObject(getParams, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      const svgResponse = data.Body.toString();
      const dom = new JSDOM(svgResponse);
      const svg = dom.window.document.querySelector("svg");
      const svgString = svg.outerHTML;
      res.setHeader("Content-Type", "image/svg+xml");
      res.status(200).send(svgString);
    }
  });
}
