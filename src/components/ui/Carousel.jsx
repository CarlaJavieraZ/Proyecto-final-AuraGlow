import React from "react";
import CarouselItem from "./CarouselItem";

const slides = [
  {
    src: "https://placehold.co/600x200@2x.png",
    alt: "Slide 1",
    title: "First slide label",
    description: "Some representative placeholder content",
  },
  {
    src: "https://placehold.co/600x200@2x.png",
    alt: "Slide 2",
    title: "Second slide label",
    description: "Some representative placeholder content",
  },
  {
    src: "https://placehold.co/600x200@2x.png",
    alt: "Slide 3",
    title: "Third slide label",
    description: "Some representative placeholder content",
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