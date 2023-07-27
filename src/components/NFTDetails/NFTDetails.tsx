import React, { useState } from "react";
import styled from "@emotion/styled";
import Button from "@/components/Button";
import Image from "next/image";
import { IBlockchainAuctionData } from "@/app/hooks/useAuction";
import useTimeLeft from "@/app/hooks/useTimeLeft";
import { useMetaMask } from "metamask-react";
import {
  LoadingSpinner,
  Spinner,
} from "@/app/collection/[collectionID]/[nftID]/page";
import { keyframes } from "@emotion/css";
import Countdown from "../Countdown/Countdown";
import BidsHistory from "../BidsHistrory/BidsHistory";

export type NFTDetailsProps = {
  isPendingBid: boolean;
  onPlaceBidClick: () => void;
  nftItem: {
    metadata: {
      id: string;
      collection: string;
      name: React.ReactNode;
      subheading: React.ReactNode;
      description: React.ReactNode;
      buyHref: string;
      buyGrimaceHref: string;
      imageSrc: string;
    };
    blockchainData: IBlockchainAuctionData;
  };
};

function formatAddress(address) {
  const prefix = address.slice(0, 2);
  const firstFour = address.slice(2, 6);
  const lastFour = address.slice(-4);

  return `${prefix}${firstFour}...${lastFour}`;
}

const formatCurrentBid = (bidAmount: number) => {
  const currentBid = BigInt(bidAmount) / BigInt(10) ** BigInt(18);
  return currentBid.toString();
};

function NFTDetails({
  nftItem,
  onPlaceBidClick,
  isPendingBid,
}: NFTDetailsProps) {
  const [isImgLoading, setIsImgLoading] = useState(true);
  const { metadata, blockchainData } = nftItem;
  const { account } = useMetaMask();
  const { id, collection, name, buyGrimaceHref, imageSrc, description } =
    metadata;
  const {
    initialPrice,
    highestBidder,
    highestBid,
    bidStep,
    timeLeftForAuction,
  } = blockchainData;
  const isReleased = initialPrice !== 0;
  const { minutes, seconds, hours } = useTimeLeft(timeLeftForAuction);

  const isHighestBidder =
    account?.toLowerCase() == highestBidder?.toLowerCase();
  const bids = [
    {
      id: 0,
      time: 1627392000,
      amount: 50,
      address: "0xqwerty00000000000000000000000000zxcvbn",
    },
    {
      id: 1,
      time: 1627392000,
      amount: 50,
      address: "0x0000000000000000000000000000000000000000",
    },
  ];
  return (
    <>
      <Root>
        <div style={{ position: "relative" }}>
          {isImgLoading ? (
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            >
              <StyledNFTSkeleton height={500} width={500} />
            </div>
          ) : null}
          <NFTImage
            src={imageSrc}
            alt={typeof name === "string" ? name : "NFT"}
            width={500}
            height={500}
            onLoad={() => setIsImgLoading(false)}
          />
        </div>

        <Content>
          <Name>
            {collection} {id}
          </Name>
          <Subheading>
            {isReleased ? "Auction started" : "Wait for auction"}
          </Subheading>
          <Buttons>
            <Button
              buttonType="filled"
              onClick={onPlaceBidClick}
              disabled={!isReleased || isHighestBidder || isPendingBid}
              title={
                !isReleased ? "Wait until auction" : "Link to NFT Marketplace"
              }
            >
              Place Bid
              {isPendingBid && (
                <Spinner
                  marginLeft="4px"
                  borderWidth="3px"
                  marginBottom="2px"
                  width={20}
                  height={20}
                />
              )}
            </Button>
            <Button
              href={buyGrimaceHref}
              buttonType="outlined"
              target={"__blank"}
              title={buyGrimaceHref}
            >
              Buy Grimace
            </Button>
          </Buttons>

          {isReleased && (
            <>
              <BidsContainer>
                <Bid>
                  Current bid:{" "}
                  <span style={{ fontSize: "1.5rem" }}>
                    {formatCurrentBid(Number(highestBid))}
                  </span>{" "}
                  <span style={{ fontSize: "0.9rem" }}>$GRIMACE</span>
                </Bid>
                <Bid>
                  Min Bid Step:{" "}
                  <span style={{ fontSize: "1.2rem" }}>
                    {formatCurrentBid(Number(bidStep))}
                  </span>{" "}
                  <span style={{ fontSize: "0.9rem" }}>$GRIMACE</span>
                </Bid>
              </BidsContainer>
              <TimeLeftContainer>
                <TimeLeft>Time Left:</TimeLeft>
                <Countdown
                  num1={hours}
                  num2={minutes}
                  num3={seconds}
                  gap={3}
                  fontSize={60}
                />
              </TimeLeftContainer>
            </>
          )}
        </Content>
      </Root>
      <DescriptionTitle>Description</DescriptionTitle>
      <Description>{description}</Description>
      {isReleased && <BidsHistory bids={bids} />}
    </>
  );
}

