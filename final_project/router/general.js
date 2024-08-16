const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  const userExists = users.some(user => user.username === username);

  if (userExists) {
    return res.status(409).json({ message: "Username already exists" });
  }

  users.push({ username, password });
  res.status(201).json({ message: "User registered successfully" });
  return res.status(300).json({ message: "Yet to be implemented" });
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  try {
    const response = await axios.get('http://localhost:5000/'); // Adjust URL if necessary
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error fetching books:', error.message);
    res.status(500).json({ message: "Error fetching books", error: error.message });
  }
});


// Get book details based on ISBN
// Endpoint to get book details based on ISBN using async/await
public_users.get('/isbn/:isbn', async function (req, res) {
  const { isbn } = req.params;
  try {
    const response = await axios.get(`http://localhost:5000/isbn/${isbn}`); // Adjust URL if necessary
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error fetching book details:', error.message);
    res.status(500).json({ message: "Error fetching book details", error: error.message });
  }
});


// Get book details based on author
// Endpoint to get book details based on author using async/await
public_users.get('/author/:author', async function (req, res) {
  const { author } = req.params;
  try {
    const response = await axios.get(`http://localhost:5000/author/${author}`); // Adjust URL if necessary
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error fetching books by author:', error.message);
    res.status(500).json({ message: "Error fetching books by author", error: error.message });
  }
});

// Get all books based on title
// Endpoint to get book details based on title using async/await
public_users.get('/title/:title', async function (req, res) {
  const { title } = req.params;
  try {
    const response = await axios.get(`http://localhost:5000/title/${title}`); // Adjust URL if necessary
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error fetching books by title:', error.message);
    res.status(500).json({ message: "Error fetching books by title", error: error.message });
  }
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book && book.reviews) {
    res.status(200).json(book.reviews);
  } else {
    res.status(404).json({ message: "No reviews found for this book" });
  }
  return res.status(300).json({ message: "Yet to be implemented" });
});

module.exports.general = public_users;
