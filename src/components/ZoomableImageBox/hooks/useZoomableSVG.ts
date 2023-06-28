import { useEffect, useState } from "react";
import ResizeObserver from "resize-observer-polyfill";
import * as d3 from "d3";

export default function useZoomableSVG(ref) {
  const [dimensions, setDimensions] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    const observeTarget = ref.current;
    const resizeObserver = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        setDimensions(entry.contentRect);
      });
    });
    resizeObserver.observe(observeTarget);
    return () => resizeObserver.unobserve(observeTarget);
  }, [ref]);

  useEffect(() => {
    const svg = d3.select(ref.current);
    const g = svg.select("g");

    svg.call(
      d3
        .zoom()
        .extent([
          [0, 0],
          [dimensions.width, dimensions.height],
        ])
        .scaleExtent([0.5, 8])
        .on("zoom", zoomed)
    );

    svg.attr("width", dimensions.width).attr("height", dimensions.height);

    function zoomed() {
      g.attr("transform", d3.event.transform);
    }
  }, [dimensions]);

  return dimensions;
}
