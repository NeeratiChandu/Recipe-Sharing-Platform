import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [recipes, setRecipes] = useState([]);
  const [newRecipe, setNewRecipe] = useState({ title: '', ingredients: [], instructions: [], category: '' });

  useEffect(() => {
    axios.get('http://localhost:3000/recipes')
      .then(response => {
        setRecipes(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    axios.post('http://localhost:3000/recipes', newRecipe)
      .then(response => {
        setRecipes([...recipes, response.data]);
        setNewRecipe({ title: '', ingredients: [], instructions: [], category: '' });
      })
      .catch(error => {
        console.error(error);
      });
  };

  const handleEdit = (id) => {
    axios.get(`http://localhost:3000/recipes/${id}`)
      .then(response => {
        setNewRecipe(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  };

  const handleDelete = (id) => {
    axios.delete(`http://localhost:3000/recipes/${id}`)
      .then(() => {
        setRecipes(recipes.filter(recipe => recipe._id !== id));
      })
      .catch(error => {
        console.error(error);
      });
  };

  return (
    <div>
      <h1>Recipe Sharing Platform</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Title:
          <input type="text" value={newRecipe.title} onChange={(event) => setNewRecipe({ ...newRecipe, title: event.target.value })} />
        </label>
        <label>
          Ingredients:
          <textarea value={newRecipe.ingredients.join('\n')} onChange={(event) => setNewRecipe({ ...newRecipe, ingredients: event.target.value.split('\n') })} />
        </label>
        <label>
          Instructions:
          <textarea value={newRecipe.instructions.join('\n')} onChange={(event) => setNewRecipe({ ...newRecipe, instructions: event.target.value.split('\n') })} />
        </label>
        <label>
          Category:
          <input type="text" value={newRecipe.category} onChange={(event) => setNewRecipe({ ...newRecipe, category: event.target.value })} />
        </label>
        <button type="submit">Create Recipe</button>
      </form>
      <ul>
        {recipes.map((recipe) => (
          <li key={recipe._id}>
            <h2>{recipe.title}</h2>
            <p>Ingredients: {recipe.ingredients.join(', ')}</p>
            <p>Instructions: {recipe.instructions.join(', ')}</p>
            <p>Category: {recipe.category}</p>
            <button onClick={() => handleEdit(recipe._id)}>Edit</button>
            <button onClick={() => handleDelete(recipe._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
