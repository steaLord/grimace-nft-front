import { useEffect, useState } from "react";
import GrimaceMandalasNFT from "@/nftArtifacts/GrimaceMandalaNFT.json";
import TokenETH from "@/nftArtifacts/TokenETH.json";
import { useMetaMask } from "metamask-react";
import { Web3 } from "web3";
import { toast } from "react-toastify";

export interface IBlockchainAuctionData {
  nftID: number;
  initialPrice: number;
  bidStep: number;
  timeLeftForAuction: Date;
  endTime: number;
  highestBidder: string;
  highestBid: number | BigInt;
}

const useAuction = ({
  contractAddress,
  nftID,
}: {
  contractAddress: string;
  nftID: number;
}) => {
  const { account } = useMetaMask();
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
  const [fetchTrigger, setFetchTrigger] = useState(false);

  useEffect(() => {
    const fetchAuctionData = async () => {
      try {
        setIsLoading(true);
        const web3 = new Web3(window.ethereum);
        // Create an instance of the contract using the contract ABI and address
        const contract = new web3.eth.Contract(
          GrimaceMandalasNFT.abi,
          contractAddress
        );
        // Fetch the auction details from the contract
        const auctionDetails = await contract.methods
          .getAuctionDetails(nftID - 1)
          .call();
        const {
          0: blockchainnftID,
          1: initialPrice,
          2: bidStep,
          3: endTime,
          4: highestBidder,
          5: highestBid,
        } = auctionDetails;

        setAuctionDetails({
          nftID: Number(blockchainnftID),
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
  }, [account, contractAddress, nftID, fetchTrigger]);

  const placeBid = async (currentHighestBid: number) => {
    try {
      setIsPendingBid(true);
      const web3 = new Web3(window.ethereum);
      // Create an instance of the contract using the contract ABI and address
      const auctionContract = new web3.eth.Contract(
        GrimaceMandalasNFT.abi,
        contractAddress
      );
      const tokenContract = new web3.eth.Contract(
        TokenETH.abi,
        process.env.NEXT_PUBLIC_TOKEN_CONTRACT_ADDRESS
      );

      const currentAuctionDetails = await auctionContract.methods
        .getAuctionDetails(nftID - 1)
        .call();
      const {
        0: blockchainnftID,
        1: initialPrice,
        2: bidStep,
        3: endTime,
        4: highestBidder,
        5: highestBid,
      } = auctionDetails;
      if (highestBid !== auctionDetails.highestBid) {
        setAuctionDetails(currentAuctionDetails);
        // Do popup here
        throw new Error("Data have changed on blockchain");
      }

      const decimals = await tokenContract.methods.decimals().call();
      const decimalsMultiplier = BigInt(10) ** BigInt(decimals);
      if (currentHighestBid < auctionDetails.highestBid) {
        toast.error("Current bid has been changed");
        setFetchTrigger(!fetchTrigger);
        return;
      }
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

      const response = await auctionContract.methods
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
      // show error popup here too of error.msg is right
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
