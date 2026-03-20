import React from "react";

const Categories = ({ categories, selectedCategory, onSelectCategory }) => {
  return (
    <div className="container my-4">
      <h3 className="mb-3">Categorías</h3>

      <div className="d-flex flex-wrap gap-2">
        <button
          className={`btn ${
            selectedCategory === "Todas" ? "btn-dark" : "btn-outline-dark"
          }`}
          onClick={() => onSelectCategory("Todas")}
        >
          Todas
        </button>

        {categories.map((category, index) => (
          <button
            key={index}
            className={`btn ${
              selectedCategory === category ? "btn-dark" : "btn-outline-dark"
            }`}
            onClick={() => onSelectCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Categories;