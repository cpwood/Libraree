# Libraree
* Search for books in UK libraries at [libraree.org](https://libraree.org).
* Add your library cards to your Apple Wallet at [cards.libraree.org](https://cards.libraree.org).

## Background

The Libraree web site and app was created by me, Chris Wood, as a personal project. I'm a software developer by profession, but also a lover of books and public libraries.

I live on the boundaries of several Local and Unitary Authorities so I'm a member of several different library services, including Wigan, Manchester and Lancashire. So whenever there's a book I'd like to read, I would end up searching each library service's catalogue individually.

Having discovered a [code library](https://github.com/LibrariesHacked/catalogues-library) written by the [Libraries Hacked](https://www.librarieshacked.org/) project that allows library catalogues to be searched by apps instead of humans, I realised that it would be possible to create an app that could search across all my local library services in one go. Libraree is that app!

Later, I created an online tool that allows you to add branded library cards to Apple Wallet. [Libraree Cards](https://cards.libraree.org) supports all the major barcode systems used by UK public libraries and goes beyond the basic barcodes ordinarily available within Apple Wallet.

## Technical Context

Libraree and Libraree Cards were written with [Svelte](https://svelte.dev/)

The main Libraree app relies on the [catalogues-library package](https://github.com/LibrariesHacked/catalogues-library) written by the [Libraries Hacked](https://www.librarieshacked.org/) project for catalogue data, together with the [Google Books API](https://developers.google.com/books/docs/overview) for book information and cover images and the [the ThingISBN API](https://wiki.librarything.com/index.php/LibraryThing_APIs) from [LibraryThing](https://www.librarything.com/) for ISBN data.

Libraree Cards has no formal relationship with the UK's library services and uses their brands with respect and admiration!