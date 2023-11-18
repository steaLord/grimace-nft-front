"use client";
import { useParams } from "next/navigation";
import styled from "@emotion/styled";
import { useFreeNfts } from "@/hooks/useFreeNfts";
import ZoomableImageBoxFree from "@/components/ZoomableImageBoxFree";

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
  // @ts-ignore
  const { nftName } = useParams();
  const { nftTokens, isLoading } = useFreeNfts();

  if (isLoading) {
    return (
      <StyledWrapper>
        <title>Loading</title>
      </StyledWrapper>
    );
  }

  const nftToken = nftTokens.find(({ urlSlug }) => urlSlug === nftName);
  if (nftTokens.length > 0 && nftToken) {
    return (
      <StyledWrapper>
        <title>
          {nftToken.collection} {nftToken.id}
        </title>
        <StyledName>
          {nftToken.collection} {nftToken.id}
        </StyledName>
        <ZoomableImageBoxFree width={800} height={600} nftID={nftToken.id} />
      </StyledWrapper>
    );
  }
  return (
    <StyledWrapper>
      <title>NFT Preview</title>You don&apos;t have access to this NFT
    </StyledWrapper>
  );
}
