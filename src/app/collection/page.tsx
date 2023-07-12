"use client";

import styled from "@emotion/styled";
import CollectionGrid from "@/components/CollectionGrid";
import React from "react";
import nft1 from "../../../public/eternal-supreme-ultradegen.jpg";
import nft2 from "../../../public/vip-degen-highest-caste.jpg";
import nft3 from "../../../public/revered-guardian-of-the-odyssey.jpg";
import nft4 from "../../../public/believer-diamond-degen.jpg";
import nft5 from "../../../public/golden-degen-dick.jpg";
import nft6 from "../../../public/silver-soldier-of-the-odyssey.jpg";
import Image from "next/image";
import Link from "next/link";

export const collectionPreviewImages = [
  { src: nft1, urlSlug: "eternal-supreme-ultradegen" },
  { src: nft2, urlSlug: "vip-degen-highest-caste" },
  { src: nft3, urlSlug: "revered-guardian-of-the-odyssey" },
  { src: nft4, urlSlug: "believer-diamond-degen" },
  { src: nft5, urlSlug: "golden-degen-dick" },
  { src: nft6, urlSlug: "silver-soldier-of-the-odyssey" },
];

export default function CollectionPage() {
  return (
    <>
      <title>Collection</title>
      <H1>Browse Collection</H1>
      <CollectionGrid>
        {collectionPreviewImages.map(({ src, urlSlug }, i) => (
          <Link href={`/collection/${urlSlug}`} key={urlSlug}>
            <PlaceholderItem src={src} key={i} />
          </Link>
        ))}
      </CollectionGrid>
    </>
  );
}

const H1 = styled.h1`
  font-size: 3rem;
  font-weight: 400;
  margin-bottom: 24px;
  padding-left: 24px;
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

  &:hover {
    cursor: pointer;
    background: var(--color-purple);
    opacity: 0.9;
    transform: scale(1.05);
  }
`;
