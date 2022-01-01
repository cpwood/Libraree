<script lang="ts">
    import type Library from './back/Library';
    import ApiService from './back/ApiService'; 
    import { createEventDispatcher, onMount } from 'svelte';
    import type CardContext from './back/CardContext';
    import { Screen } from './back/Screens';

	const dispatch = createEventDispatcher();

	export let context: CardContext;
    let input: HTMLInputElement;
 
    let libraryName = '';
    const service = new ApiService();

    let completionOptions: Library[] = [];

    async function handleKey() {
        completionOptions = await service.listServices(libraryName, []);
    }

    function selectLibrary(library: Library) {
        context.library = library;
        completionOptions = [];
        context.screen = Screen.Number;
        dispatch('next');
    }
    
    onMount(() => input.focus());
</script>

<style>
    .library-name {
        font-size: 0.9em;
        font-weight: bold;
    }

    .search-box {
        font-family: "Readex Pro", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
    }

    .mt20 {
        margin-top: 20px;
    }
</style>

<div class="row">
    <div class="col">
        <div class="m-5">
            <p>Which UK public library issued your card?</p>
        </div>
    </div>
</div>
<div class="row mt20">
    <div class="col">
        <div>
            <input bind:this={input} bind:value={libraryName} on:keyup={handleKey} placeholder="Type a Local Authority name, e.g. Wigan" class="form-control text-center search-box" />
        </div>
    </div>
</div>
<div class="row">
    <div class="col">
        <div class="list-group">
            {#each completionOptions as option}
            <a href="#add" on:click|preventDefault={() => selectLibrary(option)} class="list-group-item list-group-item-action list-group-item-light library-name">
                {option.name}
            </a>
            {/each}
        </div>
    </div>
</div>