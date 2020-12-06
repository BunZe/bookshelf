#!/bin/env node
const express = require("express");
require("dotenv").config();
const parseBooks = require("./fsparser");
const path = require("path");
const cors = require("cors");
const {
  getArguments,
  craftFileName,
  welcomeMessage,
  setupStaticServing,
} = require("./helpers");
const { success, error } = require("./helpers").logging;

// Check and set arguments.
const argv = getArguments();
const {booksDirectory, port: listenPort} = argv;

// Initalize express and middlewares.
const app = express();

// Cool ASCII Art
welcomeMessage();

// Serve static files (a.k.a the actual site) if in production environment.
if (process.env.NODE_ENV === "production") {
  setupStaticServing(app);
} else {
  // For 2-Server development config (frontend development server and this server).
  app.use(cors());
}

// Scan and index books from filesystem.
let books = null;
try {
  books = parseBooks(booksDirectory);
} catch (err) {
  error("There was an exception parsing the books from the filesystem.");
  console.error(err);
  process.exit(1);
}

/**
 *  Get all books with their metadata.
 */
app.get("/books", (req, res) => {
  res.json(
    // Add key and format downloads section for the response.
    Array.from(books.entries()).map(([key, { title, subtitle, author }]) => ({
      key,
      title,
      subtitle,
      author,
      downloads: {
        pdf: path.join("downloads", key + ".pdf"),
        epub: path.join("downloads", key + ".epub"),
      },
    }))
  );
});

/**
 * Get a book's download file based on hash and extension.
 */
app.get("/downloads/:file", (req, res) => {
  file = req.params.file;
  // Check if proper filename (hash + extension)
  if (/^[0-z]{8}\.(epub|pdf)$/.test(file)) {
    const [key, extension] = file.split(".");
    const book = books.get(key);
    res.download(book.downloads[extension], craftFileName(book, extension));
  } else {
    res.sendStatus(404);
  }
});

/*
 * Handle all other requests, straight to 404.
 */
app.use((req, res) => {
  res.sendStatus(404);
});

app
  .listen(listenPort, () => {
    success(`Server running at http://0.0.0.0:${listenPort}`);
  })
  .on("error", (e) => {
    if (e.code === "EADDRINUSE") {
      error(`Port ${listenPort} is already in use.`);
    } else {
      error(e);
    }
  });
