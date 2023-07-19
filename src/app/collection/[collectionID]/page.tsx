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
      collection with 11 items
    </StyledRoot>
  );
}

const StyledRoot = styled(Container)`
  padding-top: 32px;
`;
