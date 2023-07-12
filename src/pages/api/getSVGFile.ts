import { NextApiRequest, NextApiResponse } from "next";
import { GetObjectRequest, ListObjectsRequest } from "aws-sdk/clients/s3";
import { JSDOM } from "jsdom";

const AWS = require("aws-sdk");
AWS.config.update({
  accessKeyId: process.env.S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  region: "eu-central-1",
});
const s3 = new AWS.S3();

// TODO: Implement Security
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // tokenURI example "https://<site-name>/metadata/{tokenId}"
  const { nftName } = req.query;

  // connect aws API
  const getParams: GetObjectRequest = {
    Bucket: "grimace-nft",
    Key: `${nftName}.svg` as string,
  };
  s3.getObject(getParams, (err, data) => {
    if (err) {
      console.log(err);
      res
        .status(500)
        .send({
          err,
          accessKey: process.env.S3_ACCESS_KEY_ID,
          secretKey: process.env.S3_SECRET_ACCESS_KEY,
        });
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

export const config = {
  api: {
    responseLimit: false,
  },
};
