"use client";
import styles from "./page.module.css";
import { useCallback, useEffect, useState } from "react";
import { Web3 } from "web3";
import GrimaceMandalasNFT from "../nftArtifacts/GrimaceMandalaNFT.json";

// TODO: Move into hooks folder
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
  // TODO: Set contract address from proccess.env.CONTRACT_ADDRESS
  const contractAddress = "0x1C5e8f0fa8B15E735dAd516146A56366c5469438";
  return <main className={styles.main}></main>;
}
