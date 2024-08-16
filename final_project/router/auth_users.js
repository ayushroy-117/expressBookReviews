const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
  //write code to check is the username is valid
  return users.some(user => user.username === username);
}

const authenticatedUser = (username, password) => { //returns boolean
  //write code to check if username and password match the one we have in records.
  return users.some(user => user.username === username && user.password === password);
}

//only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  if (!isValid(username)) {
    return res.status(401).json({ message: "Invalid username." });
  }

  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid password." });
  }

  // Generate JWT token
  const token = jwt.sign({ username }, "fingerprint_customer", { expiresIn: '1h' });

  // Save the token in the session
  req.session.token = token;

  return res.status(200).json({ message: "Login successful", token });
  return res.status(300).json({ message: "Yet to be implemented" });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.user.username; // Extracted from the decoded JWT token

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found." });
  }

  // Add or modify the review
  books[isbn].reviews[username] = review;

  return res.status(200).json({ message: "Review added/updated successfully." });
  return res.status(300).json({ message: "Yet to be implemented" });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.user.username; // Ensure this is correctly populated from the JWT token

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found." });
  }

  // Check if the review exists for the user
  if (books[isbn].reviews[username]) {
    delete books[isbn].reviews[username];
    return res.status(200).json({ message: "Review deleted successfully." });
  } else {
    return res.status(404).json({ message: "Review not found." });
  }
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
