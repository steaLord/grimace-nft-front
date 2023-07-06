"use client";

import React, { useEffect, useState } from "react";
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
      <Content>
        {released ? <HeadingMeet /> : <HeadingPrepare />}
        <Subheading>The first collection with sense</Subheading>
        {!released && <StartCountdown num1={dd} num2={hh} num3={mm} />}
        <Buttons>
          {released ? (
            <Button buttonType={"filled"} href={"#"}>
              Explore
            </Button>
          ) : (
            <Button buttonType={"filled"} href={"#"} className={"disabled"}>
              Coming soon
            </Button>
          )}
          <Button target="__blank" href="https://app.withmantra.com">
            Buy Grimace
          </Button>
        </Buttons>
      </Content>
      <NFT />
    </Root>
  );
}
