import { NextApiRequest, NextApiResponse } from "next";

interface IGetNFTImages {
  tokenURI: string;
}

// all token ID's to check ID from front is real
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // tokenURI example "https://<site-name>/metadata/{tokenId}"
  const { tokenURI }: IGetNFTImages = req.body;

  // connect aws API

  // decide what to store in URI
  res.status(200).json({ someData: "data" });
}
