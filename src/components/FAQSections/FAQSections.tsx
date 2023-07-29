"use client";

import { MouseEvent, useState } from "react";
import {
  answerBox,
  faqBox,
  FAQButtonWrapper,
  questionBox,
  questionBoxElongate,
  wrapper,
} from "./FAQSections.module.scss";
import Link from "next/link";

const nftMarketplaceFAQ = [
  {
    question: "How to make bids?",
    Answer:
      "To make a bid, you need to have a connected wallet with sufficient funds. Navigate to the NFT you want to bid on, allow our contract to use your GRIMACE coin balance (enter amount you allow our smart contract to spend on your behalf), and confirm the transaction through your wallet provider. If your bid becomes the highest, you'll be in the running to purchase the NFT.",
  },
  {
    question: "What does this collection represent?",
    Answer:
      "This collection represents a curated set of unique digital assets known as Non-Fungible Tokens (NFTs). Each NFT in the collection is one-of-a-kind and holds distinct value and ownership, often associated with art, music, videos, virtual real estate, and more.",
  },
  {
    question: "How to view purchased NFTs?",
    Answer: (
      <div>
        Once you won the auction, you can navigate to{" "}
        <Link style={{ color: "var(--color-purple)", textDecoration: "underline" }} href="/my-nfts">
          /my-nfts
        </Link>{" "}
        page and view NFT through our viewer that will allow you to explore NFT
      </div>
    ),
  },
];

const FAQSections = ({}) => {
  const [isOpen, setIsOpen] = useState(false);
  const handleOpenSection = () => {
    setIsOpen(true);
  };
  const handleCloseSection = (e: MouseEvent) => {
    e.stopPropagation();
    setIsOpen(false);
  };

  const [activeQuestion, setActiveQuestion] = useState(0);
  const [active, setActive] = useState(true);

  return (
    <>
      <div className={FAQButtonWrapper} onClick={handleOpenSection}>
        FAQ Section
      </div>
      {isOpen && (
        <div className={wrapper} onClick={handleCloseSection}>
          <div className={faqBox}>
            <div>
              {nftMarketplaceFAQ.map((faq, index) => {
                return (
                  <>
                    <div
                      key={index}
                      className={
                        activeQuestion === index && active
                          ? `${questionBoxElongate}`
                          : `${questionBox}`
                      }
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveQuestion(index);
                        setActive(true);
                      }}
                    >
                      <p>{faq.question}</p>
                    </div>
                  </>
                );
              })}
            </div>
            {nftMarketplaceFAQ.map((faq, index) => {
              if (activeQuestion === index) {
                return (
                  <>{active && <div className={answerBox}>{faq.Answer}</div>}</>
                );
              }
              return "";
            })}
          </div>
        </div>
      )}
    </>
  );
};

export default FAQSections;
