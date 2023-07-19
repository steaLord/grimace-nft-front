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
      <NFTDetails nftItem={nftItem} />
    </StyledRoot>
  );
}

const StyledRoot = styled(Container)`
  padding-top: 32px;
`;
