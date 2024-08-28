import React, { useState, useEffect } from 'react';
import axios from 'axios';

function CategoryFilter() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    axios.get('http://localhost:3000/recipes')
      .then(response => {
        const categories = [...new Set(response.data.map(recipe => recipe.category))];
        setCategories(categories);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  const handleFilter = (category) => {
    setSelectedCategory(category);
  };

  return (
    <div>
      <h2>Filter by Category</h2>
      <ul>
        {categories.map((category) => (
          <li key={category}>
            <button onClick={() => handleFilter(category)}>{category}</button>
          </li>
        ))}
      </ul>
      {selectedCategory && (
        <div>
          <h2>Recipes in {selectedCategory}</h2>
          <ul>
            {recipes.filter(recipe => recipe.category === selectedCategory).map((recipe) => (
              <li key={recipe._id}>
                <h2>{recipe.title}</h2>
                <p>Ingredients: {recipe.ingredients.join(', ')}</p>
                <p>Instructions: {recipe.instructions.join(', ')}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default CategoryFilter;
