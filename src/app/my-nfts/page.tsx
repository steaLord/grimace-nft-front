"use client";
import { useNFTMetadata } from "@/app/hooks/useNFTMetadata";
import { contractAddress } from "@/app/page";
import { useMetaMask } from "metamask-react";
import Image from "next/image";

export default function MyNFTsPage() {
  const { nftTokens } = useNFTMetadata(contractAddress);
  const { account } = useMetaMask();

  console.log({ nftTokens });
  return (
    <main>
      Owned NFT's page:{" "}
      {!account && <div>Please connect metamask to use this page</div>}
      {nftTokens.map(({ tokenURI, nftMetadata: { title, imageSrc } }) => {
        return (
          <div key={tokenURI}>
            {title}
            <Image src={imageSrc} alt={title} />
          </div>
        );
      })}
    </main>
  );
}
