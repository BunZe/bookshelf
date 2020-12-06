
const {readdirSync, statSync, readFileSync} = require('fs');
const crypto = require('crypto');
const path = require('path');
const { info, success, error} = require('./helpers').logging


const MANIFEST_FILENAME = 'manifest.json';
const PDF_EXT = '.pdf';
const EPUB_EXT = '.epub';

/**
 * Creates a books array from the given directory.
 * Each book has its own directory, with an appropriate 'manifest.json' file and both epub and pdf files,
 * all in the same directory.
 * @param {*} booksDirectory Path to directory containing all books.
 */
const parseBooks = (booksDirectory) => {
    const books = new Map();
    info(`Scanning for books in ${booksDirectory}`)
    readdirSync(booksDirectory).forEach(file => {
        let bookPath = path.join(booksDirectory, file)

        if (statSync(bookPath).isDirectory) {
            const files = readdirSync(bookPath)

            // Check for the manifest.json file.
            if (files.includes(MANIFEST_FILENAME)) {
                let manifest = JSON.parse(readFileSync(path.join(bookPath, MANIFEST_FILENAME)))
                let downloads = {};
                files.forEach(file => {
                    if (path.extname(file) === PDF_EXT) {
                        downloads = {...downloads, pdf: path.join(bookPath, file)}
                    } else if (path.extname(file) === EPUB_EXT) {
                        downloads = {...downloads, epub: path.join(bookPath, file)}
                    }
                });
                
                // We hash this so download links can use the hash and stay simple. 
                const hash = crypto.createHash('md5').update(manifest.title + manifest.subtitle + manifest.author).digest('hex').slice(0, 8)
                books.set(hash, { ...manifest, downloads});
                success(`Found book "${manifest.title}"`, 1)
            }
        }
    });

    return books;
}

module.exports = parseBooks
