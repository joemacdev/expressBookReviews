// Import necessary modules
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");

const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
  
    if (authHeader) {
      // Bearer <token>
      const token = authHeader.split(' ')[1];
  
      jwt.verify(token, "your_secret_key", (err, user) => {
        if (err) {
          return res.status(403).json({ message: "Invalid or expired token" });
        }
  
        req.user = user;  // attach user info to request object
        next();
      });
    } else {
      res.status(401).json({ message: "Authorization token required" });
    }
};

// Import database of books
const {
  books,
  getBookByISBN,
  getBooksByAuthor,
  getBooksByTitle,
  getBookReviewByISBN
} = require("./booksdb.js");

// Create a router instance for registered user routes
const regd_users = express.Router();

// Initialize an empty array to store registered users
let users = [];

// Function to check if a username is valid
const isValid = (username) => {
    if (!username || !/^[a-zA-Z0-9]+$/.test(username)) {
        return false;
    }
    if (username.length < 3 || username.length > 20) {
        return false;
    }
    if (!/^[a-zA-Z0-9]+$/.test(username)) {
        return false;
    }
    const reservedUsernames = ['admin', 'root', 'superuser'];
    if (reservedUsernames.includes(username.toLowerCase())) {
        return false;
    }
    return true;
};

// Function to check if a username and password match the records
const authenticatedUser = async (username, password) => {
    if (!username || !password) {
        return false;
    }
    const user = users.find(user => user.username === username);
    if (!user) {
        return false;
    }
    const match = await bcrypt.compare(password, user.password);
    return match;
};

// Route to handle user login
regd_users.post("/login", async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    if (!await authenticatedUser(username, password)) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    // Use best practice: token expires in 1 hour
    const token = jwt.sign({ username }, "your_secret_key", { expiresIn: '1h' });

    return res.status(200).json({ token });
});

// Route to add a book review for an authenticated user
regd_users.put("/auth/review/:isbn", (req, res) => {
    const { isbn } = req.params;
    const { review } = req.body;

    if (!review) {
        return res.status(400).json({ message: "Review is required" });
    }

    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }

    books[isbn].reviews.push(review);

    return res.status(200).json({ message: "Review added successfully" });
});

// Export the router containing registered user routes
module.exports = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
