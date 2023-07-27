import { useState } from "react";
import { toast } from "react-toastify";
import { useMetaMask } from "metamask-react";
import { useWeb3Context } from "@/app/hooks/useWeb3";
import useBidsHistory, { IBid } from "@/app/hooks/useAuction/useBidsHistory";

const getApprovedAmount = async ({
  tokenContract,
  account,
  nftContractAddress,
}) => {
  const approvedAmount = BigInt(
    await tokenContract.methods.allowance(account, nftContractAddress).call()
  );
  return { approvedAmount };
};

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

const useAuctionPlaceBid = ({ nftID }: { nftID: number }) => {
  const { account } = useMetaMask();
  const { nftContract, tokenContract, nftContractAddress } = useWeb3Context();

  const {
    isLoading: isBidsLoading,
    pushBid,
    bidsHistory,
  } = useBidsHistory(nftID - 1);

  const [isPendingBid, setIsPendingBid] = useState(false);

  const placeBid = async (auctionDetails, setAuctionDetails) => {
    try {
      setIsPendingBid(true);

      const currentAuctionDetails = await getAuctionDetails({
        nftContract,
        nftID,
      });

      if (
        BigInt(currentAuctionDetails.highestBid) !==
        BigInt(auctionDetails.highestBid)
      ) {
        toast.error("Current bid has been changed");
        throw new Error("Current bid has been changed");
      }

      // Convert bidStep to actual value using decimalsMultiplier
      const decimals = await tokenContract.methods.decimals().call();
      const decimalsMultiplier = BigInt(10) ** BigInt(decimals);

      // Check if the user has approved the contract to spend tokens on their behalf
      const { approvedAmount } = await getApprovedAmount({
        tokenContract,
        account,
        nftContractAddress,
      });

      // Check user balance to not place bid if there's not enough tokens
      const bidAmount =
        BigInt(currentAuctionDetails.highestBid) === BigInt(0)
          ? BigInt(auctionDetails.initialPrice)
          : BigInt(currentAuctionDetails.highestBid) +
            BigInt(currentAuctionDetails.bidStep);
      const balance = await tokenContract.methods.balanceOf(account).call();
      if (balance < bidAmount) {
        toast.error(`You don't have enough GRIMACE to place bid`);
        throw new Error(`You don't have enough GRIMACE to place bid`);
      }

      if (approvedAmount < bidAmount) {
        await tokenContract.methods
          .approve(
            nftContractAddress,
            (bidAmount / decimalsMultiplier).toString()
          )
          .send({ from: account });
        const { approvedAmount } = await getApprovedAmount({
          tokenContract,
          account,
          nftContractAddress,
        });
        if (approvedAmount < bidAmount) {
          toast.error(
            `You need to approve to spend minimum ${
              bidAmount / decimalsMultiplier
            } tokens`
          );
          throw new Error(
            `You need to approve to spend minimum ${
              bidAmount / decimalsMultiplier
            } tokens`
          );
        }
      }

      // Call placeBid function on the smart contract
      const nftIdResponse = await nftContract.methods
        .getNFTBySequentialId(nftID - 1)
        .call();

      const response = await nftContract.methods
        .placeBid(nftIdResponse.toString(), bidAmount.toString())
        .send({ from: account });

      if (Number(response?.status) === 1) {
        // Update the bids history with the new bid
        pushBid({
          amount: bidAmount.toString(),
          address: account,
          timestamp: Math.floor(new Date().getTime() / 1000),
          id: Math.random().toString(),
        } as IBid);
        setAuctionDetails({
          ...currentAuctionDetails,
          highestBid: bidAmount.toString(),
          highestBidder: account,
        });
      }

      setIsPendingBid(false);
    } catch (error) {
      console.error("Failed to place bid:", error);
      toast.error("Failed to place bid, please refresh page or wait");
      setIsPendingBid(false);
    }
  };

  return {
    isPendingBid,
    placeBid,
    isBidsLoading,
    bidsHistory,
  };
};

export default useAuctionPlaceBid;
