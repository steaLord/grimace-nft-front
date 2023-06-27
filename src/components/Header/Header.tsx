import React from "react";
import styled from "@emotion/styled";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMetaMask } from "metamask-react";
import { useConnectMetamask } from "@/app/hooks/useConnectMetamask";

export interface IHeaderProps {}

const StyledWrapper = styled.nav`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 8px 32px;
  height: 80px;
  background: #f5f5f5;
`;

export const StyledButton = styled.button`
  padding: 8px 12px;
  background: #ff6a00;
  color: #ffffff;
  font-weight: bold;
  font-size: 14px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
`;

const StyledNavLink = styled(Link)`
  //...
  color: ${({ isActive }) => (isActive ? "#000" : "#c0c0c0")};
`;

/**
 * Header
 */
function Header(props: IHeaderProps) {
  const pathname = usePathname();
  const { handleConnect } = useConnectMetamask();
  const { account } = useMetaMask();

  // TODO: Remove it from here
  const navLinks = [
    { title: "Collection", href: "/collection" },
    { title: "My NFTs", href: "/my-nfts" },
  ];
  return (
    <StyledWrapper>
      {navLinks.map(({ title, href }) => {
        const isActive = pathname.startsWith(href); // Check if the current path starts with the href
        return (
          <StyledNavLink key={href} href={href} isActive={isActive}>
            {title}
          </StyledNavLink>
        );
      })}
      {!account ? (
        <StyledButton onClick={handleConnect}>Connect MetaMask</StyledButton>
      ) : (
        <div style={{ color: "black" }}>{account.substring(0, 8)}...</div>
      )}
    </StyledWrapper>
  );
}

export default Header;
