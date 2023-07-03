"use client";

import styled from "@emotion/styled";
import Image from "next/image";
import grimaceNFTImage from "./grimace-nft-image.png";
import Container from "@/components/Container";
import Countdown from "@/components/Countdown";
import React, { useEffect, useState } from "react";
import Button from "@/components/Button";

const Root = styled(Container)`
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 0 24px;
`;

const Content = styled.div``;

const Subheading = styled.h2`
  font-size: 2rem;
  font-weight: 300;
  margin-bottom: 24px;
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
  font-size: 42px;
  font-weight: 400;
  line-height: 1;
`;
const HeadingPart2 = styled.span`
  font-size: 64px;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  line-height: 1;
  white-space: nowrap;
`;
const HeadingPart3 = styled.span`
  font-size: 210px;
  font-weight: 700;
  text-transform: uppercase;
  line-height: 0.8;
`;

const StartCountdown = styled(Countdown)`
  margin: 28px 0;
`;

const Buttons = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

function HeadingMeet() {
  return (
    <HeadingWrapper>
      <HeadingPart1>Meet</HeadingPart1>
      <HeadingPart2>Grimace</HeadingPart2>
      <HeadingPart3>NFT</HeadingPart3>
    </HeadingWrapper>
  );
}

function HeadingPrepare() {
  return (
    <HeadingWrapper>
      <HeadingPart1>Prepare to</HeadingPart1>
      <HeadingPart2>Grimace NFT</HeadingPart2>
    </HeadingWrapper>
  );
}

const startDate = new Date(process.env["TIMER_END_ISO_DATE"] ?? "2023-07-01T00:00:00.000Z");
const startTime = startDate.getTime();

function getRemainingSeconds() {
  const secondsRemain = Math.floor((startTime - (new Date()).getTime()) / 1000);
  return secondsRemain > 0 ? secondsRemain : 0;
}

function useRemainingSeconds() {
  const [remainingSeconds, setRemainingSeconds] = useState(getRemainingSeconds());
  useEffect(() => {
    const interval = setInterval(() => {
      setRemainingSeconds(getRemainingSeconds());
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  return remainingSeconds;
}

function getRemainingTime(remainingSeconds: number) {
  const dd = Math.floor(remainingSeconds / 86400);
  const hh = Math.floor((remainingSeconds % 86400) / 3600);
  const mm = Math.floor((remainingSeconds % 3600) / 60);

  return { dd, hh, mm };
}

export default function Home() {
  const remainingSeconds = useRemainingSeconds();
  const { dd, hh, mm } = getRemainingTime(remainingSeconds);
  const released = remainingSeconds <= 0;

  return (
    <Root>
      <Content>
        {released ? <HeadingMeet/> : <HeadingPrepare/>}
        <Subheading>The first collection with sense</Subheading>
        {!released && <StartCountdown num1={dd} num2={hh} num3={mm}/>}
        <Buttons>
          {released
            ? <Button buttonType={"filled"} href={"#"}>Explore</Button>
            : <Button buttonType={"filled"} href={"#"} className={"disabled"}>Coming soon</Button>
          }
          <Button target="__blank" href="https://app.withmantra.com">Buy Grimace</Button>
        </Buttons>
      </Content>
      <NFT/>
    </Root>
  );
}

export const contractAddress = "0x1C5e8f0fa8B15E735dAd516146A56366c5469438";
