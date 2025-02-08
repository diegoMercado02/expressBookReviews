const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ 
  return users[username] ? true : false;
}

const authenticatedUser = (username,password)=>{ //returns boolean
  return users[username].password === password;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const {username, password} = req.body;
  
  if (!username) {
      return res.status(400).json({message: "Username is required"});
  }
  else if (!password) {
      return res.status(400).json({message: "Password is required"});
  } 
  else if (!isValid(username)) {
      return res.status(400).json({message: "User does not exist"});
  }
  else if (!authenticatedUser(username,password)) {
      return res.status(400).json({message: "Invalid credentials"});
  }
  else {
    const token = jwt.sign({username}, "fingerprint_customer", { expiresIn: "1h" });
    return res.status(200).json({message: "Login successful", token});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {

  const isbn = req.params.isbn;
  const review = req.query.review;
  const token = req.headers.authorization.split(' ')[1];
  const decoded = jwt.verify(token, "fingerprint_customer");
  const username = decoded.username;

  if (!books[isbn]) {

    return res.status(404).json({ message: "Book not found" });

  } 
  else if (!review) {
    return res.status(400).json({ message: "Review is required" });
  } 
  else {
    if (!Array.isArray(books[isbn].reviews)) {
      books[isbn].reviews = [];
    }

    if (books[isbn].reviews.length === 0 || books[isbn].reviews.length === undefined) {
      books[isbn].reviews.push({ username, review });
      return res.status(200).json({ message: "Review added successfully", reviews: books[isbn].reviews[0] });

    } else if (books[isbn].reviews.length > 0) {
      const userReviewIndex = books[isbn].reviews.findIndex(r => r.username === username);

      if (userReviewIndex >= 0) {
        books[isbn].reviews[userReviewIndex].review = review;
        return res.status(200).json({ message: "Review updated successfully", review: books[isbn].reviews });
      } else {
        books[isbn].reviews.push({ username, review });
        return res.status(200).json({ message: "Review added successfully", review: books[isbn].reviews });
      }
    }
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const token = req.headers.authorization.split(' ')[1];
  const decoded = jwt.verify(token, "fingerprint_customer");
  const username = decoded.username;

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  } else {
    const userReviewIndex = books[isbn].reviews.findIndex(r => r.username === username);

    if (userReviewIndex >= 0) {
      books[isbn].reviews.splice(userReviewIndex, 1);
      return res.status(200).json({ message: "Review deleted successfully", review: books[isbn].reviews  });
    } else {
      return res.status(404).json({ message: "Review not found", review: books[isbn].reviews  });
    }
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
