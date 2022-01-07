<script lang="ts">
    import type GoogleResult from './back/google-result';
    import ApiService from './back/api-service';
    import type { Settings } from './back/settings';
    import type { ServiceResult } from './back/availability-result';
    import _ from 'underscore';
    import { Icon, Accordion, AccordionItem, Badge } from 'sveltestrap';
    import Book from './Book.svelte';
    import Menu from './Menu.svelte';
    import { createEventDispatcher } from 'svelte';
    import BarcodeService from './back/barcode-service';
    import PinchZoom from './PinchZoom.svelte';

    const dispatch = createEventDispatcher();

    export let filter: string; 
    export let settings: Settings;

    let results: GoogleResult[] = [];
    let service = new ApiService();
    let screenName = 'search';
    let libraryResults: ServiceResult[] = [];
    let currentBook: GoogleResult = null;

    const barcode = new BarcodeService();
	let fileInput: HTMLInputElement;

    async function doSearch() {
        currentBook = null;
        results =[];
        screenName = 'search';
        results = await service.findTitles(filter);
        screenName = 'books';
    }

    async function getAvailability(book: GoogleResult) {
        currentBook = book;
        screenName = 'editions';
        const isbns = book.isbn ? 
            await service.getEditionsByIsbn(book.isbn) : 
            await service.getEditionsByVolumeId(book.id);

        screenName = 'availability';
        libraryResults = await service.searchLibraries(isbns, settings);

        screenName = 'results';
    }

    function launchUrl(url: string) {
        window.open(url);
    }

    function goToCredits() {
		dispatch('credits');
	}

    async function onBarcode(e) {
		const result = await barcode.readBarcode(e.target.files[0]);

		if (result) {
			filter = result;
			doSearch();
		}
	}

    const state = {
		open: false,
		doNotShow: localStorage.getItem('pinchModalHidden') == 'true'
	};

	function launchModal() {
		if (state.doNotShow) {
			closeModal();
		}
		else {
			state.open = true;
		}
	}

	function closeModal() {
		localStorage.setItem('pinchModalHidden', `${state.doNotShow}`);
		fileInput.click();
	}

    doSearch(); 
</script>

<style>
    #header {
        background-color: #f1f1f1;
        width: 100%;
        padding-left: 10px;
    }

    #main {
        padding-top: 120px
    }

    #progress {
        max-height: 150px;
    }

    .progress-margin {
        margin-top: 150px;
    }

    .progress-text {
        font-family: "Readex Pro", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
    }

    .search-box {
        font-family: "Readex Pro", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
    }

    .accordian-container {
        padding: 16px;
    }

    .accordian-header {
        font-family: "Readex Pro", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
        float: left;
        width: 100%;
    }

    .accordian-header-badge {
        float: right;
        margin-right: 50px;
    }

    td.fixed {
        font-family: 'Roboto Mono';
    }

    td.available {
        font-family: "Readex Pro", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
    }

    tr.is-available {
        cursor: pointer;
    }

    tr.not-available {
        color: rgb(79, 78, 78);
    }

    table {
        font-size: 0.9em;
    }

    .back {
        border: none;
        position: absolute;
        left: 20px;
        z-index: 1000;
        top: 10px;
        background-color: rgba(0, 0, 0, 0);
    }

    .back:focus {
        border: none !important;
    }

    .submit {
        min-width: 50px;
    }

    #fileInput {
		display: none;
	}
</style>

