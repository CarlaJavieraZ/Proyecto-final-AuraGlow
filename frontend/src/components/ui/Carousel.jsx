import React from "react";
import CarouselItem from "./CarouselItem";

const slides = [
  {
    src: "/images/banners/pielrostro.jpg",
    alt: "Slide 1",
    title: "Piel perfecta",
    description: "Tu rutina perfecta",
  },
  {
    src: "/images/banners/cream.jpg",
    alt: "Slide 2",
    title: "El producto perfecto para ti",
    description: "Todo hecho con los mejores ingredientes",
  },
  {
    src: "/images/banners/cremarostro.png",
    alt: "Slide 3",
    title: "Piel más hidratada",
    description: "Para lucir radiante",
  },
  
];

const Carousel = () => {
  return (
    <div id="carouselExampleCaptions" className="carousel slide">

      <div className="carousel-indicators">
        {slides.map((_, index) => (
          <button
            key={index}
            type="button"
            data-bs-target="#carouselExampleCaptions"
            data-bs-slide-to={index}
            className={index === 0 ? "active" : ""}
          ></button>
        ))}
      </div>

      <div className="carousel-inner">
        {slides.map((slide, index) => (
          <CarouselItem
            key={index}
            src={slide.src}
            alt={slide.alt}
            title={slide.title}
            description={slide.description}
            active={index === 0}
          />
        ))}
      </div>

      <button
        className="carousel-control-prev"
        type="button"
        data-bs-target="#carouselExampleCaptions"
        data-bs-slide="prev"
      >
        <span className="carousel-control-prev-icon"></span>
      </button>

      <button
        className="carousel-control-next"
        type="button"
        data-bs-target="#carouselExampleCaptions"
        data-bs-slide="next"
      >
        <span className="carousel-control-next-icon"></span>
      </button>

    </div>
  );
};

export default Carousel;