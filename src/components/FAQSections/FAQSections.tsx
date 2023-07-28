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

const questionaire = [
  {
    question: "What is the maximum number of members allowed in a team?",
    answer:
      "Minimum of 3 members and maximum of 4 members are allowed in a team",
  },
  {
    question: "How long is the hackathon going to last?",
    answer: "The hackathon will be a 36 hour long hackathon",
  },
  {
    question: "What are the perks every participants is going to get?",
    answer:
      "Participants will get official HackOverflow swags and goodies such as t-shirts and stickers",
  },
  {
    question: "What is the transport facilities for the out-of state students",
    answer:
      "For out of state students, bus facility will be provided from Pillais Panvel campus and personal pickups from railway-station/airport will also be facilitated",
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
              {questionaire.map((faq, index) => {
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
            {questionaire.map((faq, index) => {
              if (activeQuestion === index) {
                return (
                  <>
                    <div className={answerBox}>
                      {active && <p>{faq.answer}</p>}
                    </div>
                  </>
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
