import React, { useState } from 'react';

function RecipeForm({ onCreateRecipe }) {
  const [title, setTitle] = useState('');
  const [ingredients, setIngredients] = useState([]);
  const [instructions, setInstructions] = useState([]);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleIngredientChange = (e) => {
    setIngredients(e.target.value.split(','));
  };

  const handleInstructionChange = (e) => {
    setInstructions(e.target.value.split(','));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreateRecipe({ title, ingredients, instructions });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Title:
        <input type="text" value={title} onChange={handleTitleChange} />
      </label>
      <br />
      <label>
        Ingredients:
        <input type="text" value={ingredients.join(',')} onChange={handleIngredientChange} />
      </label>
      <br />
      <label>
        Instructions:
        <input type="text" value={instructions.join(',')} onChange={handleInstructionChange} />
      </label>
      <br />
      <button type="submit">Create Recipe</button>
    </form>
  );
}

export default RecipeForm;
