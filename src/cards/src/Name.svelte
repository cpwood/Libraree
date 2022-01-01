<script lang="ts">
    import { createEventDispatcher, onMount } from 'svelte';
    import ApiService from './back/ApiService'; 
    import type CardContext from './back/CardContext';
    import { Screen } from './back/Screens';

	const dispatch = createEventDispatcher();

    let generating = false;
    let canvas: HTMLCanvasElement;
    let apiService = new ApiService();
    let input: HTMLInputElement;

	export let context: CardContext;

    async function next() {
        // Generate the card!
        generating = true;

        await context.generateJson();
        await context.generateBarcodes(canvas);
        await apiService.generatePass(context);

        context.screen = Screen.Download;

        console.log(context);

        dispatch('next');
    }

    onMount(() => input.focus());
</script>

<style>
    #progress {
        max-height: 150px;
    }

    canvas {
        display: none;
    }
</style>

<div class="row">
    <div class="col">
        <div class="m-3">
            <p>To complete your library card, we just need your name:</p>
        </div>
    </div>
</div>
<div class="row">
    <div class="col">
        <div class="m-3">
            <input bind:this={input} type="text" bind:value={context.name} placeholder="Your Name" class="form-control text-center" />
        </div>
    </div>
</div>
<div class="row">
    <div class="col">
        {#if !generating}
            <div class="m-5 text-center">
                <button class="btn btn-success" on:click={() => next()} disabled={!context.number}>Next</button>
            </div>
        {:else}
            <div class="m-5 text-center">
                <p><img id="progress" src="/images/progress-anim.gif" alt="Working.." /></p>
            </div>
        {/if}
    </div>
</div>
<canvas bind:this={canvas}></canvas>