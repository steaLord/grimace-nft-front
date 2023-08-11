import { useMetaMask } from "metamask-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const useCheckConnection = () => {
  const { status, chainId, switchChain, account } = useMetaMask();
  const [isOnRightChain, setIsOnRightChain] = useState(true);
  const [isMetamaskInstalled, setIsMetamaskInstalled] = useState(true);
  const [isConnected, setIsConnected] = useState(true);
  const chainIds = {
    'development': '0x238',
    'production': '0x7d0'
  }
  const targetChainId = chainIds[process.env.NODE_ENV];
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
          toast.info("Please connect to MetaMask");
        } else if (chainId !== targetChainId) {
          // User is connected to MetaMask but not on the right chain
          setIsMetamaskInstalled(true);
          setIsConnected(false);
          setIsOnRightChain(false);
          toast.info("Please connect to the DogeChain");
          switchChain(targetChainId);
        } else {
          // User is connected to MetaMask and on the right chain
          setIsConnected(true);
          setIsMetamaskInstalled(true);
          setIsOnRightChain(true);
        }
      })();
    }
  }, [status, chainId, account]);

  return {
    isMetamaskInstalled,
    isOnRightChain,
    isConnected,
  };
};
export default useCheckConnection;
