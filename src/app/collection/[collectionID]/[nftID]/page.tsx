"use client";
import { useParams } from "next/navigation";
import NFTDetails from "@/components/NFTDetails";
import Container from "@/components/Container";
import React from "react";
import { collectionPreviewItems } from "@/app/collection/page";
import styled from "@emotion/styled";

export default function NFTPage() {
  const { nftID } = useParams() as { nftID: string };

  const previewItem = collectionPreviewItems.find(
    ({ urlSlug }) => urlSlug === nftID
  );

  return (
    <StyledRoot>
      <NFTDetails
        collection={previewItem.collection}
        name={nftID}
        id="1"
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
