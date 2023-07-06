import { useEffect, useState } from "react";
import GrimaceMandalasNFT from "@/nftArtifacts/GrimaceMandalaNFT.json";
import { useMetaMask } from "metamask-react";
import { Web3 } from "web3";

interface ITokenMetadata {
  imageSrc: string;
  urlSlug: string;
  title?: string;
  collectionName?: string;
  description?: string;
}

// TODO: Set contract address from proccess.env.CONTRACT_ADDRESS
export const useNFTMetadata = (
  contractAddress: string
): { nftTokens: ITokenMetadata[]; isLoading: boolean } => {
  const [nftTokens, setNFTTokens] = useState<ITokenMetadata[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { account } = useMetaMask();

  const checkTokens = async () => {
    try {
      if (!account) {
        alert("Please connect metamask to check your collection");
        return;
      }
      setIsLoading(true);

      const web3 = new Web3(window.ethereum);
      // Create an instance of the contract using the contract ABI and address
      const contract = new web3.eth.Contract(
        GrimaceMandalasNFT.abi,
        contractAddress
      );

      // Call the balanceOf function to get the number of tokens owned by the account
      const balance = await contract.methods.balanceOf(account).call();

      // Retrieve the metadata URI for each token
      const tokens: ITokenMetadata[] = [];

      for (let i = 0; i < balance; i++) {
        const tokenId = await contract.methods
          .tokenOfOwnerByIndex(account, i)
          .call();
        const tokenURI = await contract.methods.tokenURI(tokenId).call();
        const res = await fetch(`/api/metadata/${tokenURI}`);
        const nftMetadata = await res.json();
        tokens.push({ ...nftMetadata });
      }

      setNFTTokens(tokens);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error("Error checking NFT tokens:", error);
    }
  };

  useEffect(() => {
    (async () => {
      if (account) {
        await checkTokens();
      }
      if (!account) {
        setIsLoading(false);
      }
    })();
  }, [account]);

  return { nftTokens, isLoading };
};
