import { useMetaMask } from "metamask-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const useCheckConnection = () => {
  const { status, chainId, switchChain } = useMetaMask();
  const [wrongChain, setWrongChain] = useState(false);
  const [ok, setOk] = useState(true);
  const targetChainId = "0x238";
  //testnet chainid
  useEffect(() => {
    if (status !== "initializing") {
      (() => {
        //@ts-ignore
        if (status === "unavailable") {
          // MetaMask is not installed
          setOk(false);
          toast.info("Please install MetaMask");
        } else if (status === "notConnected") {
          // User is not connected to MetaMask
          setOk(false);
          toast.info("Please connect to MetaMask");
        } else if (chainId !== targetChainId) {
          // User is connected to MetaMask but not on the right chain
          setWrongChain(true);
          setOk(false);
          toast.info("Please connect to the DogeChain");
          switchChain(targetChainId);
        } else {
          // User is connected to MetaMask and on the right chain
          if (wrongChain) {
            setOk(true);
            setWrongChain(false);
            toast.success("You're all set!");
          }
        }
      })();
    }
  }, [status, chainId]);

  return {
    ok,
  };
};
export default useCheckConnection;
