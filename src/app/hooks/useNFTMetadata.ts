import { useEffect, useState } from "react";
import GrimaceMandalasNFT from "@/nftArtifacts/GrimaceMandalaNFT.json";
import { useMetaMask } from "metamask-react";
import { Web3 } from "web3";

interface ITokenMetadata {
  web3Id: any;
  id: string;
  imageSrc: string;
  urlSlug: string;
  title?: string;
  collection?: string;
  description?: string;
}

export const collectionNameToURLSlug = (collection: string) => {
  return collection.toLowerCase().replace(/\s+/g, "-");
};

// TODO: Set contract address from proccess.env.NEXT_PUBLIC_CONTRACT_ADDRESS
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

      const fetchPromises = [];
      for (let i = 0; i < balance; i++) {
        fetchPromises.push(
          new Promise(async (resolve, rej) => {
            try {
              const tokenId = await contract.methods
                .tokenOfOwnerByIndex(account, i)
                .call();
              const tokenURI = (await contract.methods
                .tokenURI(tokenId)
                .call()) as string;
              const nftID = tokenURI?.split("/")?.pop();
              const res = await fetch(`/api/metadata/${nftID}`);
              const nftMetadata = await res.json();
              tokens.push({
                ...nftMetadata,
                web3Id: tokenId,
                urlSlug:
                  collectionNameToURLSlug(nftMetadata.collection) +
                  "-" +
                  nftMetadata.id,
              });
              resolve();
            } catch (e) {
              rej(e);
            }
          })
        );
      }

      await Promise.all(fetchPromises);

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
