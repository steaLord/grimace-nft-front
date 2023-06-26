import React from 'react'
import styled from "@emotion/styled";
import {Button} from "@chakra-ui/react";

export interface IHeaderProps {

}

const StyledWrapper = styled.nav`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 8px 32px;
  height: 80px;
  background: #F5F5F5;
`

const StyledButton = styled.button`
  padding: 8px 12px;
  background: #ff6a00;
  color: #ffffff;
  font-weight: bold;
  font-size: 14px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
`

/**
 * Header
 */
function Header(props: IHeaderProps) {
  const { } = props
  return (
    <StyledWrapper>
      <StyledButton variant="ghost">Connect MetaMask</StyledButton>
    </StyledWrapper>
  )
}

export default Header
