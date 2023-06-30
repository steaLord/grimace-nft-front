import React from "react";
import styled from "@emotion/styled";
import Image from "next/image";
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
        src={imageSrc}
        alt={typeof name === "string" ? name : "NFT"}
        width={500}
        height={500}
      />
      <Content>
        <Name>{name}</Name>
        <Subheading>{subheading}</Subheading>
        <Description>{description}</Description>
        <Buttons>
          <Button href={buyHref} buttonType="filled">Buy</Button>
          <Button href={buyGrimaceHref} buttonType="outlined">Buy Grimace</Button>
        </Buttons>
      </Content>
    </Root>
  );
}

const Root = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 80px;
`;

const NFTImage = styled(Image)`
  flex-basis: 50%;
  height: auto;
  max-width: 50%;
  object-fit: cover;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  text-align: right;
  flex-basis: 50%;
`;

const Name = styled.h1`
  font-size: 3rem;
  font-weight: 400;
  margin-bottom: 24px;
`;

const Subheading = styled.h3`
  font-size: 1.5rem;
  font-weight: 400;
  margin-bottom: 36px;
`;

const Description = styled.p`
  font-size: 1rem;
  font-weight: 400;
`;

const Buttons = styled.div`
  gap: 24px;
  margin-top: 36px;
  display: flex;
  justify-content: flex-end;
`;

export default NFTDetails;
