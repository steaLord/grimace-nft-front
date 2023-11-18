import { NextApiRequest, NextApiResponse } from "next";

import nftsMetadata from "./FreeNFTsMetadata.json";

function isObjectEmpty(obj) {
  return Object.keys(obj).length === 0;
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { nftID } = req.query;
    const completeMetadata = { ...nftsMetadata };

    const metadataJson = {
      ...completeMetadata[nftID as string],
    };

    if (isObjectEmpty(metadataJson)) {
      res.status(404).send(`No metadata found for NFT with ${nftID} ID`);
    }
    // decide what to store in URI
    res.status(200).json({ ...metadataJson, nftID: nftID });
  } catch (e) {
    res.status(500).send(e);
  }
}
