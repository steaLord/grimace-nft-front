"use client";

import "./globals.css";
import { Inter } from "next/font/google";
import RootStyleRegistry from "@/app/emotion";
import Header from "@/components/Header";
import { MetaMaskProvider } from "metamask-react";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <MetaMaskProvider>
          <RootStyleRegistry>
            <Header />
            {children}
          </RootStyleRegistry>
        </MetaMaskProvider>
      </body>
    </html>
  );
}
