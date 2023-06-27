"use client";
import { useNFTMetadata } from "@/app/hooks/useNFTMetadata";
import { contractAddress } from "@/app/page";
import { useMetaMask } from "metamask-react";

export default function MyNFTsPage() {
  const { nftTokens } = useNFTMetadata(contractAddress);
  const { account } = useMetaMask();

  return (
    <main>
      Owned NFT's page:{" "}
      {!account && <div>Please connect metamask to use this page</div>}
      {nftTokens.map(({ tokenURI, nftMetadata }) => {
        return <div>{tokenURI}</div>;
      })}
    </main>
  );
}
