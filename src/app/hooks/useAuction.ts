import { useEffect, useState } from "react";
import { useMetaMask } from "metamask-react";
import { useWeb3Context } from "@/app/hooks/useWeb3";

export interface IBlockchainAuctionData {
  nftID: number;
  initialPrice: number;
  bidStep: number;
  timeLeftForAuction: Date;
  endTime: number;
  highestBidder: string;
  highestBid: number | BigInt;
}

export const getAuctionDetails = async ({ nftContract, nftID }) => {
  const auctionDetails = await nftContract?.methods
    ?.getAuctionDetails(nftID - 1)
    ?.call();
  const {
    0: blockchainNftID,
    1: initialPrice,
    2: bidStep,
    3: endTime,
    4: highestBidder,
    5: highestBid,
  } = auctionDetails;

  return {
    blockchainNftID,
    initialPrice,
    bidStep,
    timeLeftForAuction: new Date(Number(endTime) * 1000),
    endTime,
    highestBidder,
    highestBid,
  };
};

const useAuction = ({ nftID }: { nftID: number }) => {
  const { account } = useMetaMask();
  const { nftContract, tokenContract } = useWeb3Context();

  const [isLoading, setIsLoading] = useState(true);
  const [isPendingBid, setIsPendingBid] = useState(false);
  const [auctionDetails, setAuctionDetails] = useState({
    nftID: 0,
    initialPrice: 0,
    bidStep: 0,
    timeLeftForAuction: new Date(),
    endTime: 0,
    highestBidder: "",
    highestBid: 0,
  });
  const tokenContractAddress = process.env.NEXT_PUBLIC_TOKEN_CONTRACT_ADDRESS;

  useEffect(() => {
    const fetchAuctionData = async () => {
      try {
        setIsLoading(true);
        const {
          blockchainNftID,
          bidStep,
          highestBid,
          highestBidder,
          endTime,
          initialPrice,
        } = await getAuctionDetails({ nftContract, nftID });

        setAuctionDetails({
          nftID: Number(blockchainNftID),
          initialPrice: Number(initialPrice),
          bidStep: Number(bidStep),
          timeLeftForAuction: new Date(Number(endTime) * 1000),
          endTime: Number(endTime),
          highestBidder,
          highestBid: Number(highestBid),
        });
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch auction data:", error);
        setIsLoading(false);
      }
    };

    if (nftID !== null && nftContract) {
      fetchAuctionData();
    }
  }, [account, nftContract, nftID]);

  const placeBid = async () => {
    try {
      setIsPendingBid(true);

      const currentAuctionDetails = await getAuctionDetails({
        nftContract,
        nftID,
      });

      // Convert bidStep to actual value using decimalsMultiplier
      const decimals = await tokenContract.methods.decimals().call();
      console.log({ decimals });
      const decimalsMultiplier = BigInt(10) ** BigInt(decimals);

      // Check if the user has approved the contract to spend tokens on their behalf
      const approvedAmount = BigInt(
        await tokenContract.methods
          .allowance(account, tokenContractAddress)
          .call()
      );
      const balance = BigInt(
        await tokenContract.methods.balanceOf(account).call()
      );

      const bidAmount =
        BigInt(currentAuctionDetails.highestBid) === BigInt(0)
          ? BigInt(auctionDetails.initialPrice)
          : BigInt(auctionDetails.bidStep) * BigInt(2);

      console.log({
        approvedAmount,
        approvedAmountLength: approvedAmount.toString().length,
        balance,
        bidAmount,
        bidAmountLength: bidAmount.toString().length,
        isEqual: balance === approvedAmount,
      });

      console.log(
        "Approved:",
        Number(approvedAmount / decimalsMultiplier),
        "BidAmount:",
        Number(bidAmount / decimalsMultiplier)
      );

      if (approvedAmount < bidAmount) {
        // Convert the bid amount to token units for approval
        await tokenContract.methods
          .approve(tokenContractAddress, 10)
          .send({ from: account });
      }

      // Call placeBid function on the smart contract
      const nftIdResponse = await nftContract.methods
        .getNFTBySequentialId(nftID - 1)
        .call();

      console.log(
        { nftIdResponse, bidAmount },
        nftIdResponse.toString(),
        bidAmount.toString()
      );
      const response = await nftContract.methods
        .placeBid(nftIdResponse.toString(), bidAmount.toString())
        .send({ from: account });

      console.log({ response });

      if (Number(response?.status) === 1) {
        // Update the auction details with the new highest bid and highest bidder
        setAuctionDetails({
          ...currentAuctionDetails,
          highestBid: bidAmount.toString(),
          highestBidder: account,
        });
      }

      setIsPendingBid(false);
    } catch (error) {
      console.error("Failed to place bid:", error);
      setIsPendingBid(false);
    }
  };

  return {
    isLoading,
    placeBid,
    auctionDetails,
    isPendingBid,
  };
};

export default useAuction;
