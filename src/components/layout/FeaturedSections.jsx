import React from "react";

const sections = [
  {
    id: 1,
    title: "Productos Destacados",
    image: "https://placehold.co/200x200@2x.png",
    subtitle: "Must Have",
  },
  {
    id: 2,
    title: "Lo Más Vendido",
    image: "https://placehold.co/200x200@2x.png",
    subtitle: "Best Choices",
  },
  {
    id: 3,
    title: "Nuevos Productos",
    image: "https://placehold.co/200x200@2x.png",
    subtitle: "Event Editor",
  },
];

const FeaturedSections = () => {
  return (
    <div className="container my-5">
      <div className="row g-4 text-center">
        {sections.map((section) => (
          <div key={section.id} className="col-12 col-md-4">
            <h5 className="mb-3">{section.title}</h5>

            <div className="card border-0 shadow-sm h-100">
              <img
                src={section.image}
                alt={section.title}
                className="card-img-top rounded"
                style={{ height: "180px", objectFit: "cover" }}
              />
              <div className="card-body py-3">
                <p className="mb-0 fw-medium">{section.subtitle}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedSections;