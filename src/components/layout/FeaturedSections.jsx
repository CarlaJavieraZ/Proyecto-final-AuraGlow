import React, { useState } from "react";

const sections = [
  {
    id: 1,
    title: "Productos Destacados",
    subtitle: "Must Have",
    images: [
      "/images/productsmusthave/serum.jpg",
      "/images/productsmusthave/tonic.jpg",
      "/images/productsmusthave/cream.jpg",
    ],
  },
  {
    id: 2,
    title: "Lo Más Vendido",
    subtitle: "Best Choices",
    images: [
      "/images/productsmusthave/tonic.jpg",
      "/images/productsmusthave/cream.jpg",
      "/images/productsmusthave/serum.jpg",
    ],
  },
  {
    id: 3,
    title: "Nuevos Productos",
    subtitle: "Event Editor",
    images: [
      "/images/productsmusthave/cream.jpg",
      "/images/productsmusthave/serum.jpg",
      "/images/productsmusthave/tonic.jpg",
    ],
  },
];

const MiniCarousel = ({ images, subtitle }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () =>
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));

  const handleNext = () =>
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));

  return (
    <div style={{ position: "relative", overflow: "hidden" }}>
      <img
        src={images[currentIndex]}
        alt={subtitle}
        className="card-img-top"
        style={{ width: "100%", height: "220px", objectFit: "cover" }}
      />
      <button onClick={handlePrev} style={btnStyle("left")}>
        ‹
      </button>
      <button onClick={handleNext} style={btnStyle("right")}>
        ›
      </button>
      <div style={dotsContainer}>
        {images.map((_, idx) => (
          <span
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background:
                idx === currentIndex ? "#fff" : "rgba(255,255,255,0.5)",
              cursor: "pointer",
              display: "inline-block",
            }}
          />
        ))}
      </div>
    </div>
  );
};

const btnStyle = (side) => ({
  position: "absolute",
  top: "50%",
  [side]: "8px",
  transform: "translateY(-50%)",
  background: "rgba(255,255,255,0.7)",
  border: "none",
  borderRadius: "50%",
  width: "28px",
  height: "28px",
  cursor: "pointer",
  fontSize: "16px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

const dotsContainer = {
  position: "absolute",
  bottom: "8px",
  width: "100%",
  display: "flex",
  justifyContent: "center",
  gap: "5px",
};

const FeaturedSections = () => {
  return (
    <div className="container my-5">
      <div className="row g-4 text-center">
        {sections.map((section) => (
          <div key={section.id} className="col-12 col-md-4">
            <h5 className="mb-3">{section.title}</h5>
            <div className="card border-0 shadow-sm">
              <MiniCarousel
                images={section.images}
                subtitle={section.subtitle}
              />
              <div className="card-body">
                <p className="mb-0">{section.subtitle}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedSections;
