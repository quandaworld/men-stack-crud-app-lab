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

app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
app.use(morgan("dev"));
app.use(express.static('public')); // static assets middleware

// Route to homepage
app.get('/', async (req, res) => {
  res.render('index.ejs');
});

// Route to add a book form
app.get('/books/new', (req, res) => {
  res.render('books/new.ejs');
});

// Route to receive form submissions
app.post('/books', async (req, res) => {
  await Book.create(req.body);
  res.redirect('/books')
});

// Index route to send a page that lists all books from the db
app.get('/books', async (req, res) => {
  const allBooks = await Book.find({});
  res.render('books/index.ejs', { books: allBooks });
});

app.get('/books/:bookId', async (req, res) => {
  const foundBook = await Book.findById(req.params.bookId);
  res.render('books/show.ejs', { book: foundBook });
});

app.delete('/books/:bookId', async (req, res) => {
  await Book.findByIdAndDelete(req.params.bookId);
  res.redirect("/books");
});

app.get('/books/:bookId/edit', async (req, res) => {
  const foundBook = await Book.findById(req.params.bookId);
  res.render('books/edit.ejs', { book: foundBook });
});

app.put('/books/:bookId', async (req, res) => {
  await Book.findByIdAndUpdate(req.params.bookId, req.body);
  res.redirect(`/books/${req.params.bookId}`);
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});