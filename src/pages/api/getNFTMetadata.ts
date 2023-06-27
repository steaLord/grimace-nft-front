import { NextApiRequest, NextApiResponse } from "next";

interface IGetNFTImages {
  nftID: string;
}

// all token ID's to check ID from front is real
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const {}: IGetNFTImages = req.body;

  res.status(200).json({ someData: "data" });
}
