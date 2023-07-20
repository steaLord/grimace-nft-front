"use client";
import { useParams } from "next/navigation";
import NFTDetails from "@/components/NFTDetails";
import Container from "@/components/Container";
import React from "react";
import nftsMetadata from "/public/NFTsMetadata.json";
import styled from "@emotion/styled";
import useAuction from "@/app/hooks/useAuction";

export default function NFTPage() {
  const { nftID } = useParams() as { nftID: string };
  const { isLoading: isAuctionLoading, auctionDetails } = useAuction({
    nftID: Number(nftID),
    contractAddress: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
  });

  const nftItem = {
    metadata: {
      ...nftsMetadata?.[nftID],
      buyGrimaceHref: "https://coinmarketcap.com/currencies/grimace-top/",
    },
    blockchainData: auctionDetails,
  };
  return (
    <StyledRoot>
      {isAuctionLoading ? (
        <LoadingSpinner width={300} height={300}>
          <Spinner />
          Loading NFT
        </LoadingSpinner>
      ) : (
        <NFTDetails nftItem={nftItem} />
      )}
    </StyledRoot>
  );
}

const StyledRoot = styled(Container)`
  padding-top: 32px;
`;
const LoadingSpinner = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  max-width: 100%;
  max-height: 100%;
  width: ${({ width }) => width + "px"};
  height: ${({ height }) => height + "px"};
  display: flex;
  margin-top: 32px;
  background: #a9a9a9;
  box-shadow: 0px 0px 30px rgba(0, 0, 0, 0.4);
  border-radius: 16px;
`;

const Spinner = styled.div`
  display: inline-block;
  width: 80px;
  height: 80px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #9747ff;
  margin-bottom: 8px;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;
