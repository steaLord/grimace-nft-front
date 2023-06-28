import { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import fs from "fs";
import {JSDOM} from "jsdom";

// TODO: Implement Security
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // tokenURI example "https://<site-name>/metadata/{tokenId}"
  const { file } = req.query;

  const filePath = path.join(process.cwd(), "public", `NFT-1MAX.svg`);

  if (fs.existsSync(filePath)) {
    // If the file exists, read it
    const svgData = fs.readFileSync(filePath, "utf8");
    const dom = new JSDOM(svgData);
    const svg = dom.window.document.querySelector('svg');
    const svgString = svg.outerHTML;

    // Set the correct Content-Type for SVG files
    res.setHeader("Content-Type", "image/svg+xml");

    // Send the SVG file as a response
    res.status(200).send(svgString);
  } else {
    // If the file doesn't exist, send a 404 Not Found status code
    res.status(404).send("File not found");
  }
}
