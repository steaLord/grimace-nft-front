import React, { useState, useRef, useCallback } from "react";
import styled from "@emotion/styled";
import Image from "next/image";

const ImageBoxContainer = styled.div`
  position: relative;
  width: 100%;
  height: 0;
  padding-bottom: 100%;
  background-color: #f5f5f5;
  overflow: hidden;
`;

const ImageBox = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

const ZoomButtons = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
`;

const ZoomButton = styled.button`
  padding: 10px 20px;
  background-color: #fff;
  border: none;
  font-size: 20px;
  cursor: pointer;
  &:hover {
    background-color: #eee;
  }
`;

const ZoomableImageBox = ({ image, height = "500px", width = "500px" }) => {
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const imageRef = useRef();

  const handleZoom = useCallback((increment) => {
    setZoom((prevZoom) => Math.max(0.1, prevZoom + increment));
  }, []);

  const handleMouseDown = useCallback((e) => {
    const boxRect = imageRef.current.getBoundingClientRect();
    const startX = e.clientX - boxRect.left - position.x;
    const startY = e.clientY - boxRect.top - position.y;

    const handleMouseMove = (e) => {
      const newPosX = e.clientX - boxRect.left - startX;
      const newPosY = e.clientY - boxRect.top - startY;
      setPosition({ x: newPosX, y: newPosY });
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  }, [position]);

  const handleWheel = useCallback((e) => {
    e.preventDefault();
    const increment = e.deltaY > 0 ? -0.1 : 0.1;
    handleZoom(increment);
  }, [handleZoom]);

  return (
    <ImageBoxContainer style={{ height, width }}>
      <ImageBox
        ref={imageRef}
        onMouseDown={handleMouseDown}
        onWheel={handleWheel}
      >
        <Image
          src={image}
          width={500}
          height={500}
          draggable={false}
          alt="Zoomable Image"
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
            transition: "transform 0.3s",
            userDrag: "none",
            userSelect: "none",
            width: "100%",
            height: "100%",
            objectFit: "contain",
          }}
        />
      </ImageBox>
      <ZoomButtons>
        <ZoomButton onClick={() => handleZoom(0.1)}>+</ZoomButton>
        <ZoomButton onClick={() => handleZoom(-0.1)}>-</ZoomButton>
      </ZoomButtons>
    </ImageBoxContainer>
  );
};

export default ZoomableImageBox;
