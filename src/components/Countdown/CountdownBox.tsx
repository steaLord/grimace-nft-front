import { useEffect, useRef, useState } from "react";
import { CSSTransition } from "react-transition-group";
import styled from "@emotion/styled";
import { css } from "@emotion/css";

export type CountdownBoxProps = {
  text: string
}

function CountdownBox({ text }: CountdownBoxProps) {
  const [textTop, setTextTop] = useState(text);
  const [textBottom, setTextBottom] = useState("");
  const [isSwitching, setIsSwitching] = useState<boolean>(false);
  const nodeRef = useRef(null);

  const triggerSwitch = () => setIsSwitching(!isSwitching);

  useEffect(triggerSwitch, [text]);

  const handleEnd = () => {
    setTextTop(textBottom);
    setTextBottom(text);
  };

  return (
    <CSSTransition
      classNames={{
        enter: boxStyleEnter,
        enterActive: boxStyleEnterActive,
        enterDone: boxStyleEnterDone,
        exit: boxStyleEnter,
        exitActive: boxStyleEnterActive,
        exitDone: boxStyleEnterDone,
      }}
      timeout={500}
      in={isSwitching}
      onEnter={handleEnd}
      onExit={handleEnd}
      nodeRef={nodeRef}
    >
      <Box ref={nodeRef}>
        <Char className="text-top">{textTop}</Char>
        <Char className="text-bottom">{textBottom}</Char>
      </Box>
    </CSSTransition>
  );
}

const Box = styled.div`
  width: 60px;
  height: 80px;
  font-size: 80px;
  position: relative;
  border-radius: 10px;
  background-color: var(--color-white);
  color: var(--color-dark);
  overflow: hidden;
`;

const boxStyleEnter = css`
  & .text-top {
    transform: translateY(0);
  }

  & .text-bottom {
    transform: translateY(100%);
  }
`;
const boxStyleEnterActive = css`
  & .text-top {
    transform: translateY(-100%);
    transition: transform 500ms ease-in-out;
  }

  & .text-bottom {
    transform: translateY(0);
    transition: transform 500ms ease-in-out;
  }
`;
const boxStyleEnterDone = css`
  & .text-top {
    transform: translateY(100%);
  }

  & .text-bottom {
    transform: translateY(0);
  }
`;

const Char = styled.span`
  position: absolute;
  width: 60px;
  height: 80px;
  text-align: center;
  vertical-align: middle;
  line-height: 1;
  left: 0;
  top: 0;
`;

export default CountdownBox;
