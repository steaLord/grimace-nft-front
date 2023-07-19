import React from "react";
import styled from "@emotion/styled";
import Button from "@/components/Button";
import Image from "next/image";
import { useRemainingTime } from "@/app/page";

export type NFTDetailsProps = {
  id: string;
  collection: string;
  name: React.ReactNode;
  subheading: React.ReactNode;
  description: React.ReactNode;
  buyHref: string;
  buyGrimaceHref: string;
  imageSrc: string;
};

function NFTDetails({
  name,
  collection,
  id,
  description,
  buyHref,
  buyGrimaceHref,
  imageSrc,
}: NFTDetailsProps) {
  const { isReleased } = useRemainingTime(process.env["TIMER_END_ISO_DATE"]);
  return (
    <Root>
      <NFTImage
        src={imageSrc}
        alt={typeof name === "string" ? name : "NFT"}
        width={500}
        height={500}
      />
      <Content>
        <Name>
          {collection} {id}
        </Name>
        <Subheading>Auction started</Subheading>
        <Description
          dangerouslySetInnerHTML={{ __html: description }}
        ></Description>
        <Buttons>
          <Button
            href={buyHref}
            buttonType="filled"
            // isDisabled={!isReleased}
            isDisabled={false}
            title={
              !isReleased ? "Wait until release" : "Link to NFT Marketplace"
            }
          >
            Place Bid
          </Button>
          <Button
            href={buyGrimaceHref}
            buttonType="outlined"
            isDisabled={!isReleased}
            target={"__blank"}
            title={!isReleased ? "Wait until release" : "Link to Exchange"}
          >
            Buy Grimace
          </Button>
        </Buttons>
      </Content>
    </Root>
  );
}

const Root = styled.div`
  display: flex;
  width: 100%;

  @media (max-width: 992px) {
    max-width: 500px;
    flex-direction: column;
  }
`;

const NFTImage = styled(Image)`
  height: auto;
  object-fit: cover;
  max-width: min(500px, 100%);
  max-height: max(400px, 80vh);
  border-radius: 24px;

  @media (max-width: 992px) {
    margin: auto;
  }
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 24px;
  flex: 1;

  @media (max-width: 992px) {
    margin-left: 0;
  }
`;

const Name = styled.h1`
  font-size: 3rem;
  font-weight: bold;
  margin-top: 0;

  @media (max-width: 992px) {
    margin-bottom: 12px;
  }
`;

const Subheading = styled.h3`
  font-size: 1.5rem;
  font-weight: 400;
  margin-bottom: 12px;
`;

const Description = styled.p`
  font-size: 0.9rem;
  font-weight: 400;
`;

const Buttons = styled.div`
  gap: 24px;
  display: flex;
  justify-content: flex-end;
  margin-top: 24px;

  @media (max-width: 992px) {
    justify-content: space-between;
    gap: 16px;
    margin: 16px 0;
  }

  & > * {
    width: 100%;
  }
`;

export default NFTDetails;
