"use client";

import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import * as d3 from "d3";
import styled from "@emotion/styled";

interface ZoomableCanvasProps {
  width: number;
  height: number;
  imageSrc: string;
}

const StyledCanvas = styled.canvas`
  border: 1px solid #d1d1d1;
  background: rgba(151, 71, 255, 0.55);
  border-radius: 16px;
`;

const ZoomableCanvas: React.FC<ZoomableCanvasProps> = ({
  width,
  height,
  imageSrc,
}) => {
  const [svg, setSvg] = useState();
  const wrapperRef = useRef<HTMLDivElement>();

  useLayoutEffect(() => {
    console.log("Current", wrapperRef.current);
    if (wrapperRef.current && svg) {
      const divElement = wrapperRef.current;
      // divWrapper?.style.background = "#fff";
      wrapperRef.current?.appendChild(svg);
    }
  }, [wrapperRef]);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/getSVGFile");
      const svgData = await res.text();
      setSvg(svgData);
    })();
  }, []);

  return <div ref={wrapperRef} />;
};

export default ZoomableCanvas;
