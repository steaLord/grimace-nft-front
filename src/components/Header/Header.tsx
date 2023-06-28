import React from "react";
import Link from "next/link";
import styled from "@emotion/styled";
import { css } from "@emotion/css";
import classNames from "classnames";
import { usePathname } from "next/navigation";
import { useMetaMask } from "metamask-react";
import { useConnectMetamask } from "@/app/hooks/useConnectMetamask";
import Container from "@/components/Container";


const Root = styled.header`
  display: flex;
  justify-content: center;
  padding: 54px 0;
`;

const Wrapper = styled(Container)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const OutlinedButton = styled.button`
  font-size: 1.5rem;
  border: 3px solid var(--color-orange);
  background-color: rgba(0, 0, 0, 0%);
  color: var(--color-white);
  font-family: var(--font-family);
  border-radius: 100px;
  padding: 8px 12px;
  transition-timing-function: ease;
  transition-duration: 150ms;
  transition-property: background-color, color;

  &:hover {
    color: var(--color-dark);
    background-color: var(--color-orange);
    cursor: pointer;
  }
`;

const ItemsLeft = styled.div``;
const ItemsRight = styled.div`
  display: flex;
  align-items: center;
  gap: 36px;
`;

const navLinkStyle = css`
  font-size: 1.5rem;
`;

const navLinkActiveStyle = css``;

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

const LogoLink = styled(Link)`
  font-weight: 300;
  font-size: 2.5rem;

  & b {
    font-weight: 700;
  }
`;

function Logo() {
  return (
    <LogoLink href="/"><b>Grimace NFT</b> View</LogoLink>
  );
}

/**
 * Header
 */
function Header() {
  const { handleConnect } = useConnectMetamask();
  const { account } = useMetaMask();

  return (
    <Root>
      <Wrapper>
        <ItemsLeft><Logo/></ItemsLeft>
        <ItemsRight>
          <NavLink href="/my-nfts">My NFTs</NavLink>
          <NavLink href="/collection">Collection</NavLink>
          {!account ? (
            <OutlinedButton onClick={handleConnect}>Connect MetaMask</OutlinedButton>
          ) : (
            <div style={{ color: "black" }}>{account.substring(0, 8)}...</div>
          )}
        </ItemsRight>
      </Wrapper>
    </Root>
  );
}

export default Header;
