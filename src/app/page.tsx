"use client";
import styles from "./page.module.css";
import { StyledButton } from "@/components/Header/Header";
import { useCallback, useEffect, useState } from "react";
import { Web3 } from "web3";
import GrimaceMandalasNFT from "../nftArtifacts/GrimaceMandalaNFT.json";

const useMintNFT = (contractAddress) => {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);

  useEffect(() => {
    const initializeWeb3 = async () => {
      try {
        // Check if MetaMask is available
        if (window.ethereum) {
          // Enable MetaMask and get the current account
          await window.ethereum.enable();
          const web3Instance = new Web3(window.ethereum);
          setWeb3(web3Instance);
          const accounts = await web3Instance.eth.getAccounts();
          setAccount(accounts[0]);
        } else {
          console.error("MetaMask not detected");
        }
      } catch (error) {
        console.error("Error initializing web3:", error);
      }
    };

    initializeWeb3();
  }, []);

  const handleMintNFT = async (uri) => {
    try {
      if (!web3 || !account) {
        console.error("Web3 provider or account not available");
        return;
      }

      console.log({ web3, account });
      // Create an instance of the contract using the contract ABI and address
      const contract = new web3.eth.Contract(
        GrimaceMandalasNFT.abi,
        contractAddress
      );

      console.log({ contract, account });

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

const useCheckNFTTokens = (contractAddress) => {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);
  const [nftTokens, setNFTTokens] = useState([]);

  useEffect(() => {
    const initializeWeb3 = async () => {
      try {
        // Check if MetaMask is available
        if (window.ethereum) {
          // Enable MetaMask and get the current account
          await window.ethereum.enable();
          const web3Instance = new Web3(window.ethereum);
          setWeb3(web3Instance);
          const accounts = await web3Instance.eth.getAccounts();
          setAccount(accounts[0]);
        } else {
          console.error("MetaMask not detected");
        }
      } catch (error) {
        console.error("Error initializing web3:", error);
      }
    };

    initializeWeb3();
  }, []);

  const checkTokens = useCallback(() => {
    const checkNFTTokens = async () => {
      try {
        if (!web3 || !account) {
          console.error("Web3 provider or account not available");
          return;
        }

        // Create an instance of the contract using the contract ABI and address
        const contract = new web3.eth.Contract(
          GrimaceMandalasNFT.abi,
          contractAddress
        );

        // Call the balanceOf function to get the number of tokens owned by the account
        const balance = await contract.methods.balanceOf(account).call();

        console.log({ balance });
        // Retrieve the metadata URI for each token
        const tokens = [];

        for (let i = 0; i < balance; i++) {
          const tokenId = await contract.methods
            .tokenOfOwnerByIndex(account, i)
            .call();
          const tokenURI = await contract.methods.tokenURI(tokenId).call();
          tokens.push({ tokenId, tokenURI });
        }

        setNFTTokens(tokens);
      } catch (error) {
        console.error("Error checking NFT tokens:", error);
      }
    };

    // TODO: CHECK FOR ACCOUNT AND WEB3
    checkNFTTokens();
  }, [web3, account, contractAddress]);

  return { account, nftTokens, checkTokens };
};

export default function Home() {
  const contractAddress = "0x1C5e8f0fa8B15E735dAd516146A56366c5469438";
  const { handleMintNFT } = useMintNFT(contractAddress);
  const { nftTokens, checkTokens } = useCheckNFTTokens(contractAddress);
  console.log({nftTokens});

  return (
    <main className={styles.main}>
      <StyledButton onClick={() => handleMintNFT("TEST_LINK.COM")}>
        Mint NFT
      </StyledButton>
      <StyledButton onClick={() => checkTokens()}>Check NFT Tokens</StyledButton>
    </main>
  );
}
