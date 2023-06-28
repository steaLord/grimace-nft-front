import { NextApiRequest, NextApiResponse } from "next";
import nft1Src from ".././../../../public/nft1.jpeg";
import nft2Src from ".././../../../public/nft2.jpeg";
import nft3Src from ".././../../../public/nft3.jpeg";
import nft4Src from ".././../../../public/nft4.jpeg";
import nft5Src from ".././../../../public/nft5.jpeg";
import nft6Src from ".././../../../public/nft6.jpeg";

const metadata = {
  "SAFE4LIFE.COM": {
    title: "Eternal Supreme UltraDegen",
    imageSrc: nft1Src,
    urlSlug: "eternal-supreme-ultradegen",
  },
  "TEST_LINK.COM": {
    title: "VIP-Degen Highest Caste",
    imageSrc: nft2Src,
    urlSlug: "vip-degen-highest-caste",
  },
  rgoto: {
    title: "Revered Guardian of the Odyssey",
    imageSrc: nft3Src,
    urlSlug: "revered-guardian-of-the-odyssey",
  },
  bdd: {
    title: "Believer Diamond Degen",
    imageSrc: nft4Src,
    urlSlug: "believer-diamond-degen",
  },
  gdd: {
    title: "Golden Degen Dick",
    imageSrc: nft5Src,
    urlSlug: "golden-degen-dick",
  },
  ssoto: {
    title: "Silver Soldier of the Odyssey",
    imageSrc: nft6Src,
    urlSlug: "silver-soldier-of-the-odyssey",
  },
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // tokenURI example "https://<site-name>/metadata/{tokenId}"
  const { tokenURI } = req.query;

  // connect aws API

  const metadataJson = { ...metadata[tokenURI], svgSrc: "" /*aws response*/ };
  // decide what to store in URI
  res.status(200).json({ ...metadataJson });
}
