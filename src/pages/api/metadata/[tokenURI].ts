import { NextApiRequest, NextApiResponse } from "next";

const metadata = {
  "SAFE4LIFE.COM": {
    title: "First NFT",
    pngSrc: "",
    description: "",
  },
  "TEST_LINK.COM": {
    title: "Second NFT",
    pngSrc: "",
    description: "",
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
