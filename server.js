const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

mongoose.connect('mongodb://localhost/recipeDB', { useNewUrlParser: true, useUnifiedTopology: true });

app.use(bodyParser.json());
app.use(cors());

const userSchema = new mongoose.Schema({
  username: String,
  password: String
});

const recipeSchema = new mongoose.Schema({
  title: String,
  ingredients: [String],
  instructions: [String],
  category: String,
  ratings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Rating' }]
});

const ratingSchema = new mongoose.Schema({
  rating: Number,
  recipe: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

const User = mongoose.model('User', userSchema);
const Recipe = mongoose.model('Recipe', recipeSchema);
const Rating = mongoose.model('Rating', ratingSchema);

// User authentication
app.post('/register', (req, res) => {
  const user = new User(req.body);
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(user.password, salt, (err, hash) => {
      user.password = hash;
      user.save((err, user) => {
        if (err) {
          res.status(500).send(err);
        } else {
          res.send({ message: 'User created successfully' });
        }
      });
    });
  });
});

app.post('/login', (req, res) => {
  User.findOne({ username: req.body.username }, (err, user) => {
    if (err) {
      res.status(500).send(err);
    } else if (!user) {
      res.status(401).send({ message: 'Invalid username or password' });
    } else {
      bcrypt.compare(req.body.password, user.password, (err, isMatch) => {
        if (err) {
          res.status(500).send(err);
        } else if (!isMatch) {
          res.status(401).send({ message: 'Invalid username or password' });
        } else {
          const token = jwt.sign({ userId: user._id }, 'secretkey', { expiresIn: '1h' });
          res.send({ token: token });
        }
      });
    }
  });
});

// Recipe creation, editing, and deletion
app.post('/recipes', authenticate, (req, res) => {
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

app.put('/recipes/:id', authenticate, (req, res) => {
  Recipe.findByIdAndUpdate(req.params.id, req.body, { new: true }).then(recipe => {
    res.send(recipe);
  }).catch(err => {
    res.status(500).send(err);
  });
});

app.delete('/recipes/:id', authenticate, (req, res) => {
  Recipe.findByIdAndRemove(req.params.id).then(() => {
    res.send({ message: 'Recipe deleted successfully' });
  }).catch(err => {
    res.status(500).send(err);
  });
});

// Rating creation
app.post('/ratings', authenticate, (req, res) => {
  const rating = new Rating(req.body);
  rating.save((err, rating) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send(rating);
    }
  });
});

// Helper function to authenticate requests
function authenticate(req, res, next) {
  const token = req.header('x-auth-token');
  if (!token) {
    return res.status(401).send({ message: 'No token provided' });
  }
  jwt.verify(token, 'secretkey', (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: 'Invalid token' });
    }
    req.userId = decoded.userId;
    next();
  });
}

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
