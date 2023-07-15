import { NextApiRequest, NextApiResponse } from "next";
import S3, { GetObjectRequest } from "aws-sdk/clients/s3";
import { JSDOM } from "jsdom";
import nftsMetadata from "/NFTsMetadata.json";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // tokenURI example "https://<site-name>/metadata/{tokenId}"
  const { nftID } = req.query;

  const metadata = nftsMetadata?.[nftID];
  console.log({ metadata });
  res.status(200).json(metadata);
}
