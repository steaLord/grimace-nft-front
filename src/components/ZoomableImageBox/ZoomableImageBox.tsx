"use client";

import React, { useEffect, useRef, useState } from "react";
import styled from "@emotion/styled";
import { UncontrolledReactSVGPanZoom } from "react-svg-pan-zoom";
import panzoom from "panzoom";

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

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/getSVGFile");
      const svgData = await res.text();
      setSvg(svgData);
    })();
  }, []);

  useEffect(() => {
    if (svg && svgRef.current) {
      // set the innerHTML of the svg container to the fetched SVG text
      svgRef.current.innerHTML = svg;
      svgRef.current.firstChild.style.height = "100%";
      svgRef.current.firstChild.style.width = "100%";
      // apply panzoom
      const instance = panzoom(svgRef.current.firstChild, {
        maxZoom: 9999999,
        minZoom: 0.1,
      });
      instance.zoomAbs(0, 0, 1); // zoom to 100% at (0, 0)
    }
  }, [svg]);

  const svgRef = useRef();
  return (
    <div style={{ width: 500, height: 500, overflow: "hidden" }} ref={svgRef} />
  );
};

export default ZoomableCanvas;