<div>
    <nav class="fixed-top">
        {#if screenName == 'results'}
            <button class="back" on:click={() => screenName = 'books'}><Icon name="chevron-left" /></button>
        {/if}
        <Menu 
            on:my-libraries={() => dispatch('my-libraries')}
            on:credits={() => goToCredits()}
             />
        <div id="header" class="row">
            <div class="col-12 text-center">
                <img src="/images/Libraree-light.png" alt="Libraree" class="small-logo" />
            </div>
            <form>
                <div class="col-12 input-group">
                    <input type="search" bind:value={filter} class="form-control search-box" placeholder="Book title, author or ISBN" enterkeyhint="search" />
                    <div class="input-group-append">
                        <button type="submit" class="btn btn-secondary submit ml-10" on:click|preventDefault={() => doSearch()}><Icon name="search" /></button>
                        <button type="submit" class="btn btn-secondary submit" on:click|preventDefault={() => launchModal()}><img class="barcode" src="/images/barcode.png" alt="Scan barcode"></button>
                    </div>
                </div>
            </form>
        </div>
    </nav>
    <div id="main" class="row">
        {#if screenName == 'search'} 
            <div class="text-center progress-margin">
                <img id="progress" src="/images/progress-anim.gif" alt="Working.." />
                <p class="progress-text">Searching for books..</p>
            </div>
        {:else if screenName == 'books' && !results} 
            <div class="text-center">
                <h2>No results found</h2>
            </div>
        {:else if screenName == 'books' && results} 
            {#each results as result}
                <div class="col-md-6">
                    <Book book={result} showAvailability={true} on:check-availability={(e) => getAvailability(e.detail)} />
                </div>
            {/each}    
        {:else if screenName == 'editions' || screenName == 'availability'}
            <div class="col">
                <Book book={currentBook} />
            
                <div class="text-center">
                    <img id="progress" src="/images/progress-anim.gif" alt="Working.." />
                    <p class="progress-text">{screenName == 'editions' ? 'Finding editions..' : 'Checking your libraries..'}</p>
                </div>
            </div>
        {:else}
            <div class="col">
                <Book book={currentBook} />
            
                {#if libraryResults.length > 0}
                    <div class="accordian-container">
                        <Accordion flush>
                            {#each libraryResults as result}
                                <AccordionItem>
                                    <div class="accordian-header" slot="header">
                                        <span>
                                            {result.service} 
                                            {#if settings.isFavourite(result.code)}
                                                <span class="heart ml-10"><Icon name="heart-fill" /></span>
                                            {/if}
                                        </span> 
                                        <div class="accordian-header-badge">
                                            <Badge pill color={_.reduce(result.items, (total, item) => total + item.available, 0) > 0 ? 'success' : 'secondary'}>
                                                {_.reduce(result.items, (total, item) => total + item.available, 0)}
                                                of
                                                {_.reduce(result.items, (total, item) => total + item.total, 0)}
                                            </Badge>
                                        </div>
                                    </div>
                                    <table class="table table-hover">
                                        <thead>
                                            <tr>
                                                <th scope="col">Library</th>
                                                <th scope="col" class="d-none d-md-block">ISBN</th>
                                                <th scope="col" class="d-block d-md-none">ISBN</th>
                                                <th scope="col">Available</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {#each result.items as item}
                                                <tr class={item.available > 0 ? 'is-available' : 'table-light not-available'} on:click={() => launchUrl(item.url)}>
                                                    <td>{item.library}</td>
                                                    <td class="fixed d-none d-md-block">{item.isbn}</td>
                                                    <td class="fixed d-block d-md-none">{item.isbn.slice(item.isbn.length - 3)}</td>
                                                    <td class="available"><Badge pill color={item.available > 0 ? 'success' : 'secondary'}>{item.available} of {item.total}</Badge></td>
                                                </tr>
                                            {/each}
                                        </tbody>
                                    </table>
                                </AccordionItem>
                            {/each}
                        </Accordion>
                    </div>
                {:else}
                <div class="text-center m-5">
                    <p class="progress-text">None of your libraries stock this book.</p>
                </div>
                {/if}
            </div>
        {/if}
    </div>
</div>

<input bind:this={fileInput} id="fileInput" type="file" accept=".jpg, .jpeg, .png" on:change={(e)=>onBarcode(e)} capture={true} />

<PinchZoom {state} on:close={() => closeModal()} />