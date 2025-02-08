const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const axios = require('axios');
const public_users = express.Router();



public_users.post("/register", (req,res) => {
  const {username, password} = req.body;

  if (!username) {
      return res.status(400).json({message: "Username is required"});
  }
  else if (!password) {
      return res.status(400).json({message: "Password is required"});
  } 
  else if (users[username]) {
      return res.status(400).json({message: "User already exists"});
  }
  else {
    users[username] = { username, password };
    return res.status(200).json({message: "User registered successfully"});
  }

});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) {
      res.status(200).json(book);
  } else {
      res.status(404).json({ message: 'Book not found' });
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  booksByAuthor = [];
  const author = req.params.author;
  for (let i in books) {
      if (books[i].author === author) {
          booksByAuthor.push(books[i]);
      }
  }
  
  if (booksByAuthor.length > 0) {
      res.status(200).json(booksByAuthor);
  } else {
      res.status(404).json({ message: 'Author not found' });
  }

});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  const booksByTitle = [];

  for (let i in books) {
      if (books[i].title === title) {
          booksByTitle.push(books[i]);
      }
  }

  if (booksByTitle.length > 0) {
      res.status(200).json(booksByTitle);
  } else {
      res.status(404).json({ message: 'Title not found' });
  }

});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) {
      res.status(200).json(book.reviews);
  } else {
      res.status(404).json({ message: 'Book not found' });
  }

});

// Task 10 
async function fetchBooks() {
  try {
    const response = await axios.get('http://localhost:5000/');
    return response.data;
  } catch (error) {
    console.log(error);
  }
}

// Task 11
async function fetchBookByISBN(isbn) {
  try {
    const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
    return response.data;
  } catch (error) {
    console.log(error);
  }
}


module.exports.general = public_users;
