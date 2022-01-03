<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import ApiService from './back/ApiService'; 
    import { BARCODES } from './back/Barcode';
    import type CardContext from './back/CardContext';
    import { LIBRARIES } from './back/Library';
    import { Screen } from './back/Screens';

	const dispatch = createEventDispatcher();

    let generating = false;
    let canvas: HTMLCanvasElement;
    let apiService = new ApiService();

	export let context: CardContext;

    context.number = '12345678';

    async function next() {
        // Generate the card!
        generating = true;

        context.scannedNumber = context.type.type == 'codabar' ? `A${context.number}B` : context.number;

        await context.generateJson();
        await context.generateBarcodes(canvas);
        await apiService.generatePass(context);

        context.screen = Screen.Download;

        console.log(context);

        dispatch('next');
    }
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
            <select bind:value={context.library} class="form-control form-select">
                {#each LIBRARIES as service}
                    <option value={service}>
                        {service.name}
                    </option>
                {/each}
            </select>
        </div>
    </div>
</div>
<div class="row">
    <div class="col">
        <div class="m-3">
            <input type="text" bind:value={context.number} placeholder="Entered Number" class="form-control text-center" />
        </div>
    </div>
</div>
<div class="row">
    <div class="col">
        <div class="m-3">
            <select bind:value={context.type} class="form-control form-select">
                {#each BARCODES as barcode}
                    <option value={barcode}>
                        {barcode.name}
                    </option>
                {/each}
            </select>
        </div>
    </div>
</div>
<div class="row">
    <div class="col">
        <div class="m-3">
            <input type="text" bind:value={context.name} placeholder="Name" class="form-control text-center" />
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