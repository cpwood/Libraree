<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import type CardContext from './back/CardContext';
    import { Screen } from './back/Screens';

	const dispatch = createEventDispatcher();

	export let context: CardContext;

    function next() {
        context.screen = Screen.FullPhoto;
        dispatch('next');
    }
</script>

<style>


</style>

<div class="row">
    <div class="col">
        <div class="m-3">
            <p>Great! Let's set up a library card in your wallet for <strong>{context.library.name}</strong>.</p>
        </div>
    </div>
</div>
<div class="row">
    <div class="col">
        <div class="m-3">
            <input type="text" bind:value={context.number} placeholder="Card Number" class="form-control text-center" />
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
