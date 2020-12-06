const chalk = require("chalk");
const express = require("express");
const { green, red, blue } = require("chalk");
const { statSync, stat } = require("fs");
const yargs = require("yargs");
const { hideBin } = require("yargs/helpers");
const path = require("path");

/**
 * Setup the static site serving (for production).
 */
const setupStaticServing = (app) => {
  const publicDirectory = process.env.PUBLIC_PATH;

  checkPathForDirectory(publicDirectory, "Public", {
    success: () => {
      app.use(express.static(publicDirectory));
      logging.info(
        `Running in production mode. Serving static site from ${path.resolve(
          publicDirectory
        )}`
      );
    },
    error: () => {
      logging.error(
        `Can't serve static site. This means you are trying to run in a production environment, but have misconfigured the 'PUBLIC_PATH' environment variable.`
      );
      process.exit(1);
    },
  });
};

/**
 * Parses the given arguments are valid and returns an arguments object.
 * Exits with status code 1 on error.
 */
const getArguments = () => {
  // Set up yer arguments with yargs!
  const argv = yargs(hideBin(process.argv))
    .usage("Usage: $0 --port <PORT>")
    .alias("p", "port")
    .describe("p", "Port to run the server on (host is always 0.0.0.0).")
    .default("p", 3000)
    .alias("h", "help").argv;

  if (!(argv.port != null && argv.port > 0 && argv.port < 65535)) {
    console.log("Invalid port given.");
    process.exit(1);
  }

  // Check arguments from environment variables too.
  const booksDirectory = process.env.BOOKS_PATH;
  checkPathForDirectory(booksDirectory, "Books", {
    success: () => (argv.booksDirectory = path.resolve(booksDirectory)),
    error: () => {
      logging.error("Check the 'BOOKS_DIR' environment variable");
      process.exit(1);
    },
  });

  return argv;
};

/**
 * Check a given path is a directory.
 * @param {*} dirPath Path to directory
 * @param {*} title Title of directory, e.g "Books"
 * @param {*} success Success callback, happens if  path is a directory.
 * @param {*} error  Error callback, called if path is not a directory.
 */
const checkPathForDirectory = (dirPath, title, { success, error }) => {
  try {
    if (!dirPath) throw `No ${title} directory given!`;
    if (!statSync(path.resolve(dirPath)).isDirectory())
      throw `${dirPath} is not a directory!`;
    success();
  } catch (e) {
    logging.error(`Invalid ${title} directory. ${e}`);
    error();
  }
};

/**
 * Crafts a nice, usable filename for the recieving client.
 * Basically concatinates title and subtitle with dashes instead of spaces.
 * @param {*} book The Book object
 * @param {*} extension The file extension (Either 'epub' or 'pdf')
 */
const craftFileName = (book, extension) => {
  const { title, subtitle } = book;
  return `${title}-${subtitle}.${extension}`.split(" ").join("-");
};

/**
 *  Print a welcome message.
 */
const welcomeMessage = () => {
  //Cool ASCII Art title thingy
  console.log(
    chalk.green(`
 _                 _        _          _  __
| |__   ___   ___ | | _____| |__   ___| |/ _|
| '_ \\ / _ \\ / _ \\| |/ / __| '_ \\ / _ \\ | |_
| |_) | (_) | (_) |   <\\__ \\ | | |  __/ |  _|
|_.__/ \\___/ \\___/|_|\\_\\___/_| |_|\\___|_|_|

`)
  );
};

/**
 * Neat helpers for logging with colors and emojis.
 */
const logging = {
  info: (msg, pad = 0) => {
    console.log("\t".repeat(pad) + blue("🔹 " + msg));
  },
  error: (msg, pad = 0) => {
    console.log("\t".repeat(pad) + red("❌  " + msg));
  },
  success: (msg, pad = 0) => {
    console.log("\t".repeat(pad) + green("✔️  " + msg));
  },
};

module.exports = {
  welcomeMessage,
  craftFileName,
  getArguments,
  setupStaticServing,
  logging,
};
