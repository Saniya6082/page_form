// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const User = require('./models/User');

// Connect to MongoDB database
mongoose.connect('mongodb://localhost:27017/mydatabase', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

// Create an Express application
const app = express();

// Middleware to parse request bodies
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Define route for handling form submission
app.post('/submit', (req, res) => {
  const { name, email } = req.body;

  // Backend validation
  if (!name || !email) {
    return res.status(400).send('Name and email are required');
  }

  // Create a new user instance
  const newUser = new User({ name, email });

  // Save the user to the database
  newUser.save()
    .then(() => {
      console.log('User added to the database:', newUser);
      res.status(200).send('Form submitted successfully and data saved to database');
    })
    .catch(err => {
      console.error('Error saving user to the database:', err);
      res.status(500).send('Internal Server Error');
    });
});

// Define fallback port
const PORT = process.env.PORT || 4000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
