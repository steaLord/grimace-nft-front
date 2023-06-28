"use client";

import styled from "@emotion/styled";
import Container from "@/components/Container";
import Image from "next/image";
import grimaceNFTImage from "./grimace-nft-image.png";

const Root = styled(Container)`
  width: 100%;
  display: flex;
  justify-content: space-between;
`;

const Content = styled.div``;

const Subheading = styled.h2`
  font-size: 2rem;
  font-weight: 300;
`;

const NFTImage = styled(Image)`
  width: 500px;
  max-width: 50%;
  height: auto;
`;

function NFT() {
  return <NFTImage src={grimaceNFTImage} alt="Grimace NFT"/>;
}

const HeadingWrapper = styled.h1`
  display: flex;
  flex-direction: column;
  margin-bottom: 14px;
`;
const HeadingPart1 = styled.span`
  font-size: 64px;
  font-weight: 400;
  line-height: 1;
`;
const HeadingPart2 = styled.span`
  font-size: 96px;
  font-weight: 700;
  text-transform: uppercase;
  line-height: 0.8;
`;
const HeadingPart3 = styled.span`
  font-size: 210px;
  font-weight: 700;
  text-transform: uppercase;
  line-height: 0.8;
`;


export default function Home() {
  return (
    <Root>
      <Content>
        <HeadingWrapper>
          <HeadingPart1>Meet</HeadingPart1>
          <HeadingPart2>Grimace</HeadingPart2>
          <HeadingPart3>NFT</HeadingPart3>
        </HeadingWrapper>
        <Subheading>The first collection with sense</Subheading>
      </Content>
      <NFT/>
    </Root>
  );
}
