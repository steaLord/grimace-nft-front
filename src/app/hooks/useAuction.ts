import { useEffect, useState } from "react";
import { useMetaMask } from "metamask-react";
import { toast } from "react-toastify";
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

const getAuctionDetails = async ({ nftContract, nftID }) => {
  const auctionDetails = await nftContract.methods
    .getAuctionDetails(nftID - 1)
    .call();
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
  const contractAddress = process.env.NEXT_PUBLIC_TOKEN_CONTRACT_ADDRESS;
  useEffect(() => {
    const fetchAuctionData = async () => {
      try {
        setIsLoading(true);
        // Fetch the auction details from the nftContract
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

    if (nftID !== null && contractAddress) {
      fetchAuctionData();
    }
  }, [account, contractAddress, nftID]);

  const placeBid = async () => {
    try {
      setIsPendingBid(true);

      const currentAuctionDetails = await getAuctionDetails({
        nftContract,
        nftID,
      });
      currentAuctionDetails.blockchainNftID = Number(
        currentAuctionDetails.blockchainNftID
      );
      currentAuctionDetails.bidStep = Number(currentAuctionDetails.bidStep);
      currentAuctionDetails.initialPrice = Number(
        currentAuctionDetails.initialPrice
      );
      currentAuctionDetails.endTime = Number(currentAuctionDetails.endTime);
      currentAuctionDetails.highestBid = Number(
        currentAuctionDetails.highestBid
      );
      if (currentAuctionDetails.highestBid !== auctionDetails.highestBid) {
        console.log(
          currentAuctionDetails.highestBid,
          auctionDetails.highestBid
        );
        setAuctionDetails(currentAuctionDetails);
        toast.error("Current bid has been changed");
        throw new Error("Current bid has been changed");
      }

      const decimals = await tokenContract.methods.decimals().call();
      const decimalsMultiplier = BigInt(10) ** BigInt(decimals);
      // Calculate the new bid amount by adding the bid step to the current highest bid
      const newBidAmount =
        BigInt(auctionDetails.highestBid) +
        BigInt(auctionDetails.bidStep) * decimalsMultiplier;
      const balance = await tokenContract.methods.balanceOf(account).call();
      const approvedAmount = await tokenContract.methods
        .allowance(account, contractAddress)
        .call();

      if (Number(approvedAmount) < Number(newBidAmount)) {
        const convertedToTokensBidAmount = Number(
          newBidAmount / decimalsMultiplier
        );
        await tokenContract.methods
          .approve(contractAddress, convertedToTokensBidAmount)
          .send({ from: account });
      }

      const bidAmount =
        auctionDetails.highestBid === 0
          ? BigInt(auctionDetails.initialPrice) * decimalsMultiplier
          : newBidAmount;

      const response = await nftContract.methods
        .placeBid(nftID - 1, bidAmount)
        .send({ from: account });

      if (Number(response?.status) === 1) {
        setAuctionDetails({
          ...auctionDetails,
          highestBid: newBidAmount,
          highestBidder: account,
        });
      }
      setIsPendingBid(false);

      console.log({ response });
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
