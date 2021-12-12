<script lang="ts">
    import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

    function goHome() {
        dispatch('home');
    }

</script>

<style>
    #header {
        background-color: #f1f1f1;
        width: 100%;
    }

    #main {
        padding-top: 60px
    }
</style>

<div class="container">
    <nav class="fixed-top">
        <div id="header" class="row p-2">
            <div class="col text-center">
                <img src="/images/Libraree-light.png" alt="Libraree" class="small-logo" />
            </div>
            <button type="button" class="btn-close" aria-label="Close" on:click={() => goHome()}></button>
        </div>
    </nav>
    <div id="main" class="row">
        <div class="col">
            <h2 class="text-center m-5">About Libraree</h2>
            <div class="card m-2">
                <div class="card-body">
                    <p>
                        The Libraree web site and app was created by me, Chris Wood, as a
                        personal project. I'm a software developer by profession, but also a lover
                        of books and public libraries.
                    </p>
                    <p>
                        I live on the boundaries of several Local and Unitary Authorities so I'm
                        a member of several different library services, including Wigan, Manchester and 
                        Lancashire. So whenever there's a book I'd like to read, I would end up searching
                        each library service's catalogue individually.
                    </p>
                    <p>
                        Having discovered a <a class="primary-link" href="https://github.com/LibrariesHacked/catalogues-library" target="_blank">code library</a> written by the <a class="primary-link" href="https://www.librarieshacked.org/" target="_blank">Libraries Hacked</a> project that allows library catalogues to be
                        searched by apps instead of humans, I realised that it would be possible to create
                        an app that could search across all my local library services in one go. Libraree
                        is that app!
                    </p>
                </div>
            </div>
        </div>
    </div>
    <div class="row">
        <div class="col">
            <div class="card m-2">
                <div class="card-body text-center">
                    <p>Libraree was written with <a class="primary-link" href="https://svelte.dev/" target="_blank">Svelte</a></p>
                    <p>
                        It relies on the <a class="primary-link" href="https://github.com/LibrariesHacked/catalogues-library" target="_blank">catalogues-library package</a> written by the <a class="primary-link" href="https://www.librarieshacked.org/" target="_blank">Libraries Hacked</a> project
                        for catalogue data, together with the <a class="primary-link" href="https://developers.google.com/books/docs/overview" target="_blank">Google Books API</a>
                        for book information and cover images and the <a class="primary-link" href="https://wiki.librarything.com/index.php/LibraryThing_APIs" target="_blank">the ThingISBN API</a> from <a class="primary-link" href="https://www.librarything.com/" target="_blank">LibraryThing</a> for ISBN data.
                    </p>
                    <p>
                        Libraree is an open source project. <a class="primary-link" href="https://github.com/cpwood/libraree/" target="_blank">Get involved over at GitHub!</a>
                    </p>
                </div>
            </div>
        </div>
    </div>
</div>
