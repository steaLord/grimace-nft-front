"use client";
import GrimaceMandalasNFT from "@/nftArtifacts/GrimaceMandalaNFT.json";
import { useMetaMask } from "metamask-react";
import { StyledButton } from "@/components/Header/Header";
import { Web3 } from "web3";

// TODO: Set contract address from proccess.env.CONTRACT_ADDRESS
export const contractAddress = "0x1C5e8f0fa8B15E735dAd516146A56366c5469438";

const useMintNFT = (contractAddress) => {
  const { account } = useMetaMask();

  const handleMintNFT = async (uri) => {
    try {
      if (!account) {
        console.error("Web3 provider or account not available");
        return;
      }

      const web3 = new Web3(window.ethereum);
      // Create an instance of the contract using the contract ABI and address
      const contract = new web3.eth.Contract(
        GrimaceMandalasNFT.abi,
        contractAddress,
      );

      // Call the safeMint function to mint the NFT
      await contract.methods.safeMint(account, uri).send({
        from: account,
      });

      // NFT minted successfully
      console.log("NFT minted successfully!");
    } catch (error) {
      console.error("Error minting NFT:", error);
    }
  };

  return { account, handleMintNFT };
};

export default function Home() {
  const { handleMintNFT } = useMintNFT(contractAddress);
  return (
    <>
      <StyledButton onClick={() => handleMintNFT("ssoto")}>
        Mint NFT
      </StyledButton>
    </>
  );
}
