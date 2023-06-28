"use client";
import { useNFTMetadata } from "@/app/hooks/useNFTMetadata";
import { contractAddress } from "@/app/page";
import { useMetaMask } from "metamask-react";
import Image from "next/image";
import Link from "next/link";
import styled from "@emotion/styled";

const StyledWrapper = styled.div`
  display: grid;
  
`;

export default function MyNFTsPage() {
  const { nftTokens } = useNFTMetadata(contractAddress);
  const { account } = useMetaMask();

  console.log({ nftTokens });
  return (
    <main>
      Owned NFT's page:{" "}
      {!account && <div>Please connect metamask to use this page</div>}
      {nftTokens.map(
        ({imageSrc, urlSlug, title}) => {
          return (
            <Link href={`/my-nfts/${urlSlug}`}>
              <div key={urlSlug}>
                <Image src={imageSrc} alt={title} />
              </div>
            </Link>
          );
        }
      )}
    </main>
  );
}
