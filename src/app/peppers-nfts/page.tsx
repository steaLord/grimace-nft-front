"use client";
import { useNFTMetadata } from "@/hooks/useNFTMetadata";
import { useMetaMask } from "metamask-react";
import Image from "next/image";
import Link from "next/link";
import styled from "@emotion/styled";
import CollectionGrid from "@/components/CollectionGrid";
import { keyframes } from "@emotion/css";
import React from "react";
import useCheckConnection from "../../hooks/useCheckConnection";
import { useRealUser } from "@/hooks/useRealUser";
import { useFreeNfts } from "@/hooks/useFreeNfts";

export default function MyNFTsPage() {
  const { nftTokens, isLoading } = useFreeNfts();

  return (
    <>
      <title>Peppers NFT&apos;s</title>
      <H1>Peppers NFT&apos;s</H1>

      <CollectionGrid>
        {isLoading && (
          <>
            <StyledNFTSkeleton />
            <StyledNFTSkeleton />
            <StyledNFTSkeleton />
            <StyledNFTSkeleton />
            <StyledNFTSkeleton />
            <StyledNFTSkeleton />
          </>
        )}
        {!isLoading &&
          nftTokens.map(({ imageSrc, urlSlug, title, id }) => {
            return (
              <div style={{ position: "relative" }} key={id}>
                <Link key={urlSlug} href={`/peppers-nfts/${urlSlug}`}>
                  <StyledNFTImage
                    width={300}
                    height={300}
                    src={imageSrc}
                    alt={title ?? "peppers-nft"}
                  />
                </Link>
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  <P>{id}</P>
                </div>
              </div>
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
const P = styled.p`
  color: #ac6cff;
  font-size: 32px;
  font-weight: 700;
  text-shadow: -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000,
    2px 2px 0 #000;
`;
const StyledNFTImage = styled(Image)`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 12px;
  transition: background 150ms ease-in-out, opacity 150ms ease-in-out,
    transform 150ms ease-in-out;
  opacity: 0.7;
  &:hover {
    cursor: pointer;
    background: var(--color-purple);
    opacity: 0.9;
    transform: scale(1.05);
  }
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
  border-radius: 12px;
`;
