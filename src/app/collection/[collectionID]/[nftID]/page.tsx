"use client";
import { useParams } from "next/navigation";
import NFTDetails from "@/components/NFTDetails";
import Container from "@/components/Container";
import React from "react";
import nftsMetadata from "/public/NFTsMetadata.json";
import styled from "@emotion/styled";

export default function NFTPage() {
  const { nftID } = useParams() as { nftID: string };

  const previewItem = nftsMetadata?.[nftID];
  return (
    <StyledRoot>
      <NFTDetails
        collection={previewItem.collection}
        id={nftID}
        description={previewItem.description}
        buyHref={"#"}
        buyGrimaceHref={"https://coinmarketcap.com/currencies/grimace-top/"}
        imageSrc={previewItem.imageSrc}
      />
    </StyledRoot>
  );
}

const StyledRoot = styled(Container)`
  padding-top: 32px;
`;
