import { useEffect, useState } from "react";
import { useWeb3Context } from "@/app/hooks/useWeb3";
import { getAuctionDetails } from "@/app/hooks/useAuction/useAuctionPlaceBid";

export interface IBlockchainAuctionData {
  nftID: number;
  initialPrice: number;
  bidStep: number;
  timeLeftForAuction: Date;
  endTime: number;
  highestBidder: string;
  highestBid: number | BigInt;
}

const useAuctionDetails = ({ nftID }: { nftID: number }) => {
  const { nftContract } = useWeb3Context();

  const [isLoading, setIsLoading] = useState(true);
  const [auctionDetails, setAuctionDetails] = useState<IBlockchainAuctionData>({
    nftID: 0,
    initialPrice: 0,
    bidStep: 0,
    timeLeftForAuction: new Date(),
    endTime: 0,
    highestBidder: "",
    highestBid: 0,
  });

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
  }, [nftContract, nftID]);

  return {
    isLoading,
    auctionDetails,
    setAuctionDetails,
  };
};

export default useAuctionDetails;
