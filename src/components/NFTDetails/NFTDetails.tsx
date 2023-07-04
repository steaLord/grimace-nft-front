import React from "react";
import styled from "@emotion/styled";
import Button from "@/components/Button";

export type NFTDetailsProps = {
  name: React.ReactNode;
  subheading: React.ReactNode;
  description: React.ReactNode;
  buyHref: string;
  buyGrimaceHref: string;
  imageSrc: string;
}


function NFTDetails({
  name,
  subheading,
  description,
  buyHref,
  buyGrimaceHref,
  imageSrc,
}: NFTDetailsProps) {
  return (
    <Root>
      <NFTImage
        // src={imageSrc}
        src={"https://placehold.co/800x800"}
        alt={typeof name === "string" ? name : "NFT"}
        width={500}
        height={500}
      />
      <Name>{name}</Name>
      <Subheading>{subheading}</Subheading>
      <Description>{description}</Description>
      <Buttons>
        <Button href={buyHref} buttonType="filled">Buy</Button>
        <Button href={buyGrimaceHref} buttonType="outlined">Buy Grimace</Button>
      </Buttons>
    </Root>
  );
}

const Root = styled.div`
  display: grid;
  width: 100%;

  grid-template-columns:  auto 48px 50%;
  grid-template-rows: auto auto auto auto auto;

  @media (max-width: 992px) {
    grid-template-columns: 24px 1fr 24px;
    grid-template-rows: auto auto auto auto auto;
    max-width: 500px;
  }
`;

const NFTImage = styled.img`
  height: auto;
  object-fit: cover;
  max-width: min(500px, 100%);
  max-height: max(400px, 80vh);

  grid-column: 1 / 2;
  grid-row: 1 / 6;

  @media (max-width: 992px) {
    margin: auto;
    grid-column: 2 / 3;
    grid-row: 3 / 4;
  }
`;

const Name = styled.h1`
  font-size: 3rem;
  font-weight: 400;

  grid-column: 3 / 4;
  grid-row: 1 / 2;

  @media (max-width: 992px) {
    grid-column: 2 / 3;
    grid-row: 1 / 2;
  }
`;

const Subheading = styled.h3`
  font-size: 1.5rem;
  font-weight: 400;

  margin-bottom: 24px;

  grid-column: 3 / 4;
  grid-row: 2 / 3;

  @media (max-width: 992px) {
    grid-column: 2 / 3;
    grid-row: 2 / 3;
    margin-bottom: 16px;
  }
`;

const Description = styled.p`
  font-size: 1rem;
  font-weight: 400;

  grid-column: 3 / 4;
  grid-row: 3 / 4;

  @media (max-width: 992px) {
    grid-column: 2 / 3;
    grid-row: 5 / 6;
  }
`;

const Buttons = styled.div`
  gap: 24px;
  display: flex;
  justify-content: flex-end;

  margin-top: 24px;

  grid-column: 3 / 4;
  grid-row: 4 / 5;

  align-self: end;

  @media (max-width: 992px) {
    justify-content: space-between;
    gap: 16px;
    grid-column: 2 / 3;
    grid-row: 4 / 5;
    margin: 16px 0;
  }

  & > * {
    width: 100%;
  }
`;

export default NFTDetails;
