"use client";
import { useParams } from "next/navigation";
import ZoomableImageBox from "@/components/ZoomableImageBox";
import styled from "@emotion/styled";
import { useMetaMask } from "metamask-react";
import { useNFTMetadata } from "@/app/hooks/useNFTMetadata";
import { contractAddress } from "@/app/page";

const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 24px;
  width: 100%;
`;

const StyledName = styled.div`
  font-size: 54px;
  font-weight: 900;
  margin: 0 auto;
  margin-bottom: 22px;
  text-align: center;
`;

const StyledZoomableImageWrapper = styled.div``;

export default function MyNFTPage(props) {
  const { nftID } = useParams();
  const { account } = useMetaMask();
  const { nftTokens, isLoading } = useNFTMetadata(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS);

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
        <ZoomableImageBox width={600} height={600} nftName="nft1" />
      </StyledWrapper>
    );
  }
  return <StyledWrapper>You don&apos;t have access to this NFT</StyledWrapper>;
}
