import React from "react";
import Image from "./Image";

const CarouselItem = ({ src, alt, title, description, active }) => {
  return (
    <div className={`carousel-item ${active ? "active" : ""}`}>
      <Image src={src} alt={alt} />

      <div className="carousel-caption d-none d-md-block">
        <h5>{title}</h5>
        <p>{description}</p>
      </div>
    </div>
  );
};

export default CarouselItem;