import React from "react";

const Image = ({ src, alt }) => {
  return (
    <img src={src} className="d-block w-100" alt={alt} />
  );
};

export default Image;