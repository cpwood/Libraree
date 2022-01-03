<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import _ from 'underscore';
    import { BARCODES } from './back/Barcode';
    import type CardContext from './back/CardContext';
    import { Screen } from './back/Screens';

	const dispatch = createEventDispatcher();

	export let context: CardContext;
    let invalid = false;

    function next() {
        if (context.library.barcode != undefined && context.library.barcode.isValid(context.number)) {
            context.screen = Screen.Name;
            context.scannedNumber = context.library.barcode.render(context.number);
            context.discovered = false;
            context.type = _.find(BARCODES, x => x.type == context.library.barcode.type);

            dispatch('next');
        }
        else if (context.library.barcode != undefined && !context.library.barcode.isValid(context.number)) {
            invalid = true;
        }
        else {
            context.screen = Screen.FullPhoto;
            dispatch('next');
        }
    }
</script>

<style>
    .error {
        display: none;
        color: red;
    }

    .invalid {
        display: inline;
    }
</style>

<div class="row">
    <div class="col">
        <div class="m-3">
            <p>Let's set up a library card in your wallet for <strong>{context.library.name}</strong>.</p>
        </div>
    </div>
</div>
<div class="row">
    <div class="col">
        <div class="m-3">
            <input type="text" bind:value={context.number} placeholder="Card Number" class="form-control text-center" />
            <p class="error" class:invalid={invalid}>Sorry, this number appears to be invalid.</p>
        </div>
    </div>
</div>
<div class="row">
    <div class="col">
        <div class="m-3">
            <p>Type in your library card number as it appears on your physical card.</p>
            <p>Don't worry, the details you enter won't leave your phone or be shared with anybody.</p>
        </div>
    </div>
</div>
<div class="row">
    <div class="col">
        <div class="m-5 text-center">
            <button class="btn btn-success" on:click={() => next()} disabled={!context.number}>Next</button>
        </div>
    </div>
</div>
