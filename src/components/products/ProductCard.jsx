import React from "react";

const ProductCard = ({ product }) => {
  return (
    <div className="card" style={{ width: "18rem" }}>
      <img src={product.image} className="card-img-top" alt={product.name} />
      <div className="card-body">
        <h5 className="card-title">{product.name}</h5>
        <p className="card-text">{product.description}</p>
        <a href={product.url} className="btn btn-primary">
          ${product.price}
        </a>
      </div>
    </div>
  );
};

export default ProductCard;
