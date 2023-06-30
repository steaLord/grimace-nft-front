import React, { useEffect, useRef, useState } from "react";
import styled from "@emotion/styled";

interface ZoomableCanvasProps {
  width: number;
  height: number;
  nftName: string;
}

const StyledRoot = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  overscroll-behavior: contain;
`;

const StyledCanvas = styled.canvas`
  width: 100%;
  height: 100%;
  max-width: ${({ width }) => width + "px"};
  max-height: ${({ height }) => height + "px"};
  border-radius: 16px;
  background: #a9a9a9;
  box-shadow: 0px 0px 30px rgba(0, 0, 0, 0.4);
  overscroll-behavior: contain;
`;

const ZoomableCanvas: React.FC<ZoomableCanvasProps> = ({
  width,
  height,
  nftName,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(
    null
  );
  const [offset, setOffset] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [scale, setScale] = useState<number>(1);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [svgString, setSvgString] = useState("");
  const [isLoadingSVG, setIsLoadingSVG] = useState(true);
  const imageRef = useRef<HTMLImageElement>();
  useEffect(() => {
    (async () => {
      setIsLoadingSVG(true);
      try {
        const res = await fetch(`/api/getSVGFile?nftName=${nftName}`);
        const svgStringResponse = await res.text();
        setSvgString(svgStringResponse);

        const image = new Image();
        const blob = new Blob([svgStringResponse], { type: "image/svg+xml" });
        const url = URL.createObjectURL(blob);
        image.onload = () => {
          URL.revokeObjectURL(url);
          imageRef.current = image;
          setIsLoadingSVG(false);
        };
        imageRef.current = image;
        image.src = url;
      } catch (e) {
        setIsLoadingSVG(false);
      }
    })();
  }, [nftName]);

  useEffect(() => {
    if (imageRef.current && !isLoadingSVG) {
      const canvas = canvasRef.current;

      if (canvas) {
        const context = canvas.getContext("2d");

        const canvasWidth = width;
        const canvasHeight = height;

        canvas.width = canvasWidth;
        canvas.height = canvasHeight;

        context?.clearRect(0, 0, canvasWidth, canvasHeight);
        console.log("Image Draw");
        context?.drawImage(
          imageRef.current,
          offset.x,
          offset.y,
          canvasWidth * scale,
          canvasHeight * scale
        );
      }
    }
  }, [width, height, imageRef, svgString, offset, scale, isLoadingSVG]);

  const handleWheel = (event: React.WheelEvent<HTMLCanvasElement>) => {
    event.stopPropagation();
    event.preventDefault();

    const canvas = canvasRef.current;
    const { clientX, clientY } = event;

    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      const offsetX = clientX - rect.left;
      const offsetY = clientY - rect.top;

      const scaleFactor = event.deltaY > 0 ? 0.9 : 1.1;
      const newScale = scale * scaleFactor;

      const newOffsetX = offsetX - (offsetX - offset.x) * scaleFactor;
      const newOffsetY = offsetY - (offsetY - offset.y) * scaleFactor;

      setScale(newScale);
      setOffset({ x: newOffsetX, y: newOffsetY });
    }
  };

  const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    event.preventDefault();

    const canvas = canvasRef.current;

    if (canvas) {
      setDragStart({ x: event.clientX, y: event.clientY });
      setIsDragging(true);
      canvas.style.cursor = "grabbing";
    }
  };

  const handleMouseUp = () => {
    setDragStart(null);
    setIsDragging(false);
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.style.cursor = "grab";
    }
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (dragStart && isDragging) {
      const offsetX = event.clientX - dragStart.x;
      const offsetY = event.clientY - dragStart.y;

      const newOffsetX = offset.x + offsetX;
      const newOffsetY = offset.y + offsetY;

      setOffset({ x: newOffsetX, y: newOffsetY });
      setDragStart({ x: event.clientX, y: event.clientY });
    }
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      setDragStart(null);
      setIsDragging(false);
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.style.cursor = "grab";
      }
    }
  };

  const handleMouseEnter = () => {
    if (!isDragging) {
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.style.cursor = "grab";
      }
    }
  };

  const handleScroll = (event: WheelEvent) => {
    event.stopPropagation();
    event.preventDefault();
  };
  useEffect(() => {
    const canvas = canvasRef.current;

    if (canvas) {
      canvas.addEventListener("scroll", handleScroll, { passive: false });
      return () => {
        canvas.removeEventListener("scroll", handleScroll);
      };
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (canvas) {
      const transitionEndHandler = () => {
        canvas.style.transition = "";
        canvas.removeEventListener("transitionend", transitionEndHandler);
      };

      canvas.addEventListener("transitionend", transitionEndHandler);
    }
  }, []);

  if (isLoadingSVG) {
    return <div>Loading...</div>;
  }
  return (
    <StyledRoot>
      <StyledCanvas
        ref={canvasRef}
        width={width}
        height={height}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={handleMouseEnter}
      />
    </StyledRoot>
  );
};

export default ZoomableCanvas;
