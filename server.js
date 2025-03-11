const dotenv = require('dotenv');
const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require("method-override");
const morgan = require("morgan");
const Book = require('./models/Book');
const port = 3000;

const app = express();

dotenv.config();

mongoose.connect(process.env.MONGODB_URI);

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
app.use(morgan("dev"));
app.use(express.static('public')); // static assets middleware

// Route to homepage
app.get('/', async (req, res) => {
  res.render('index.ejs');
});

// Route to send a form to create a new book
app.get('/books/new', (req, res) => {
  res.render('books/new.ejs');
});

// Route to create a new book in the db
app.post('/books', async (req, res) => {
  await Book.create(req.body);
  res.redirect('/books')
});

// Index route to send a page that lists all books from the db
app.get('/books', async (req, res) => {
  const allBooks = await Book.find({});
  res.render('books/index.ejs', { books: allBooks });
});

// Route to send a page that shows a single book from the db
app.get('/books/:bookId', async (req, res) => {
  const foundBook = await Book.findById(req.params.bookId);
  res.render('books/show.ejs', { book: foundBook });
});

// Route to delete a book from the db
app.delete('/books/:bookId', async (req, res) => {
  await Book.findByIdAndDelete(req.params.bookId);
  res.redirect("/books");
});

// Route to send a form to edit a book
app.get('/books/:bookId/edit', async (req, res) => {
  const foundBook = await Book.findById(req.params.bookId);
  res.render('books/edit.ejs', { book: foundBook });
});

// Route to update a book in the db
app.put('/books/:bookId', async (req, res) => {
  await Book.findByIdAndUpdate(req.params.bookId, req.body);
  res.redirect(`/books/${req.params.bookId}`);
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});