import Link from "next/link";
import { css } from "@emotion/css";
import styled from "@emotion/styled";
import DiscordIcon from "@/components/icons/DiscordIcon";
import TelegramIcon from "@/components/icons/TelegramIcon";
import TwitterIcon from "@/components/icons/TwitterIcon";

const socialIconStyles = css`
  width: 36px;
  height: 36px;
`;

const FooterStyled = styled.footer`
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: var(--color-text);
  gap: 20px;
  margin: 36px 0;
`;

const LinksContainerStyled = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 28px;
`;

const LinkStyled = styled(Link)`
  text-transform: uppercase;
  font-weight: 300;
  font-size: 1.5rem;
  color: var(--color-text);
  transition-timing-function: ease;
  transition-duration: 150ms;
  transition-property: color;

  &:hover {
    color: var(--color-accent);
  }
`;

const SocialsStyled = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 28px;
`;

const SocialLinkStyled = styled(Link)`
  fill: var(--color-text);
  transition-timing-function: ease;
  transition-duration: 150ms;
  transition-property: fill;

  &:hover {
    fill: var(--color-accent);
  }
`;

const CopyrightStyled = styled.span`
  font-size: 1.25rem;
  text-align: center;
`;

function Footer() {
  return (
    <FooterStyled>
      <LinksContainerStyled>
        <LinkStyled href="/">Homepage</LinkStyled>
        <SocialsStyled>
          <SocialLinkStyled
            href="https://discord.com/invite/grimacedoge"
            target="_blank"
          >
            <DiscordIcon className={socialIconStyles}/>
          </SocialLinkStyled>
          <SocialLinkStyled
            href="https://t.me/grimacecommunity"
            target="_blank"
          >
            <TelegramIcon className={socialIconStyles}/>
          </SocialLinkStyled>
          <SocialLinkStyled
            href="https://twitter.com/Grimacedogchain"
            target="_blank"
          >
            <TwitterIcon className={socialIconStyles}/>
          </SocialLinkStyled>
        </SocialsStyled>
        <LinkStyled href="https://whitepaper.grimacedoge.com/">Whitepaper</LinkStyled>
      </LinksContainerStyled>
      <CopyrightStyled>&copy; Grimace Coin 2023</CopyrightStyled>
    </FooterStyled>
  );
}

export default Footer;
