import React from "react";
import styled from "@emotion/styled";

const BidsHistory = ({ bids }) => {
  function formatUnixTime(unixTime: number): string {
    const date = new Date(unixTime * 1000); // Convert Unix timestamp to milliseconds
    const day = date.getUTCDate().toString().padStart(2, "0"); // Extract day and pad with leading zero if necessary
    const month = (date.getUTCMonth() + 1).toString().padStart(2, "0"); // Extract month and pad with leading zero if necessary
    const year = date.getUTCFullYear().toString(); // Extract year
    const hour = date.getUTCHours().toString().padStart(2, "0"); // Extract hour and pad with leading zero if necessary
    const minute = date.getUTCMinutes().toString().padStart(2, "0"); // Extract minute and pad with leading zero if necessary
    const second = date.getUTCSeconds().toString().padStart(2, "0"); // Extract second and pad with leading zero if necessary
    const formattedTime = `${day}.${month}.${year} ${hour}:${minute}:${second}`; // Combine extracted values into desired format
    return formattedTime;
  }

  return (
    <Container>
      <div>
        <h2 style={{ fontWeight: "400" }}>Bid History</h2>
        <Table>
          <thead>
            <tr>
              <th>№</th>
              <th></th>
              <th>BID AMOUNT</th>
              <th>Address</th>
            </tr>
          </thead>
          <tbody>
            {bids.map((bid) => (
              <tr key={bid.id}>
                <td>
                  <b>{bid.id}</b>
                </td>
                <td>{formatUnixTime(bid.time)}</td>
                <td>{bid.amount} GRIMACE</td>
                <td>
                  {bid.address.slice(0, 6) + "....." + bid.address.slice(-5)}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <Footer></Footer>
      </div>
    </Container>
  );
};

export default BidsHistory;

const Footer = styled.div`
  width: 100%;
  height: 40px;
  display: flex;
  justify-content: space-between;
  background-color: #eee;
`;
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin: 0 auto;
  padding-top: 35px;
`;
const Table = styled.table`
  margin: 0 auto;
  border-collapse: collapse;
  gap: 20px;
  th {
    color: #59575c;
  }
  th,
  td {
    border-bottom: 1px solid #333333;
    padding: 8px;
  }
`;
