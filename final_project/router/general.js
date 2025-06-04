// Import necessary modules
const express = require('express');
const bcrypt = require("bcrypt");
// Import database of books and authentication functions
const {
  books,
  getBookByISBN,
  getBooksByAuthor,
  getBooksByTitle,
  getBookReviewByISBN
} = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

// Create a router instance for public user routes
const public_users = express.Router();

// Route: Register a new user
public_users.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "Username, email, and password are required" });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ message: "Invalid email address" });
  }

  if (users.some(user => user.username === username)) {
    return res.status(400).json({ message: "Username already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10); // Hash the password

  users.push({ username, email, password: hashedPassword });

  return res.status(200).json({ message: "User registered successfully" });
});

// Function to validate email format
function isValidEmail(email) {
  // Regular expression to validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Function to hash the password
function hashPassword(password) {
  // Implement password hashing logic (using bcrypt or any other suitable library)
  return password; // For demonstration purposes, returning the password as is
}

// Route: Get the list of available books
public_users.get('/', function (req, res) {
  // Retrieve the list of available books from the database or any other source
  const availableBooks = Object.values(books).filter(book => book.available);

  // Check if there are available books
  if (availableBooks.length === 0) {
    return res.status(404).json({ message: "No books available" });
  }

  // If books are available, send them as a response
  return res.status(200).json(availableBooks);
});

//const axios = require('axios');

// Route: Get the list of available books using async-await with Axios
/*public_users.get('/', async (req, res) => {
  try {
    // Example: Make a GET request to fetch books from an external or local API endpoint
    // Replace URL with your actual data source or API endpoint
    const response = await axios.get('http://localhost:5000/api/books'); 

    // Assuming the response data is an object where each key is ISBN and value is book data
    const booksData = response.data;

    // Filter for available books
    const availableBooks = Object.values(booksData).filter(book => book.available);

    if (availableBooks.length === 0) {
      return res.status(404).json({ message: "No books available" });
    }

    return res.status(200).json(availableBooks);
  } catch (error) {
    console.error("Error fetching books:", error.message);
    return res.status(500).json({ message: "Error retrieving books" });
  }
});*/

/* Promise Route
public_users.get('/', (req, res) => {
    axios.get('http://localhost:5000/api/books')
      .then(response => {
        const booksData = response.data;
        const availableBooks = Object.values(booksData).filter(book => book.available);
  
        if (availableBooks.length === 0) {
          return res.status(404).json({ message: "No books available" });
        }
  
        res.status(200).json(availableBooks);
      })
      .catch(error => {
        console.error("Error fetching books:", error.message);
        res.status(500).json({ message: "Error retrieving books" });
      });
  });

// Route: Get book details based on ISBN
public_users.get("/isbn/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const book = getBookByISBN(isbn); // ✅ use function directly
  if (book) {
    res.status(200).json(book);
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});*/

// Route: Get book details based on author
public_users.get("/author/:author", (req, res) => {
  const author = req.params.author;
  const booksByAuthor = getBooksByAuthor(author);
  if (Object.keys(booksByAuthor).length > 0) {
    res.status(200).json(booksByAuthor);
  } else {
    res.status(404).json({ message: "No books found by that author" });
  }
});

const axios = require('axios');

//async axios details by author
/*public_users.get("/author/:author", async (req, res) => {
  const author = req.params.author;
  
  try {
    // Replace with your actual API endpoint that returns all books or filtered by author
    const response = await axios.get('http://localhost:5000/api/books');

    // Response data assumed to be an object with ISBN keys and book info values
    const allBooks = response.data;

    // Filter books by matching author (case-insensitive)
    const booksByAuthor = Object.values(allBooks).filter(book => 
      book.author && book.author.toLowerCase() === author.toLowerCase()
    );

    if (booksByAuthor.length > 0) {
      res.status(200).json(booksByAuthor);
    } else {
      res.status(404).json({ message: "No books found by that author" });
    }
  } catch (error) {
    console.error("Error fetching books by author:", error.message);
    res.status(500).json({ message: "Error retrieving books by author" });
  }
});*/

// Route: Get all books based on title
public_users.get("/title/:title", (req, res) => {
  const title = req.params.title;
  const booksByTitle = getBooksByTitle(title);
  if (Object.keys(booksByTitle).length > 0) {
    res.status(200).json(booksByTitle);
  } else {
    res.status(404).json({ message: "No books found with that title" });
  }
});

//async axios by Title
/*const axios = require('axios');

public_users.get("/title/:title", async (req, res) => {
  const title = req.params.title;

  try {
    // Fetch all books from an external or internal API endpoint
    const response = await axios.get('http://localhost:5000/api/books');

    const allBooks = response.data;

    // Filter books that match the title (case-insensitive)
    const booksByTitle = Object.values(allBooks).filter(book =>
      book.title && book.title.toLowerCase() === title.toLowerCase()
    );

    if (booksByTitle.length > 0) {
      res.status(200).json(booksByTitle);
    } else {
      res.status(404).json({ message: "No books found with that title" });
    }
  } catch (error) {
    console.error("Error fetching books by title:", error.message);
    res.status(500).json({ message: "Error retrieving books by title" });
  }
});*/


// Route: Get book review
public_users.get('/review/:isbn', function (req, res) {
  // Extract ISBN from request parameters
  const isbn = req.params.isbn;

  // Implement logic to fetch and return book review for the specified ISBN
  const bookReview = books.getBookReviewByISBN(isbn); // Assuming a function getBookReviewByISBN() is defined in booksdb.js to fetch book review by ISBN

  if (bookReview) {
    return res.status(200).json({ review: bookReview });
  } else {
    return res.status(404).json({ message: "Review for this book not found" });
  }
});

// Export the router containing public user routes
module.exports.general = public_users;