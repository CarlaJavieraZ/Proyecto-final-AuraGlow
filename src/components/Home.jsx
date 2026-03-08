import React, { useState } from "react";
import ProductList from "./products/ProductList";
import productsData from "../assets/mockdata/products.json";
import Carousel from "./ui/Carousel";
import FeaturedSections from "./layout/FeaturedSections";

const Home = () => {
  const [products] = useState(productsData);

  return (
    <div>
      <div className="container">
        <Carousel />
        <hr className="my-5" />
        <FeaturedSections />
        <hr className="my-5" />
        <ProductList products={products} />
      </div>
    </div>
  );
};

export default Home;