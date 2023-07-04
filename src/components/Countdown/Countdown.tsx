import { HTMLAttributes } from "react";
import styled from "@emotion/styled";
import CountdownBox from "@/components/Countdown/CountdownBox";


export type CountdownProps = HTMLAttributes<HTMLDivElement> & {
  num1: number;
  num2: number;
  num3: number;
}

function Countdown({ num1, num2, num3, ...rest }: CountdownProps) {
  return (
    <Root {...rest}>
      <CountdownBox text={(Math.floor(num1 / 10) % 10).toString()}/>
      <CountdownBox text={(num1 % 10).toString()}/>
      <Separator>:</Separator>
      <CountdownBox text={(Math.floor(num2 / 10) % 10).toString()}/>
      <CountdownBox text={(num2 % 10).toString()}/>
      <Separator>:</Separator>
      <CountdownBox text={(Math.floor(num3 / 10) % 10).toString()}/>
      <CountdownBox text={(num3 % 10).toString()}/>
    </Root>
  );
}

const Root = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  user-select: none;

  @media (max-width: 768px) {
    gap: 4px;
  }
`;

const Separator = styled.span`
  font-size: 80px;
  line-height: 1;
  transform: translateY(-13%); // Font line height fix

  @media (max-width: 768px) {
    font-size: 60px;
  }
`;

export default Countdown;
