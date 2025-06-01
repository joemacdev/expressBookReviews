let books = {
      1: {"author": "Chinua Achebe","title": "Things Fall Apart", "reviews": {}, available: true},
      2: {"author": "Hans Christian Andersen","title": "Fairy tales", "reviews": {}, available: true},
      3: {"author": "Dante Alighieri","title": "The Divine Comedy", "reviews": {}, available: true },
      4: {"author": "Unknown","title": "The Epic Of Gilgamesh", "reviews": {}, available: true },
      5: {"author": "Unknown","title": "The Book Of Job", "reviews": {}, available: true },
      6: {"author": "Unknown","title": "One Thousand and One Nights", "reviews": {}, available: true },
      7: {"author": "Unknown","title": "Nj\u00e1l's Saga", "reviews": {}, available: true },
      8: {"author": "Jane Austen","title": "Pride and Prejudice", "reviews": {"alice": "A timeless classic.",
      "bob": "Loved the character development."}, available: true },
      9: {"author": "Honor\u00e9 de Balzac","title": "Le P\u00e8re Goriot", "reviews": {}, available: true },
      10: {"author": "Samuel Beckett","title": "Molloy, Malone Dies, The Unnamable, the trilogy", "reviews": {}, available: true }
}

function getBookByISBN(isbn) {
  return books[isbn];
}

function getBooksByAuthor(author) {
    const matchingBooks = {};
    for (const isbn in books) {
      if (books[isbn].author.toLowerCase() === author.toLowerCase()) {
        matchingBooks[isbn] = books[isbn];
      }
    }
    return matchingBooks;
  }

  function getBooksByTitle(title) {
    const matchingBooks = {};
    for (const isbn in books) {
      if (books[isbn].title.toLowerCase().includes(title.toLowerCase())) {
        matchingBooks[isbn] = books[isbn];
      }
    }
    return matchingBooks;
  }

function getBookReviewByISBN(isbn) {
  return books[isbn]?.reviews || null;
}

module.exports = {
  books,
  getBookByISBN,
  getBooksByAuthor,
  getBooksByTitle,
  getBookReviewByISBN
};
