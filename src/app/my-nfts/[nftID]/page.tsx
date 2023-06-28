"use client";
import { useParams } from "next/navigation";
import ZoomableImageBox from "@/components/ZoomableImageBox";
import styled from "@emotion/styled";

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

  return (
    <StyledWrapper>
      <StyledName>{nftID}</StyledName>
      <ZoomableImageBox width={900} height={580} imageSrc="/NFT-1MAX.svg" />
    </StyledWrapper>
  );
}
