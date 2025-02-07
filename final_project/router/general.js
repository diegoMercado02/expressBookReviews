const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
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
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
