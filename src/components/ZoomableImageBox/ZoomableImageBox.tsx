import React, { useEffect, useRef, useState } from "react";
import styled from "@emotion/styled";

interface ZoomableCanvasProps {
  width: number;
  height: number;
  nftName: string;
}

const StyledRoot = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledCanvas = styled.canvas`
  width: 100%;
  height: 100%;
  max-width: ${({ width }) => width + "px"};
  max-height: ${({ height }) => height + "px"};
  border-radius: 16px;
  background: #a9a9a9;
  box-shadow: 0px 0px 30px rgba(0, 0, 0, 0.4);
`;

const ZoomButtonsContainer = styled.div`
  position: absolute;
  bottom: 10px;
  right: 10px;
`;

const ZoomButton = styled.button`
  background: #ffffff;
  border: none;
  border-radius: 4px;
  width: 30px;
  height: 30px;
  margin-top: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-weight: bold;

  &:focus {
    outline: none;
  }
`;

// Easing function
const easeInOutCubic = (t) => {
  return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
};

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

  const handleZoom = (delta: number, clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      const offsetX = clientX - rect.left;
      const offsetY = clientY - rect.top;

      const scaleFactor = delta > 0 ? 0.9 : 1.1;
      const newScale = scale * scaleFactor;

      const newOffsetX = offsetX - (offsetX - offset.x) * scaleFactor;
      const newOffsetY = offsetY - (offsetY - offset.y) * scaleFactor;

      setScale(newScale);
      setOffset({ x: newOffsetX, y: newOffsetY });
    }
  };

  const handleDragStart = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (canvas) {
      setDragStart({ x: clientX, y: clientY });
      setIsDragging(true);
      canvas.style.cursor = "grabbing";
    }
  };

  const handleDragMove = (clientX: number, clientY: number) => {
    if (dragStart && isDragging) {
      const offsetX = clientX - dragStart.x;
      const offsetY = clientY - dragStart.y;

      const newOffsetX = offset.x + offsetX;
      const newOffsetY = offset.y + offsetY;

      setOffset({ x: newOffsetX, y: newOffsetY });
      setDragStart({ x: clientX, y: clientY });
    }
  };

  const handleDragEnd = () => {
    setDragStart(null);
    setIsDragging(false);
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.style.cursor = "grab";
    }
  };

  const handleMouseWheel = (event: WheelEvent) => {
    event.preventDefault();
    handleZoom(event.deltaY, event.clientX, event.clientY);
  };

  const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    event.preventDefault();
    handleDragStart(event.clientX, event.clientY);
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    handleDragMove(event.clientX, event.clientY);
  };

  const handleMouseUp = () => {
    handleDragEnd();
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      handleDragEnd();
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

  const handleTouchStart = (event: React.TouchEvent<HTMLCanvasElement>) => {
    event.preventDefault();
    const touch = event.touches[0];
    handleDragStart(touch.clientX, touch.clientY);
  };

  const handleTouchMove = (event: React.TouchEvent<HTMLCanvasElement>) => {
    const touch = event.touches[0];
    handleDragMove(touch.clientX, touch.clientY);
  };

  const handleTouchEnd = () => {
    handleDragEnd();
  };

  const handleZoomIn = () => {
    const newScale = scale * 1.1;
    const offsetX = width / 2 - ((width / 2 - offset.x) / scale) * newScale;
    const offsetY = height / 2 - ((height / 2 - offset.y) / scale) * newScale;
    setOffset({ x: offsetX, y: offsetY });
    setScale(newScale);
  };

  const handleZoomOut = () => {
    const newScale = scale * 0.9;
    const offsetX = width / 2 - ((width / 2 - offset.x) / scale) * newScale;
    const offsetY = height / 2 - ((height / 2 - offset.y) / scale) * newScale;
    setOffset({ x: offsetX, y: offsetY });
    setScale(newScale);
  };

  useEffect(() => {
    const handleScroll = (event: WheelEvent) => {
      const canvas = canvasRef.current;
      if (event?.target?.id === canvas.id) {
        event.preventDefault();
        handleMouseWheel(event);
      }
    };

    window.addEventListener("wheel", handleScroll, { passive: false });

    return () => {
      window.removeEventListener("wheel", handleScroll);
    };
  }, [handleMouseWheel]);

  if (isLoadingSVG) {
    return <div>Loading...</div>;
  }

  return (
    <StyledRoot>
      <StyledCanvas
        id="imageCanvas"
        ref={canvasRef}
        width={width}
        height={height}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={handleMouseEnter}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      />
      <ZoomButtonsContainer>
        <ZoomButton onClick={handleZoomIn}>+</ZoomButton>
        <ZoomButton onClick={handleZoomOut}>-</ZoomButton>
      </ZoomButtonsContainer>
    </StyledRoot>
  );
};

export default ZoomableCanvas;
