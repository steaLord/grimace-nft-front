"use client";

import React from "react";
import "./globals.css";
import { Fredoka } from "next/font/google";
import RootStyleRegistry from "@/app/emotion";
import styled from "@emotion/styled";
import { MetaMaskProvider } from "metamask-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Head from "next/head";
import { ToastContainer } from "react-toastify";
import { Web3Provider } from "@/app/hooks/useWeb3";

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={fredoka.variable}>
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
            position="top-center"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
          />
        </BodyStyled>
      </Web3Provider>
    </html>
  );
}
