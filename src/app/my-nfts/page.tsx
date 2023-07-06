"use client";
import { useNFTMetadata } from "@/app/hooks/useNFTMetadata";
import { useMetaMask } from "metamask-react";
import Image from "next/image";
import Link from "next/link";
import styled from "@emotion/styled";
import CollectionGrid from "@/components/CollectionGrid";
import { keyframes } from "@emotion/css";
import React from "react";

export default function MyNFTsPage() {
  const { nftTokens, isLoading } = useNFTMetadata(
    process.env.NEXT_PUBLIC_CONTRACT_ADDRESS
  );
  const { account } = useMetaMask();

  return (
    <>
      <title>My NFT&apos;s</title>
      <H1>My NFT&apos;s</H1>
      {!account && <div>Please connect metamask to use this page</div>}
      {account && !isLoading && nftTokens.length === 0 && (
        <div>You don't own any Grimace NFT</div>
      )}
      <CollectionGrid>
        {account && isLoading && (
          <>
            <StyledNFTSkeleton />
            <StyledNFTSkeleton />
            <StyledNFTSkeleton />
            <StyledNFTSkeleton />
            <StyledNFTSkeleton />
            <StyledNFTSkeleton />
          </>
        )}
        {account &&
          nftTokens.map(({ imageSrc, urlSlug, title }) => {
            return (
              <Link key={urlSlug} href={`/my-nfts/${urlSlug}`}>
                <StyledNFTImage
                  width={300}
                  height={300}
                  src={imageSrc}
                  alt={title ?? "my-nft"}
                />
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

const load = keyframes`
  to {
    // Move shine from left to right, with offset on the right based on the width of the shine - see background-size
    background-position: right -40px top 0;
  }
`;

const StyledNFTSkeleton = styled.div`
  width: 100%;
  height: 100%;
  // The skeleton itself will be a light gray
  background-color: #ddd;
  // The shine that's going to move across the skeleton:
  background-image: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0),
    rgba(255, 255, 255, 0.5),
    rgba(255, 255, 255, 0)
  );
  background-size: 40px 100%; // width of the shine
  background-repeat: no-repeat; // No need to repeat the shine effect
  // Place shine on the left side, with offset on the left based on the width of the shine - see background-size
  background-position: left -40px top 0;
  animation: ${load} 1s ease infinite; // increase animation time to see effect in 'slow-mo'
`;
