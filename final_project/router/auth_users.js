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
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
