import React from "react";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import Image from "next/image";

const ZoomableImageBox = ({ image, height = "500px", width = "500px" }) => {
  return (
    <TransformWrapper>
      <TransformComponent>
        <Image
          src={image}
          width={500}
          height={500}
          draggable={false}
          alt="Zoomable Image"
        />
      </TransformComponent>
    </TransformWrapper>
  );
};

export default ZoomableImageBox;
