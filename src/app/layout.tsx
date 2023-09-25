"use client";

import React, { useEffect } from "react";
import "./globals.css";
import { Fredoka } from "next/font/google";
import RootStyleRegistry from "@/app/emotion";
import styled from "@emotion/styled";
import { MetaMaskProvider } from "metamask-react";
import Footer from "@/components/Footer";
import { ToastContainer } from "react-toastify";
import { useWeb3Context, Web3Provider } from "@/app/hooks/useWeb3";
import "react-toastify/dist/ReactToastify.css";
import Header from "@/components/Header";
import { ProgressLoaderProvider } from "@/components/ProgressLoader/ProgressLoader";

const fredoka = Fredoka({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  variable: "--font-fredoka",
});

const BodyStyled = styled.body`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const MainStyled = styled.main`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  flex-grow: 1;
`;

export const useRealUser = () => {
  const { isRealUser, setIsRealUser } = useWeb3Context();
  useEffect(() => {
    if (window?.ethereum?.isImpersonator) {
      setIsRealUser(false);
    }
  }, [isRealUser]);

  return { isRealUser };
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={fredoka.variable}>
      <ProgressLoaderProvider>
        <Web3Provider>
          <BodyStyled>
            <MetaMaskProvider>
              <RootStyleRegistry>
                <Header />
                <MainStyled id="page-wrap">{children}</MainStyled>
                <Footer />
              </RootStyleRegistry>
            </MetaMaskProvider>
            <ToastContainer
              position="bottom-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              theme="dark"
            />
          </BodyStyled>
        </Web3Provider>
      </ProgressLoaderProvider>
    </html>
  );
}
