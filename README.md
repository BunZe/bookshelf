# bookshelf
> Its like a bookshelf, but in svelte.

bookshelf reads all files in a given directory (which was specfically structured) and creates a nice bookshelf for it for anyone to enjoy.

## Usage

### Files

In order for the books to be read correctly, the books directory shoud be structured like this:
```
mydir/
├── book1/
│   ├── manifest.json
│   ├── file.epub
│   └── otherfile.pdf
├── book2/
│   ├── manifest.json
│   ├── file.epub
│   └── otherfile.pdf
└── book3/
    ├── manifest.json
    ├── file.epub
    └── otherfile.pdf

```

- directory names don't matter
- bookshelf currently supports just EPUBs and PDFs. Their filenames dont matter, as long as they use the appropriate file extension, and a single file of each type can be found in the book's directory.

The metadata is taken from the `manifest.json` file in each book directory. A basic example would look like this:
```
{
    "title": "My Awesome Book",
    "subtitle": "The Amazing Tale of My Awesome Book",
    "author": "Awesomeman"
}
```

- The subtitle field isn't required and can be ommited.

### Configuration
This repostory comes with two environment setups, one for development and one for production.
The production environment serves both the API and the static site. The development environment as a little broken at the moment because `sirv` (Svelte's choice of astatic file server) doesn't support proxying, like CRA does, so you might need to edit links manually in the Svelte code.

The basic environment variables:

- `PUBLIC_PATH` -> Path to static site files (ONLY IF NODE_ENV == PRODUCTION).
- `BOOKS_PATH` -> Path to books directory.

##### Running

- `npm run dev` for the development server.
- `npm run api` for the API server (or the complete setup if in a production environment). <br>Use `npm run api -- -p <PORT>` to specify a specific port to bind to.

## License
MIT © byt3r.com