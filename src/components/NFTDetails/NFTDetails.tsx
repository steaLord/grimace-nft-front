import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import Button from "@/components/Button";
import Image from "next/image";
import { useRemainingTime } from "@/app/page";

export type NFTDetailsProps = {
  id: string;
  collection: string;
  name: React.ReactNode;
  subheading: React.ReactNode;
  description: React.ReactNode;
  buyHref: string;
  buyGrimaceHref: string;
  imageSrc: string;
};

function NFTDetails({
  name,
  collection,
  id,
  description,
  buyHref,
  buyGrimaceHref,
  imageSrc,
}: NFTDetailsProps) {
  const { isReleased, remainingTime } = useRemainingTime(
    process.env["TIMER_END_ISO_DATE"]
  );
  const [highestBid, setHighestBid] = useState(0);
  const [highestBidder, setHighestBidder] = useState("");
  const bidStep = 3;

  useEffect(() => {
    const fetchAuctionData = async () => {
      try {
        // Fetch the highest bid and bidder information from the contract
        const highestBid = await contract.methods.getHighestBid(id).call();
        const highestBidder = await contract.methods
          .getHighestBidder(id)
          .call();
        setHighestBid(highestBid);
        setHighestBidder(highestBidder);
      } catch (error) {
        console.error("Failed to fetch auction data:", error);
      }
    };

    if (isReleased) {
      fetchAuctionData();
    }
  }, [isReleased, id]);

  const formatTimeLeft = (timeInSeconds) => {
    const days = Math.floor(timeInSeconds / (60 * 60 * 24));
    const hours = Math.floor((timeInSeconds % (60 * 60 * 24)) / (60 * 60));
    const minutes = Math.floor((timeInSeconds % (60 * 60)) / 60);
    const seconds = timeInSeconds % 60;

    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  };

  return (
    <Root>
      <NFTImage
        src={imageSrc}
        alt={typeof name === "string" ? name : "NFT"}
        width={500}
        height={500}
      />
      <Content>
        <Name>
          {collection} {id}
        </Name>
        <Subheading>Auction started</Subheading>
        <Description
          dangerouslySetInnerHTML={{ __html: description }}
        ></Description>
        <BidDetails>
          <BidStep>Bid Step: {bidStep} $GRIMACE</BidStep>
          {isReleased && (
            <>
              <HighestBid>
                {highestBidder && (
                  <>
                    <span>Highest Bid:</span>
                    <span>{highestBid} ETH</span>
                    <span>Bidder: {highestBidder}</span>
                  </>
                )}
              </HighestBid>
              <TimeLeft>Time Left: {formatTimeLeft(remainingTime)}</TimeLeft>
            </>
          )}
        </BidDetails>
        <Buttons>
          <Button
            href={buyHref}
            buttonType="filled"
            isDisabled={!isReleased}
            title={
              !isReleased ? "Wait until release" : "Link to NFT Marketplace"
            }
          >
            Place Bid
          </Button>
          <Button
            href={buyGrimaceHref}
            buttonType="outlined"
            isDisabled={!isReleased}
            target={"__blank"}
            title={!isReleased ? "Wait until release" : "Link to Exchange"}
          >
            Buy Grimace
          </Button>
        </Buttons>
      </Content>
    </Root>
  );
}

const Root = styled.div`
  display: flex;
  width: 100%;

  @media (max-width: 992px) {
    max-width: 500px;
    flex-direction: column;
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

  @media (max-width: 992px) {
    margin-left: 0;
  }
`;

const Name = styled.h1`
  font-size: 3rem;
  font-weight: bold;
  margin-top: 0;

  @media (max-width: 992px) {
    margin-bottom: 12px;
  }
`;

const Subheading = styled.h3`
  font-size: 1.5rem;
  font-weight: 400;
  margin-bottom: 12px;
`;

const Description = styled.p`
  font-size: 0.9rem;
  font-weight: 400;
`;

const BidDetails = styled.div`
  margin-top: 12px;
  font-size: 1rem;

  span {
    display: block;
  }
`;

const BidStep = styled.span`
  margin-bottom: 4px;
`;

const HighestBid = styled.div`
  margin-bottom: 4px;
`;

const TimeLeft = styled.div`
  margin-bottom: 4px;
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

export default NFTDetails;
