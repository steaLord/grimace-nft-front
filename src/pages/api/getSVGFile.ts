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

const MAX_CHUNK_SIZE = 512 * 1024; // Maximum chunk size in bytes

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
      res.status(500).send(err);
    } else {
      const svgResponse = data.Body.toString();
      const dom = new JSDOM(svgResponse);
      const svg = dom.window.document.querySelector("svg");
      const svgString = svg.outerHTML;

      const svgChunks = chunkString(svgString, MAX_CHUNK_SIZE);
      sendChunks(res, svgChunks);
      // console.log("[LOG]: ", { svgString });
      // res.setHeader("Content-Type", "image/svg+xml");
      // res.status(200).send("svgString");
    }
  });
}

function chunkString(str: string, size: number) {
  const numChunks = Math.ceil(str.length / size);
  const chunks = new Array(numChunks);

  for (let i = 0, o = 0; i < numChunks; ++i, o += size) {
    chunks[i] = str.substr(o, size);
  }

  return chunks;
}

function sendChunks(res: NextApiResponse, chunks: string[]) {
  res.setHeader("Transfer-Encoding", "chunked");
  res.setHeader("Content-Type", "image/svg+xml");

  const sendChunk = (index: number) => {
    if (index >= chunks.length) {
      res.end();
      return;
    }

    const chunk = chunks[index];
    res.write(chunk, () => {
      sendChunk(index + 1);
    });
  };

  sendChunk(0);
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
