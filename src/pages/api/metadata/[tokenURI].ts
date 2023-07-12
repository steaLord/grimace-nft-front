import { NextApiRequest, NextApiResponse } from "next";
import nft1Src from "../../../../public/eternal-supreme-ultradegen.jpg";
import nft2Src from "../../../../public/vip-degen-highest-caste.jpg";
import nft3Src from "../../../../public/revered-guardian-of-the-odyssey.jpg";
import nft4Src from "../../../../public/believer-diamond-degen.jpg";
import nft5Src from "../../../../public/golden-degen-dick.jpg";
import nft6Src from "../../../../public/silver-soldier-of-the-odyssey.jpg";

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

  const metadataJson = { ...metadata[tokenURI], svgSrc: "" /*aws response*/ };
  // decide what to store in URI
  res.status(200).json({ ...metadataJson });
}
