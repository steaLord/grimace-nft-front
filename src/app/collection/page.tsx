"use client";

import styled from "@emotion/styled";
import CollectionGrid from "@/components/CollectionGrid";

export default function CollectionPage() {
  return (
    <>
      <H1>Browse Collection</H1>
      <CollectionGrid>
        {Array.from({ length: 8 }).map((_, i) => (
          <PlaceholderItem key={i} />
        ))}
      </CollectionGrid>
    </>
  );
}

const H1 = styled.h1`
  font-size: 3rem;
  font-weight: 400;
  margin-bottom: 24px;
`;

// Placeholder item that fill the space of a cell
const PlaceholderItem = styled.div`
  background-color: #d9d9d9;
  border-radius: 12px;
  width: 100%;
  height: 100%;
  transition: background 150ms ease-in-out, opacity 150ms ease-in-out,
    transform 150ms ease-in-out;

  &:hover {
    cursor: pointer;
    background: var(--color-purple);
    opacity: 0.3;
    transform: scale(1.05);
  }
`;
