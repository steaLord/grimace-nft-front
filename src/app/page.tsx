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

const startDate = new Date(
  process.env["TIMER_END_ISO_DATE"] ?? "2023-10-01T00:00:00.000Z"
);
const startTime = startDate.getTime();

function getRemainingSeconds() {
  const secondsRemain = Math.floor((startTime - new Date().getTime()) / 1000);
  return secondsRemain > 0 ? secondsRemain : 0;
}

function useRemainingSeconds() {
  const [remainingSeconds, setRemainingSeconds] = useState(
    getRemainingSeconds()
  );
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
      <title>Grimace NFT</title>
      {released ? (
        <>
          <HeadingPart1>Meet</HeadingPart1>
          <HeadingPart2>Grimace</HeadingPart2>
          <HeadingPart3>NFT</HeadingPart3>
        </>
      ) : (
        <>
          <HeadingPart1>Prepare to</HeadingPart1>
          <HeadingPart2>Grimace NFT</HeadingPart2>
        </>
      )}
      <Subheading className={released ? "released" : ""}>
        The first collection with sense
      </Subheading>
      {!released && <StartCountdown num1={dd} num2={hh} num3={mm} />}
      <Buttons>
        {released ? (
          <Button buttonType={"filled"} href={"#"} className={buttonStyles}>
            Explore
          </Button>
        ) : (
          <Button
            buttonType={"filled"}
            href={"#"}
            className={classNames("disabled", buttonStyles)}
          >
            Coming soon
          </Button>
        )}
        <Button
          target="__blank"
          href="https://app.withmantra.com"
          className={buttonStyles}
        >
          Buy Grimace
        </Button>
      </Buttons>
      <NFTImage src={grimaceNFTImage} alt="Grimace NFT" priority />
    </Root>
  );
}

const Root = styled(Container)`
  width: 100%;
  margin-top: 36px;

  display: grid;

  grid-template-columns: 45% auto 45%;
  grid-template-rows: repeat(6, auto);

  @media (max-width: 992px) {
    grid-template-columns: 100%;
    grid-template-rows: repeat(6, auto);
    padding: 0 24px;
    margin: 0;
  }
`;

const NFTImage = styled(Image)`
  height: auto;
  object-fit: contain;
  max-width: 100%;

  grid-column: 3 / 4;
  grid-row: 1 / 7;

  @media (max-width: 992px) {
    grid-column: 1 / 2;
    grid-row: 5 / 6;
    margin: 0 auto 32px auto;

    max-width: min(400px, 100%);
  }
`;

const HeadingPart1 = styled.span`
  font-size: 2.5rem;
  font-weight: 400;
  line-height: 1;
  margin-top: 36px;

  grid-column: 1 / 2;
  grid-row: 1 / 2;

  @media (max-width: 992px) {
    margin-top: 0;
  }
`;
const HeadingPart2 = styled.span`
  font-size: 4rem;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  line-height: 1;
  white-space: nowrap;

  grid-column: 1 / 2;
  grid-row: 2 / 3;

  @media (max-width: 768px) {
    font-size: 3rem;
  }
`;
const HeadingPart3 = styled.span`
  font-size: 10rem;
  font-weight: 700;
  text-transform: uppercase;
  line-height: 0.8;

  grid-column: 1 / 2;
  grid-row: 3 / 4;
`;

const Subheading = styled.h2`
  font-size: 2rem;
  font-weight: 300;
  white-space: nowrap;

  grid-column: 1 / 2;
  grid-row: 3 / 4;

  &.released {
    grid-column: 1 / 2;
    grid-row: 4 / 5;
    margin: 16px 0 24px 0;
  }

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const StartCountdown = styled(Countdown)`
  grid-column: 1 / 2;
  grid-row: 4 / 5;
  margin: 32px 0;
`;

const Buttons = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  width: min(450px, 100%);

  grid-column: 1 / 2;
  grid-row: 5 / 6;

  @media (max-width: 992px) {
    min-width: min(500px, 100%);
    grid-column: 1 / 2;
    grid-row: 6 / 7;
    margin: auto;
  }

  & > * {
    flex-basis: 100%;
  }
`;

const buttonStyles = css``;
