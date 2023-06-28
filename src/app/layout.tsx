"use client";

import React from "react";
import "./globals.css";
import { Fredoka } from "next/font/google";
import RootStyleRegistry from "@/app/emotion";
import styled from "@emotion/styled";
import { MetaMaskProvider } from "metamask-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const fredoka = Fredoka({
  subsets: ["latin"],
  weight: ["400", "300"],
});

const BodyStyled = styled.body`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const MainStyled = styled.main`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 6rem;
  flex-grow: 1;
`;


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
    <BodyStyled className={fredoka.className}>
      <MetaMaskProvider>
        <RootStyleRegistry>
          <Header/>
          <MainStyled>
            {children}
          </MainStyled>
          <Footer/>
        </RootStyleRegistry>
      </MetaMaskProvider>
    </BodyStyled>
    </html>
  );
}
