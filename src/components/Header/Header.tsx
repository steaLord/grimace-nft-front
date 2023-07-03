import React from "react";
import Link from "next/link";
import styled from "@emotion/styled";
import { css } from "@emotion/css";
import classNames from "classnames";
import { usePathname } from "next/navigation";
import { useMetaMask } from "metamask-react";
import { useConnectMetamask } from "@/app/hooks/useConnectMetamask";
import Container from "@/components/Container";
import metamaskLogoIcon from "../../../public/matamask_logo.png";
import Image from "next/image";

const Root = styled.header`
  display: flex;
  justify-content: center;
  padding: 48px 0;
`;

const Wrapper = styled(Container)`
  display: flex;
  align-items: flex-end;
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

const AccountAddressWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  //margin-top: 6px;
  color: rgb(255, 255, 255);
  font-size: 1rem;
  img {
    margin-right: 4px
  }
`;

const ItemsLeft = styled.div`
`;
const ItemsRight = styled.div`
  display: flex;
  align-items: center;
  gap: 36px;
  margin-bottom: 4px;
`;

const navLinkStyle = css`
  font-size: 1.5rem;
`;

const navLinkActiveStyle = css``;

export type NavLinkProps = React.ComponentProps<typeof Link>;

function NavLink(props: NavLinkProps) {
  const { className, href, ...rest } = props;
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
    <LogoLink href="/">
      <b>Grimace NFT</b> View
    </LogoLink>
  );
}

const ConnectMetamaskWrapper = ({
  account,
  handleConnect,
}: {
  account: string;
  handleConnect: () => Promise<void>;
}) => {
  if (account) {
    return (
      <AccountAddressWrapper>
        <Image
          width={30}
          height={30}
          src={metamaskLogoIcon}
          alt="metamask logo"
        />
        <p>{account.substring(0, 8)}...</p>
      </AccountAddressWrapper>
    );
  }
  return (
    <OutlinedButton onClick={handleConnect}>Connect MetaMask</OutlinedButton>
  );
};

/**
 * Header
 */
function Header() {
  const { handleConnect } = useConnectMetamask();
  const { account } = useMetaMask();

  return (
    <Root>
      <Wrapper>
        <ItemsLeft>
          <Logo />
        </ItemsLeft>
        <ItemsRight>
          <NavLink href="/my-nfts">My NFTs</NavLink>
          <NavLink href="/collection">Collection</NavLink>
          <ConnectMetamaskWrapper
            account={account}
            handleConnect={handleConnect}
          />
        </ItemsRight>
      </Wrapper>
    </Root>
  );
}

export default Header;
