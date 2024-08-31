import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CategoryFilter from './CategoryFilter';
import Rating from './Rating';

function App() {
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [rating, setRating] = useState(0);
  const [token, setToken] = useState('');

  useEffect(() => {
    axios.get('http://localhost:3000/recipes')
      .then(response => {
        setRecipes(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  const handleCreateRecipe = (recipe) => {
    axios.post('http://localhost:3000/recipes', recipe)
      .then(response => {
        setRecipes([...recipes, response.data]);
      })
      .catch(error => {
        console.error(error);
      });
  };

  const handleEditRecipe = (recipe) => {
    axios.put(`http://localhost:3000/recipes/${recipe._id}`, recipe)
      .then(response => {
        setRecipes(recipes.map(r => r._id === recipe._id ? response.data : r));
      })
      .catch(error => {
        console.error(error);
      });
  };

  const handleDeleteRecipe = (recipeId) => {
    axios.delete(`http://localhost:3000/recipes/${recipeId}`)
      .then(() => {
        setRecipes(recipes.filter(r => r._id !== recipeId));
      })
      .catch(error => {
        console.error(error);
      });
  };

  const handleRatingChange = (rating) => {
    setRating(rating);
  };

  const handleRatingSubmit = () => {
    axios.post('http://localhost:3000/ratings', { rating, recipeId: selectedRecipe._id })
      .then(response => {
        console.log(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  };

  const handleLogin = (username, password) => {
    axios.post('http://localhost:3000/login', { username, password })
      .then(response => {
        setToken(response.data.token);
      })
      .catch(error => {
        console.error(error);
      });
  };

  const handleRegister = (username, password) => {
    axios.post('http://localhost:3000/register', { username, password })
      .then(response => {
        console.log(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  };

  return (
    <div>
      <h1>Recipe Sharing Platform</h1>
      <CategoryFilter recipes={recipes} />
      {selectedRecipe && (
        <div>
          <h2>{selectedRecipe.title}</h2>
          <p>Ingredients: {selectedRecipe.ingredients.join(', ')}</p>
          <p>Instructions: {selectedRecipe.instructions.join(', ')}</p>
          <Rating rating={rating} onChange={handleRatingChange} onSubmit={handleRatingSubmit} />
        </div>
      )}
      <button onClick={() => handleCreateRecipe({ title: 'New Recipe', ingredients: [], instructions: [] })}>
        Create Recipe
      </button>
      <button onClick={() => handleLogin('username', 'password')}>Login</button>
      <button onClick={() => handleRegister('username', 'password')}>Register</button>
    </div>
  );
}

export default App;
