import { useMetaMask } from "metamask-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const useCheckConnection = () => {
  const { status, chainId, switchChain } = useMetaMask();
  const [isOnRightChain, setIsOnRightChain] = useState(false);
  const [isMetamaskInstalled, setIsMetamaskInstalled] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  //testnet chainid
  const targetChainId = "0x238";
  //testnet chainid
  useEffect(() => {
    if (status !== "initializing") {
      (() => {
        //@ts-ignore
        if (status === "unavailable") {
          // MetaMask is not installed
          setIsMetamaskInstalled(false);
          toast.info("Please install MetaMask");
        } else if (status === "notConnected") {
          // User is not connected to MetaMask
          setIsMetamaskInstalled(true);
          setIsConnected(false);
          setIsOnRightChain(false);
          toast.info("Please connect to MetaMask");
        } else if (chainId !== targetChainId) {
          // User is connected to MetaMask but not on the right chain
          setIsMetamaskInstalled(true);
          setIsConnected(true);
          setIsOnRightChain(false);
          toast.info("Please connect to the DogeChain");
          switchChain(targetChainId);
        } else {
          // User is connected to MetaMask and on the right chain
          if (!isOnRightChain) {
            toast.success("You're all set!");
          }
          setIsMetamaskInstalled(true);
          setIsConnected(true);
          setIsOnRightChain(true);
        }
      })();
    }
  }, [status, chainId]);

  return {
    isMetamaskInstalled,
    isOnRightChain,
    isConnected,
  };
};
export default useCheckConnection;
