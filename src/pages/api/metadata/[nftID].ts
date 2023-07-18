import { NextApiRequest, NextApiResponse } from "next";
import nft1Src from "../../../../public/eternal-supreme-ultradegen.jpg";
import nft2Src from "../../../../public/vip-degen-highest-caste.jpg";
import nft3Src from "../../../../public/revered-guardian-of-the-odyssey.jpg";
import nft4Src from "../../../../public/believer-diamond-degen.jpg";
import nft5Src from "../../../../public/golden-degen-dick.jpg";
import nft6Src from "../../../../public/silver-soldier-of-the-odyssey.jpg";
import nftsMetadata from "./NFTsMetadata.json";

function isObjectEmpty(obj) {
  return Object.keys(obj).length === 0;
}

const metadata = {
  "SAFE4LIFE.COM": {
    id: "eternal-supreme-ultradegen",
    // id: "1",
    collection: "Eternal Supreme UltraDegen",
    imageSrc: nft1Src,
  },
  "TEST_LINK.COM": {
    id: "vip-degen-highest-caste",
    // id: "12",
    collection: "VIP-Degen Highest Caste",
    imageSrc: nft2Src,
  },
  rgoto: {
    id: "reverd-guardian-of-the-odyssey",
    // id: "28",
    collection: "Revered Guardian of the Odyssey",
    imageSrc: nft3Src,
  },
  bdd: {
    id: "believer-diamond-degen",
    // id: "35",
    collection: "Believer Diamond Degen",
    imageSrc: nft4Src,
  },
  gdd: {
    id: "golden-degen-dick",
    // id: "46",
    collection: "Golden Degen Dick",
    imageSrc: nft5Src,
  },
  ssoto: {
    id: "silver-soldier-of-the-odyssey",
    // id: "58",
    collection: "Silver Soldier of the Odyssey",
    imageSrc: nft6Src,
  },
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { nftID } = req.query;

    const completeMetadata = { ...nftsMetadata, ...metadata };

    const metadataJson = {
      ...completeMetadata[nftID],
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
