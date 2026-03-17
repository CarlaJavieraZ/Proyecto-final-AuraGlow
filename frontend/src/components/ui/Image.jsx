import React from "react";

const Image = ({ src, alt, className }) => {
  return (
    <img
      src={src}
      alt={alt}
      className={`d-block w-100 ${className}`}
    />
  );
};

export default Image;