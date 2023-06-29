import React, { useRef, useEffect, useState } from "react";
import styled from "@emotion/styled";

interface ZoomableCanvasProps {
  width: number;
  height: number;
  imageSrc: string;
}

const StyledRoot = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledCanvas = styled.canvas`
  width: 100%;
  height: 100%;
  border-radius: 16px;
  background: #a9a9a9;
  box-shadow: 0px 0px 30px rgba(0, 0, 0, 0.4);
`;

const ZoomableCanvas: React.FC<ZoomableCanvasProps> = ({
  width,
  height,
  imageSrc,
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
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (canvas) {
      const context = canvas.getContext("2d");

      const image = new Image();
      image.src = imageSrc;

      image.onload = () => {
        const canvasWidth = width;
        const canvasHeight = height;

        canvas.width = canvasWidth;
        canvas.height = canvasHeight;

        context?.clearRect(0, 0, canvasWidth, canvasHeight);
        context?.drawImage(
          image,
          offset.x,
          offset.y,
          canvasWidth * scale,
          canvasHeight * scale
        );
      };
    }
  }, [width, height, imageSrc, offset, scale]);

  const handleWheel = (event: React.WheelEvent<HTMLCanvasElement>) => {
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

  const handleScroll = (event: React.WheelEvent<HTMLCanvasElement>) => {
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

  useEffect(() => {
    const canvas = canvasRef.current;

    if (canvas) {
      canvas.addEventListener("wheel", handleScroll, { passive: false });
      return () => {
        canvas.removeEventListener("wheel", handleScroll);
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

  return (
    <StyledRoot>
      <StyledCanvas
        ref={canvasRef}
        style={{
          maxWidth: width,
          maxHeight: height,
        }}
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
