import { HTMLAttributes } from "react";
import styled from "@emotion/styled";
import CountdownBox from "@/components/Countdown/CountdownBox";

export type CountdownProps = HTMLAttributes<HTMLDivElement> & {
  num1: number;
  num2: number;
  num3: number;
};

const CountdownBoxRoot = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const CountdownTimeWrapper = styled.div`
  display: flex;
  div:first-child {
    margin-right: 8px;
  }
`;

const CountDownBoxWrapper = ({ text1, text2, label }) => {
  return (
    <CountdownBoxRoot>
      <CountdownTimeWrapper>
        <CountdownBox text={text1} />
        <CountdownBox text={text2} />
      </CountdownTimeWrapper>
      <div>{label}</div>
    </CountdownBoxRoot>
  );
};

function Countdown({ num1, num2, num3, ...rest }: CountdownProps) {
  return (
    <Root {...rest}>
      <CountDownBoxWrapper
        text2={(num1 % 10).toString()}
        text1={(Math.floor(num1 / 10) % 10).toString()}
        label="Days"
      />
      <Separator>:</Separator>
      <CountDownBoxWrapper
        text2={(num2 % 10).toString()}
        text1={(Math.floor(num2 / 10) % 10).toString()}
        label="Hours"
      />
      <Separator>:</Separator>
      <CountDownBoxWrapper
        text2={(num3 % 10).toString()}
        text1={(Math.floor(num3 / 10) % 10).toString()}
        label="Minutes"
      />
      {/*<CountdownBoxRoot>
        <CountdownTimeWrapper>
          <CountdownBox text={(Math.floor(num1 / 10) % 10).toString()} />
          <CountdownBox text={(num1 % 10).toString()} />
        </CountdownTimeWrapper>
        <div>Days</div>
      </CountdownBoxRoot>*/}
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
  transform: translateY(-25%); // Font line height fix

  @media (max-width: 768px) {
    font-size: 60px;
  }
`;

export default Countdown;
