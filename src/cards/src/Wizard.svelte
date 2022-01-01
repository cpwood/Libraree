<script lang="ts">
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    export let title = 'Step';

    function goHome() {
        dispatch('home');
    }

</script>

<style>
    #header {
        background-color: #f7f2f5;
        width: 100%;
    }

    #header > .col {
        margin-top: 10px;
	    margin-bottom: 10px;
    }

    #main {
        padding-top: 60px;
    }

    .main-container {
        max-width: 900px;
    }

    .slot-container {
        font-size: 1.1em;
    }
</style>

<div class="main-container container">
    <nav class="fixed-top">
        <div id="header" class="row p-2">
            <div class="col text-center">
                <img src="/images/Libraree-cards.png" alt="Libraree" class="small-logo" />
            </div>
            <button type="button" class="btn-close" aria-label="Close" on:click={() => goHome()}></button>
        </div>
    </nav>
    <div id="main" class="row">
        <div class="col">
            <h2 class="text-center m-3">{title}</h2>
        </div>
    </div>
    <div class="slot-container">
        <slot></slot>
    </div>
</div>
