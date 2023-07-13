import { NextApiRequest, NextApiResponse } from "next";
import { GetObjectRequest } from "aws-sdk/clients/s3";
import { JSDOM } from "jsdom";

const AWS = require("aws-sdk");
AWS.config.update({
  region: "eu-central-1",
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
  },
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
  console.log("[LOG]:", "BEFORE FETCHING SVG");
  s3.getObject(getParams, (err, data) => {
    if (err) {
      console.log("[LOG]: ACCESS KEY ID", process.env.ACCESS_KEY_ID);
      console.log("[LOG]: ACCESS KEY ID", process.env.AWS_ACCESS_KEY_ID);
      console.log("[LOG] SECRET ACCESS KEY:", process.env.SECRET_ACCESS_KEY);
      console.log("[LOG] SECRET ACCESS KEY:", process.env.AWS_SECRET_ACCESS_KEY);
      console.log("[LOG] AKI:", process.env.AKI);
      console.log("[LOG] SAK:", process.env.SAK);
      console.log(err);
      res.status(500).send({
        err,
        version: 2.0,
        credentials: {
          accessKeyId: process.env.ACCESS_KEY_ID,
          secretAccessKey: process.env.SECRET_ACCESS_KEY,
        }
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
