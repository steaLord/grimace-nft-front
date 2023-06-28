import Link from "next/link";
import styled from "@emotion/styled";
import DiscordIcon from "@/components/icons/DiscordIcon";
import TelegramIcon from "@/components/icons/TelegramIcon";
import TwitterIcon from "@/components/icons/TwitterIcon";

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
`;

const SocialsStyled = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 28px;
`;

const SocialLinkStyled = styled(Link)``;

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
          <SocialLinkStyled href="#discord"><DiscordIcon/></SocialLinkStyled>
          <SocialLinkStyled href="#telegram"><TelegramIcon/></SocialLinkStyled>
          <SocialLinkStyled href="#twitter"><TwitterIcon/></SocialLinkStyled>
        </SocialsStyled>
        <LinkStyled href="#">Whitepaper</LinkStyled>
      </LinksContainerStyled>
      <CopyrightStyled>&copy; Grimace Coin 2023</CopyrightStyled>
    </FooterStyled>
  );
}

export default Footer;
