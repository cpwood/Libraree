<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import type CardContext from './back/CardContext';
    import { Screen } from './back/Screens';
    import { Icon } from 'sveltestrap';

	const dispatch = createEventDispatcher();

	export let context: CardContext;

    function crop() {
        context.screen = Screen.ZoomCrop;
        dispatch('next');
    }

    function photo() {
        context.screen = Screen.FullPhoto;
        dispatch('next');
    }

</script>

<style>
    .btn-normal {
        border: 1px solid silver;
        background-color: ghostwhite;
    }

</style>

<div class="row">
    <div class="col">
        <div class="m-3">
            <p>Unfortunately, we've not been able to match the barcode to the number you entered.</p>
            <p>You can try one of the following:</p>
        </div>
    </div>
</div>
<div class="row">
    <div class="col">
        <div class="m-5 text-center">
            <button class="btn btn-normal" on:click={() => photo()} disabled={!context.number}><Icon name="camera-fill" /> Take a new photo</button>
        </div>
    </div>
</div>
<div class="row">
    <div class="col">
        <div class="m-5 text-center">
            <button class="btn btn-success" on:click={() => crop()} disabled={!context.number}><Icon name="arrows-move" /> Reposition the photo</button>
        </div>
    </div>
</div>