const Root = styled.div`
  display: flex;
  width: 100%;

  @media (max-width: 992px) {
    max-width: 500px;
    flex-direction: column;
    margin: 0 auto;
  }
`;

const NFTImage = styled(Image)`
  height: auto;
  object-fit: cover;
  max-width: min(500px, 100%);
  max-height: max(400px, 80vh);
  border-radius: 24px;

  @media (max-width: 992px) {
    margin: auto;
  }
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 24px;
  flex: 1;
  text-align: right;
  padding: 0 50px;
  @media (max-width: 992px) {
    margin-left: 0;
  }
`;

const Name = styled.h1`
  font-size: 3rem;
  font-weight: normal;
  margin-top: 0;
  @media (max-width: 992px) {
    margin-bottom: 12px;
  }
`;

const Subheading = styled.h3`
  margin-top: 12px;
`;
const DescriptionTitle = styled.p`
  margin-top: 24px;
  text-align: center;
  font-size: 2rem;
`;
const Description = styled.p`
  margin-top: 18px;
  font-size: 0.9rem;
  font-weight: 400;
  text-align: center;
  @media (max-width: 992px) {
    max-width: 500px;
    margin: auto;
  }
`;
const BidsContainer = styled.div`
  margin-top: 24px;
  margin-bottom: 24px;
`;
const Bid = styled.p`
  margin-bottom: 4px;
  margin-right: 4px;
  // display: inline-block;
  font-size: 1.2rem;
  span {
    display: inline-block;
    color: #ac6cff;
  }
`;
const TimeLeftContainer = styled.div`
  width: 377px;
`;
const TimeLeft = styled.div`
  font-size: 1.5rem;
  font-weight: 400;
  text-align: left;
  margin-bottom: 8px;
`;

const Buttons = styled.div`
  gap: 24px;
  display: flex;
  justify-content: flex-end;
  margin-top: 24px;

  @media (max-width: 992px) {
    justify-content: space-between;
    gap: 16px;
    margin: 16px 0;
  }

  & > * {
    width: 100%;
  }
`;
const load = keyframes`
  to {
    // Move shine from left to right, with offset on the right based on the width of the shine - see background-size
    background-position: right -40px top 0;
  }
`;
const StyledNFTSkeleton = styled.div`
  width: ${({ width }) => width + "px"};
  height: ${({ height }) => height + "px"};
  // The skeleton itself will be a light gray
  background-color: #ddd;
  // The shine that's going to move across the skeleton:
  background-image: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0),
    rgba(255, 255, 255, 0.5),
    rgba(255, 255, 255, 0)
  );
  background-size: 40px 100%; // width of the shine
  background-repeat: no-repeat; // No need to repeat the shine effect
  // Place shine on the left side, with offset on the left based on the width of the shine - see background-size
  background-position: left -40px top 0;
  animation: ${load} 1s ease infinite; // increase animation time to see effect in 'slow-mo'
  border-radius: 12px;
`;
export default NFTDetails;
