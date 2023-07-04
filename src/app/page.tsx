"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import styled from "@emotion/styled";
import { css } from "@emotion/css";
import classNames from "classnames";
import grimaceNFTImage from "./grimace-nft-image.png";
import Container from "@/components/Container";
import Countdown from "@/components/Countdown";
import Button from "@/components/Button";

const Root = styled(Container)`
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 0 24px;
  flex-direction: column;

  @media (min-width: 992px) {
    flex-wrap: wrap;
    max-height: 500px;
    padding: 24px;
  }
`;

const HeadingsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  order: 1;

  @media (min-width: 768px) and (max-width: 992px) {
    margin: auto;
  }
`

const Subheading = styled.h2`
  font-size: 2rem;
  font-weight: 300;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const NFTImage = styled(Image)`
  max-width: 500px;
  height: auto;
  object-fit: contain;
  order: 3;

  @media (max-width: 992px) {
    max-width: 500px;
    align-self: center;
    margin-top: 24px;
    width: 100%;
    order: 2;
  }

  @media (min-width: 992px) {
    max-width: 500px;
    align-self: center;
    margin-top: 24px;
    width: 40%;
    order: 2;
  }
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
  font-size: 2.5rem;
  font-weight: 400;
  line-height: 1;
`;
const HeadingPart2 = styled.span`
  font-size: 4rem;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  line-height: 1;
  white-space: nowrap;
`;
const HeadingPart3 = styled.span`
  font-size: 10rem;
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
  order: 2;
  margin-top: 24px;

  @media (max-width: 992px) {
    order: 3;
    margin: 24px auto auto;
    min-width: min(500px, 100%);

  }
`;

const buttonStyles = css`
  flex-basis: 200px;

  @media (max-width: 992px) {
    flex: 1 1 50%;
    max-width: 250px;
  }
`

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
      <HeadingsContainer>
        {released ? <HeadingMeet/> : <HeadingPrepare/>}
        <Subheading>The first collection with sense</Subheading>
        {!released && <StartCountdown num1={dd} num2={hh} num3={mm}/>}
      </HeadingsContainer>
      <Buttons>
        {released
          ? <Button buttonType={"filled"} href={"#"} className={buttonStyles}>Explore</Button>
          : <Button buttonType={"filled"} href={"#"} className={classNames("disabled", buttonStyles)}>
            Coming soon
          </Button>
        }
        <Button target="__blank" href="https://app.withmantra.com" className={buttonStyles}>Buy Grimace</Button>
      </Buttons>
      <NFT/>
    </Root>
  );
}

export const contractAddress = "0x1C5e8f0fa8B15E735dAd516146A56366c5469438";
