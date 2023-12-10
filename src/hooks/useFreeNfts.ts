import { useEffect, useState } from "react";
import { useMetaMask } from "metamask-react";
import { useWeb3Context } from "@/hooks/useWeb3";

interface ITokenMetadata {
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
export const useFreeNfts = (): {
  nftTokens: ITokenMetadata[];
  isLoading: boolean;
} => {
  const [nftTokens, setNFTTokens] = useState<ITokenMetadata[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { account } = useMetaMask();

  const checkTokens = async () => {
    try {
      setIsLoading(true);
      // Call the balanceOf function to get the number of tokens owned by the account

      // Retrieve the metadata URI for each token
      const tokens: ITokenMetadata[] = [];
      const fetchPromises: Promise<void>[] = [];
      for (let i = 1; i <= 4; i++) {
        fetchPromises.push(
          new Promise(async (resolve, rej) => {
            try {
              const nftID = i;
              const res = await fetch(`/api/free-nfts/${nftID}`);
              const nftMetadata = await res.json();
              tokens.push({
                ...nftMetadata,
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
      tokens.sort((a, b) => Number(a.id) - Number(b.id));
      setNFTTokens(tokens);
    } catch (error) {
      console.error("Error checking NFT tokens:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      await checkTokens();
    })();
  }, [account]);

  return { nftTokens, isLoading };
};
