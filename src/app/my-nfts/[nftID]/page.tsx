"use client";
import { useParams } from "next/navigation";
import ZoomableImageBox from "@/components/ZoomableImageBox";
import styled from "@emotion/styled";
import { useMetaMask } from "metamask-react";
import { useNFTMetadata } from "@/app/hooks/useNFTMetadata";
import { contractAddress } from "@/app/page";
import { useEffect } from "react";

const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 !important;
  width: 100%;
`;

const StyledName = styled.div`
  font-size: 54px;
`;

const StyledZoomableImageWrapper = styled.div``;

export default function MyNFTPage(props) {
  const { nftID } = useParams();
  const { account } = useMetaMask();
  const { nftTokens, isLoading } = useNFTMetadata(contractAddress);

  if (!account) {
    return <StyledWrapper>Please connect to metamask</StyledWrapper>;
  }
  if (isLoading) {
    return <StyledWrapper>Checking ownership on blockchain</StyledWrapper>;
  }

  const isNFTInToken = nftTokens.find(({ urlSlug }) => urlSlug === nftID);
  if (nftTokens.length > 0 && isNFTInToken) {
    return (
      <StyledWrapper>
        <StyledName>{nftID}</StyledName>
        <ZoomableImageBox width={600} height={600} imageSrc="/NFT-1MAX.svg" />
      </StyledWrapper>
    );
  }
  return <StyledWrapper>You don't have access to this NFT</StyledWrapper>;
}
