import React from "react";
import Link from "next/link";
import styled from "@emotion/styled";
import { css } from "@emotion/css";
import classNames from "classnames";
import { usePathname } from "next/navigation";
import { useMetaMask } from "metamask-react";
import { useConnectMetamask } from "@/app/hooks/useConnectMetamask";


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

const navLinkStyle = css`
  color: #c0c0c0;
`;

const navLinkActiveStyle = css`
  color: #000;
`;

export type NavLinkProps = React.ComponentProps<typeof Link>

function NavLink(props: NavLinkProps) {
  const {
    className,
    href,
    ...rest
  } = props;
  const pathname = usePathname();
  const isActive = pathname?.startsWith(href.toString()) ?? false;

  return (
    <Link
      {...rest}
      className={classNames(className, navLinkStyle, {
        [navLinkActiveStyle]: isActive,
      })}
      href={href}
    />
  );
}

/**
 * Header
 */
function Header() {
  const { handleConnect } = useConnectMetamask();
  const { account } = useMetaMask();

  return (
    <StyledWrapper>
      <NavLink href="/collection">Collection</NavLink>
      <NavLink href="/my-nfts">My NFTs</NavLink>
      {!account ? (
        <StyledButton onClick={handleConnect}>Connect MetaMask</StyledButton>
      ) : (
        <div style={{ color: "black" }}>{account.substring(0, 8)}...</div>
      )}
    </StyledWrapper>
  );
}

export default Header;
