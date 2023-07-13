import { NextApiRequest, NextApiResponse } from "next";
import S3, { GetObjectRequest } from "aws-sdk/clients/s3";
import { JSDOM } from "jsdom";

const s3 = new S3({
  accessKeyId: process.env.NEXT_PUBLIC_ACCESS_KEY_ID,
  secretAccessKey: process.env.NEXT_PUBLIC_SECRET_ACCESS_KEY,
  region: process.env.NEXT_PUBLIC_AWS_REGION,
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_ACCESS_KEY_ID,
    secretAccessKey: process.env.NEXT_PUBLIC_SECRET_ACCESS_KEY,
  },
});

// TODO: Implement Security
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // tokenURI example "https://<site-name>/metadata/{tokenId}"
  const { nftName } = req.query;

  // connect aws API
  const getParams: GetObjectRequest = {
    Bucket: process.env.NEXT_PUBLIC_BUCKET_SVG_NAME,
    Key: `${nftName}.svg` as string,
  };
  s3.getObject(getParams, (err, data) => {
    if (err) {
      console.log(
        "[LOG]: ACCESS KEY ID",
        process.env.NEXT_PUBLIC_ACCESS_KEY_ID
      );
      console.log(
        "[LOG] SECRET ACCESS KEY:",
        process.env.NEXT_PUBLIC_SECRET_ACCESS_KEY
      );
      console.log({ err });
      res.status(500).send({
        err,
        version: 3.0,
        credentials: {
          accessKeyId: process.env.NEXT_PUBLIC_ACCESS_KEY_ID,
          secretAccessKey: process.env.NEXT_PUBLIC_SECRET_ACCESS_KEY,
        },
      });
    } else {
      const svgResponse = data.Body.toString();
      const dom = new JSDOM(svgResponse);
      const svg = dom.window.document.querySelector("svg");
      const svgString = svg.outerHTML;
      console.log("[LOG]: ", {
        accessKeyId: process.env.NEXT_PUBLIC_ACCESS_KEY_ID,
        secretAccessKey: process.env.NEXT_PUBLIC_SECRET_ACCESS_KEY,
      });
      console.log("[LOG]: ", { svgString });
      res.setHeader("Content-Type", "image/svg+xml");
      res.status(200).send("svgString");
    }
  });
}

export const config = {
  api: {
    responseLimit: "50mb",
    bodyParser: {
      sizeLimit: "50mb",
    },
    timeout: 120000,
  },
};
