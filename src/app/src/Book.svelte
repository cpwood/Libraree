<script lang="ts">
    import type GoogleResult from './back/google-result';
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    export let book: GoogleResult;
    export let showAvailability = false;

    const fakeColours = [
        '#054a91',
        '#3e7cb1',
        '#81a4cd',
        '#dbe4ee',
        '#f17300'
    ];

    function checkAvailability() {
        if (showAvailability)
            dispatch('check-availability', book);
    }

    function getFakeColour(): string {
        const index = Math.floor(Math.random() * fakeColours.length);
        return fakeColours[index];
    }
</script>

<style>
    .title {
        font-family: "Readex Pro", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
        font-size: 1.1em;
    }

    .subtitle {
        font-family: "Readex Pro", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
	    color: rgb(116, 116, 116);
        font-size: 0.9em;
    }

    .cover {
        max-height: 150px;
        max-width: 100%;
    }
    
    .cover-content {
        display: flex;
        align-items: center;
    }

    .book-content {
        display: flex;
        align-items: center;
    }

    .card {
        min-height: 155px;
    }

    .card-link:hover {
        background-color: whitesmoke;
        cursor: pointer;
    }

    .fake-cover {
        background-image: url('/images/fabric.png');
    }
</style>

<div class="card m-2 {showAvailability ? 'card-link' : ''}" on:click={() => checkAvailability()}>
    <div class="card-body">
        <div>
            <div class="row">
                <div class="col-3 cover-content">
                    {#if book.smallThumbnail}
                        <img class="cover" src={book.smallThumbnail} alt={book.title} />
                    {:else}
                        <img class="cover fake-cover" src="/images/no-cover.png" alt={book.title} style="background-color: {getFakeColour()}" />
                    {/if}
                </div>
                <div class="col-9 p-3 book-content">
                    <div>
                        <span class="title">{book.title}</span><br>

                        {#if book.subtitle}
                            <span class="subtitle">{book.subtitle}</span><br>
                        {/if}
                
                        {#if book.authors}
                            {#each book.authors as author}
                                <span>{author}</span><br>
                            {/each}
                        {/if}
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>