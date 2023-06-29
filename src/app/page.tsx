"use client";

import styled from "@emotion/styled";
import Image from "next/image";
import grimaceNFTImage from "./grimace-nft-image.png";
import Container from "@/components/Container";
import Countdown from "@/components/Countdown";
import { useEffect, useState } from "react";

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
  return (
    <NFTImage
      src={grimaceNFTImage}
      alt="Grimace NFT"
      priority
    />);
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
const StartCountdown = styled(Countdown)`
  margin-top: 24px;
`;

const startDate = new Date(process.env["TIMER_END_ISO_DATE"] ?? "2023-07-01T00:00:00.000Z");
const startTime = startDate.getTime();

function getRemainingSeconds() {
  return Math.floor((startTime - (new Date()).getTime()) / 1000);
}

function useRemainingTime() {
  const [remainingSeconds, setRemainingSeconds] = useState(getRemainingSeconds());

  useEffect(() => {
    const interval = setInterval(() => {
      setRemainingSeconds(getRemainingSeconds());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const dd = Math.floor(remainingSeconds / 86400);
  const hh = Math.floor((remainingSeconds % 86400) / 3600);
  const mm = Math.floor((remainingSeconds % 3600) / 60);

  return { dd, hh, mm };
}

export default function Home() {
  const { dd, hh, mm } = useRemainingTime();

  return (
    <Root>
      <Content>
        <HeadingWrapper>
          <HeadingPart1>Meet</HeadingPart1>
          <HeadingPart2>Grimace</HeadingPart2>
          <HeadingPart3>NFT</HeadingPart3>
        </HeadingWrapper>
        <Subheading>The first collection with sense</Subheading>
        <StartCountdown num1={dd} num2={hh} num3={mm}/>
      </Content>
      <NFT/>
    </Root>
  );
}

export const contractAddress = "0x1C5e8f0fa8B15E735dAd516146A56366c5469438";
