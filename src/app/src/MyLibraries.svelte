<script lang="ts">
    import type { Library, Settings } from './back/settings';
    import ApiService from './back/api-service';
    import _ from 'underscore';
    import { Icon } from 'sveltestrap';    
    import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	export let settings: Settings;

    settings.sort();
 
    let libraryName = '';
    const service = new ApiService();

    let completionOptions: Library[] = [];

    async function handleKey() {
        completionOptions = await service.listServices(libraryName, settings.libraries);
    }

    function addLibrary(library: Library) {
        settings.libraries = [... settings.libraries, library];
        libraryName = '';
        completionOptions = [];
        settings.sort();
        settings.save();
    }

    function updateLibrary(library: Library) {
        library.favourite = !library.favourite;
        settings.sort();
        settings.save();
        settings.libraries = settings.libraries;
    }

    function removeLibrary(library: Library) {
        settings.libraries = _.filter(settings.libraries, x => x.code != library.code);
        settings.save();
        settings.libraries = settings.libraries;
        library.favourite = false;
    }

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

    .library-name {
        font-size: 0.9em;
        font-weight: bold;
    }

    .favourite {
        font-weight: bold;
    }

    .search-box {
        font-family: "Readex Pro", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
    }
</style>

<div class="container">
    <nav class="fixed-top">
        <div id="header" class="row p-2">
            <div class="col text-center">
                <img src="/images/Libraree-light.png" alt="Libraree" class="small-logo" />
            </div>
            {#if settings.hasLibraries}
                <button type="button" class="btn-close" aria-label="Close" on:click={() => goHome()}></button>
            {/if}
        </div>
    </nav>
    <div id="main" class="row">
        <div class="col">
            <h2 class="text-center m-5">My Libraries</h2>
            {#if !settings.hasLibraries}
                <div class="m-5">
                    <p>Before we can find books for you, we need to know where you have library memberships.</p>
                    <p>Type in the name of your Local Authority below and we'll find their library service for you.</p>
                    <p>You can add multiple libraries and choose your favourites. Your favourite libraries will appear in the search results first.</p>
                </div>
            {/if}
            <input bind:value={libraryName} on:keyup={handleKey} placeholder="Type a Local Authority name, e.g. Wigan" class="form-control text-center search-box" />
        </div>
    </div>
    <div class="row">
        <div class="col">
            <div class="row">
                <div class="col-12">
                    <div class="list-group">
                        {#each completionOptions as option}
                        <a href="#add" on:click|preventDefault={() => addLibrary(option)} class="list-group-item list-group-item-action list-group-item-light library-name">
                            {option.name}
                        </a>
                        {/each}
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="row mt-3">
        <div class="col">
            <ul class="list-group">
                {#each settings.libraries as library}
                <li class="list-group-item p-3 d-flex w-100 justify-content-between {library.favourite ? 'favourite' : ''}">
                        {library.name}
                        <div>
                            {#if library.favourite}
                                <a class="heart mr-10" href="#favourite" on:click|preventDefault={() => updateLibrary(library)}><Icon name="heart-fill" /></a>
                            {:else}
                                <a class="heart mr-10" href="#favourite" on:click|preventDefault={() => updateLibrary(library)}><Icon name="heart" /></a>
                            {/if}
                            
                            <a href="#remove" on:click|preventDefault={() => removeLibrary(library)}><Icon name="trash-fill" /></a>
                        </div>
                </li>
                {/each}
            </ul>

            <div class="m-2 text-center">
                <small><span class="heart"><Icon name="heart-half" /></span> Your favourite libraries will appear in search results first.</small>
            </div>
            
        </div>
        {#if settings.hasLibraries}
            <div class="row">
                <div class="col text-center m-5"> 
                    <a class="primary-link" href="#search" on:click|preventDefault={() => goHome()}><Icon name="search" /> Search for a book!</a>
                </div>
            </div>
        {/if}
    </div>
</div>
