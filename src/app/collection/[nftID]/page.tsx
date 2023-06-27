"use client";
import { useParams } from "next/navigation";
import { useNFTMetadata } from "@/app/hooks/useNFTMetadata";
import { contractAddress } from "@/app/page";
import { useEffect } from "react";

export default function NFTPage(props) {
  const { nftID } = useParams();

  return <main>NFT Page {nftID} </main>;
}
