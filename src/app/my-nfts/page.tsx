"use client";
import { useNFTMetadata } from "@/app/hooks/useNFTMetadata";
import { contractAddress } from "@/app/page";
import { useMetaMask } from "metamask-react";
import Image from "next/image";
import Link from "next/link";
import styled from "@emotion/styled";

const StyledRoot = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 0px 320px;
`;

const StyledWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(2, 1fr);
  grid-column-gap: 16px;
  grid-row-gap: 16px;
`;

const StyledTitle = styled.h1`
  font-size: 54px;
  margin-bottom: 22px;
  font-weight: 100;
`;

const StyledNFTImage = styled(Image)`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export default function MyNFTsPage() {
  const { nftTokens } = useNFTMetadata(contractAddress);
  const { account } = useMetaMask();

  console.log({ nftTokens });
  return (
    <StyledRoot>
      <StyledTitle>My NFT's</StyledTitle>
      {!account && <div>Please connect metamask to use this page</div>}
      <StyledWrapper>
        {nftTokens.map(({ imageSrc, urlSlug, title }) => {
          return (
            <Link key={urlSlug} href={`/my-nfts/${urlSlug}`}>
              <StyledNFTImage src={imageSrc} alt={title} />
            </Link>
          );
        })}
      </StyledWrapper>
    </StyledRoot>
  );
}
