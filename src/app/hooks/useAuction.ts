import { useEffect, useState } from "react";
import { Web3 } from "web3/lib/types";
import GrimaceMandalasNFT from "@/nftArtifacts/GrimaceMandalaNFT.json";
import { useMetaMask } from "metamask-react";

const useAuction = ({
  contractAddress,
  tokenId,
}: {
  contractAddress: string;
  tokenId: string;
}) => {
  const { account } = useMetaMask();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuctionStarted, setIsAuctionStarted] = useState(false);
  const [timeLeftForAuction, setTimeLeftForAuction] = useState(null);
  const [currentHighestBid, setCurrentHighestBid] = useState({
    address: "",
    amount: "",
  });
  const [bidStep, setBidStep] = useState(0);

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
          .getAuctionDetails(tokenId)
          .call();
        setIsAuctionStarted(auctionDetails.endTime > 0);
        setTimeLeftForAuction(new Date(auctionDetails.endTime * 1000));
        setCurrentHighestBid({
          address: auctionDetails.highestBidder,
          amount: auctionDetails.highestBid,
        });
        setBidStep(auctionDetails.bidStep);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch auction data:", error);
        setIsLoading(false);
      }
    };

    fetchAuctionData();
  }, [account, contractAddress, tokenId]);

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
        .placeBid(tokenId, newBidAmount)
        .send({ from: account });
    } catch (error) {
      console.error("Failed to place bid:", error);
    }
  };

  return {
    isLoading,
    isAuctionStarted,
    timeLeftForAuction,
    placeBid,
    currentHighestBid,
    bidStep,
  };
};

export default useAuction;
