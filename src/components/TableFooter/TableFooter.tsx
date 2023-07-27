import React, { useEffect } from "react";

import styles from "./TableFooter.module.css";
import styled from "@emotion/styled";

const TableFooter = ({
  range,
  setPage,
  page,
  slice,
}: {
  range: number[];
  setPage: React.Dispatch<React.SetStateAction<number>>;
  page: number;
  slice: any[];
}) => {
  useEffect(() => {
    if (slice.length < 1 && page !== 1) {
      setPage(page - 1);
    }
  }, [slice, page, setPage]);
  return (
    <Container>
      {range != null && range[0] != null && (
        <Button disabled={page === 1} onClick={() => setPage(1)}>
          {1}
        </Button>
      )}
      {range.slice(1, -1).map((num, index) => {
        if (
          range.slice(1, -1).length !== 5 &&
          (page - num > 2 || page - num < -2)
        ) {
          return null;
        }
        return (
          <Button
            key={index}
            disabled={page === num}
            onClick={() => setPage(num)}
          >
            {num}
          </Button>
        );
      })}

      {range != null && range[range.length - 1] != null && (
        <Button
          disabled={page === range[range.length - 1]}
          onClick={() => setPage(range[range.length - 1])}
        >
          {range[range.length - 1]}
        </Button>
      )}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 3px;
  align-items: center;
`;
const Button = styled.button`
  font-size: 18px;
  padding: 2px 6px;
  width: 30px;
  color: #ffffff;
  background-color: #1a1a1a;
  border-radius: 4px;
  outline: none;
  border: 1px solid #ffffff;
  &:disabled {
    border: 1px solid #1a1a1a;
    background-color: #ffffff;
    color: #59575c;
  }
`;

export default React.memo(TableFooter);
