import React, { useState } from 'react';

function Rating({ rating, onChange, onSubmit }) {
  const [newRating, setNewRating] = useState(rating);

  const handleRatingChange = (e) => {
    setNewRating(e.target.value);
  };

  const handleRatingSubmit = () => {
    onSubmit(newRating);
  };

  return (
    <div>
      <h2>Rating: {newRating}</h2>
      <input type="range" min="1" max="5" value={newRating} onChange={handleRatingChange} />
      <button onClick={handleRatingSubmit}>Submit Rating</button>
    </div>
  );
}

export default Rating;
