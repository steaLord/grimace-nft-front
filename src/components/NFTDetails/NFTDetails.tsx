import React from "react";
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
  const { minutes, seconds, hours, days } = useTimeLeft(timeLeftForAuction);

  const isHighestBidder =
    account?.toLowerCase() == highestBidder?.toLowerCase();
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
        <Subheading>
          {isReleased ? "Auction started" : "Wait for auction"}
        </Subheading>
        <Description
          dangerouslySetInnerHTML={{ __html: description }}
        ></Description>
        <BidDetails>
          {isReleased && (
            <>
              <BidStep>
                Initial price: {initialPrice} <span>$GRIMACE</span>
              </BidStep>
              <BidStep>
                Bid Step: {bidStep} <span>$GRIMACE</span>
              </BidStep>
              <HighestBid>
                <>
                  <p>
                    Highest Bid: {formatCurrentBid(highestBid)}{" "}
                    <span>$GRIMACE</span>
                  </p>
                  <p>Bidder: {formatAddress(highestBidder)}</p>
                </>
              </HighestBid>
              <TimeLeft>
                Time Left: {days} Days {hours} hours {minutes} minutes {seconds}{" "}
                seconds
              </TimeLeft>
            </>
          )}
        </BidDetails>
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
              <Spinner marginLeft="4px" borderWidth="3px" marginBottom="2px" width={20} height={20} />
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

const BidStep = styled.p`
  margin-bottom: 4px;
  margin-right: 4px;
  display: inline-block;
  padding: 8px;
  border-radius: 12px;
  border: 1px solid #ac6cff;
  span {
    display: inline-block;
    color: #ac6cff;
  }
`;

const HighestBid = styled.div`
  margin-bottom: 4px;
  max-width: fit-content;
  padding: 8px;
  border-radius: 12px;
  border: 1px solid #ac6cff;
  span {
    display: inline-block;
    color: #ac6cff;
  }
`;

const TimeLeft = styled.div`
  margin-bottom: 4px;
  max-width: fit-content;
  padding: 8px;
  border-radius: 12px;
  border: 1px solid #ac6cff;
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
