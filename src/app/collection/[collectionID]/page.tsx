"use client";
import { useParams } from "next/navigation";
import Container from "@/components/Container";
import React from "react";
import { collectionPreviewItems } from "@/app/collection/page";
import styled from "@emotion/styled";
import CollectionGrid from "@/components/CollectionGrid/CollectionGrid";
import Link from "next/link";
import Image from "next/image";
//@ts-ignore
import nftsMetadata from "/public/NFTsMetadata.json";

export default function NFTPage() {
  const { collectionID } = useParams() as { collectionID: string };

  const previewItem = collectionPreviewItems.find(
    ({ urlSlug }) => urlSlug === collectionID
  );
  const nfts: any = Object.values(nftsMetadata).filter(
    ({ collection }: any) => collection === previewItem?.collection
  );

  return (
    // <StyledRoot>
    <>
      <title>{previewItem?.collection}</title>
      <H1>{previewItem?.collection}</H1>
      <CollectionGrid>
            {nfts.map(({ id, edition }, i:number) => (
              <div style={{ position: "relative" }} key={i}>
                <Link href={`/collection/${collectionID}/${id}`}>
                  <PlaceholderItem src={previewItem!.imageSrc} alt={id} />
                </Link>
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  <P>{edition}</P>
                </div>
              </div>
            ))}
      </CollectionGrid>
    </>
    // </StyledRoot>
  );
}

const StyledRoot = styled(Container)`
  padding-top: 32px;
`;
const H1 = styled.h1`
  font-size: 3rem;
  font-weight: 400;
  margin-bottom: 24px;
  padding-left: 24px;
`;
const P = styled.p`
  color: #AC6CFF;
  font-size: 32px;
  font-weight: 700;
  text-shadow:
    -2px -2px 0 #000,
    2px -2px 0 #000,
    -2px 2px 0 #000,
    2px 2px 0 #000;
`;
// Placeholder item that fill the space of a cell
const PlaceholderItem = styled(Image)`
  background-color: #d9d9d9;
  border-radius: 12px;
  width: 100%;
  height: 100%;
  transition: background 150ms ease-in-out, opacity 150ms ease-in-out,
    transform 150ms ease-in-out;
  cursor: pointer;
  opacity:0.7;
  &:hover {
    cursor: pointer;
    background: var(--color-purple);
    opacity: 0.9;
    transform: scale(1.05);
  }
`;
