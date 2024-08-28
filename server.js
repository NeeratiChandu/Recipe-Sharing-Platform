const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

mongoose.connect('mongodb://localhost/recipeDB', { useNewUrlParser: true, useUnifiedTopology: true });

app.use(bodyParser.json());
app.use(cors());

const recipeSchema = new mongoose.Schema({
  title: String,
  ingredients: [String],
  instructions: [String],
  category: String
});

const Recipe = mongoose.model('Recipe', recipeSchema);

app.post('/recipes', (req, res) => {
  const recipe = new Recipe(req.body);
  recipe.save((err, recipe) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send(recipe);
    }
  });
});

app.get('/recipes', (req, res) => {
  Recipe.find().then(recipes => {
    res.send(recipes);
  }).catch(err => {
    res.status(500).send(err);
  });
});

app.get('/recipes/:id', (req, res) => {
  Recipe.findById(req.params.id).then(recipe => {
    res.send(recipe);
  }).catch(err => {
    res.status(404).send(err);
  });
});

app.put('/recipes/:id', (req, res) => {
  Recipe.findByIdAndUpdate(req.params.id, req.body, { new: true }).then(recipe => {
    res.send(recipe);
  }).catch(err => {
    res.status(500).send(err);
  });
});

app.delete('/recipes/:id', (req, res) => {
  Recipe.findByIdAndRemove(req.params.id).then(() => {
    res.send({ message: 'Recipe deleted successfully' });
  }).catch(err => {
    res.status(500).send(err);
  });
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
