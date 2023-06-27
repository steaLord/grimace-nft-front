"use client";
import { useParams } from "next/navigation";

export default function NFTPage(props) {
  const { nftID } = useParams();
  console.log({ nftID });

  return <main>NFT Page {nftID} </main>;
}
