# Libraree
Search for books in UK libraries at [libraree.org](https://libraree.org).

## Background

The Libraree web site and app was created by me, Chris Wood, as a personal project. I'm a software developer by profession, but also a lover of books and public libraries.

I live on the boundaries of several Local and Unitary Authorities so I'm a member of several different library services, including Wigan, Manchester and Lancashire. So whenever there's a book I'd like to read, I would end up searching each library service's catalogue individually.

Having discovered a [code library](https://github.com/LibrariesHacked/catalogues-library) written by the [Libraries Hacked](https://www.librarieshacked.org/) project that allows library catalogues to be searched by apps instead of humans, I realised that it would be possible to create an app that could search across all my local library services in one go. Libraree is that app!



## Technical Context

Libraree was written with [Svelte](https://svelte.dev/)

It relies on the [catalogues-library package](https://github.com/LibrariesHacked/catalogues-library) written by the [Libraries Hacked](https://www.librarieshacked.org/) project for catalogue data, together with the [Google Books API](https://developers.google.com/books/docs/overview) for book information and cover images and the [the ThingISBN API](https://wiki.librarything.com/index.php/LibraryThing_APIs) from [LibraryThing](https://www.librarything.com/) for ISBN data.
