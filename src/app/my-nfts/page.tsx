"use client";
import { useNFTMetadata } from "@/app/hooks/useNFTMetadata";
import { contractAddress } from "@/app/page";
import { useMetaMask } from "metamask-react";
import Image from "next/image";
import Link from "next/link";
import styled from "@emotion/styled";
import CollectionGrid from "@/components/CollectionGrid";

export default function MyNFTsPage() {
  const { nftTokens } = useNFTMetadata(contractAddress);
  const { account } = useMetaMask();

  console.log({ nftTokens });
  return (
    <>
      <H1>My NFT's</H1>
      {!account && <div>Please connect metamask to use this page</div>}
      <CollectionGrid>
        {nftTokens.map(({ imageSrc, urlSlug, title }) => {
          return (
            <Link key={urlSlug} href={`/my-nfts/${urlSlug}`}>
              <StyledNFTImage width={300} height={300} src={imageSrc} alt={title ?? "my-nft"}/>
            </Link>
          );
        })}
      </CollectionGrid>
    </>
  );
}

const H1 = styled.h1`
  font-size: 3rem;
  font-weight: 400;
  margin-bottom: 24px;
`;

const StyledNFTImage = styled(Image)`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;
