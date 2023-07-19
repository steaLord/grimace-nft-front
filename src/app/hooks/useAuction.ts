import { useEffect, useState } from "react";
import GrimaceMandalasNFT from "@/nftArtifacts/GrimaceMandalaNFT.json";
import { useMetaMask } from "metamask-react";
import { Web3 } from "web3";

export interface IBlockchainAuctionData {
  nftID: number;
  initialPrice: number;
  bidStep: number;
  timeLeftForAuction: number;
  endTime: number;
  highestBidder: string;
  highestBid: number;
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
  const [auctionDetails, setAuctionDetails] = useState({
    nftID: 0,
    initialPrice: 0,
    bidStep: 0,
    timeLeftForAuction: 0,
    endTime: 0,
    highestBidder: "",
    highestBid: 0,
  });

  useEffect(() => {
    const fetchAuctionData = async () => {
      try {
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
          timeLeftForAuction: Number(new Date(Number(endTime) * 1000)),
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
      const web3 = new Web3(window.ethereum);
      // Create an instance of the contract using the contract ABI and address
      const contract = new web3.eth.Contract(
        GrimaceMandalasNFT.abi,
        contractAddress
      );
      // Calculate the new bid amount by adding the bid step to the current highest bid
      const newBidAmount = Number(currentHighestBid.amount) + Number(bidStep);
      // Use the contract's method to place a bid with the calculated `newBidAmount`
      await contract.methods
        .placeBid(nftID, newBidAmount)
        .send({ from: account });
    } catch (error) {
      console.error("Failed to place bid:", error);
    }
  };

  return {
    isLoading,
    placeBid,
    auctionDetails,
  };
};

export default useAuction;
