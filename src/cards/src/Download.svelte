<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import type CardContext from './back/CardContext';
    import { Screen } from './back/Screens';

	const dispatch = createEventDispatcher();

	export let context: CardContext;
    let confirmed = false;

    function download(): boolean {
        if (!confirmed) return false;

        const reader = new FileReader();

        reader.onload = (e) => {
            window.location.href = reader.result as string;
        };

        reader.readAsDataURL(context.pass);
    }

    function next() {
        context.screen = Screen.Home;
        dispatch('next');
    }

</script>

<style>
    .alert {
        font-weight: bold;
    }

    .disabled {
        cursor: not-allowed;
        opacity: 0.2;
    }

    .wallet-logo {
		max-width: 150px;
	}

    label {
        margin-bottom: 5px;
        margin-left: 18px;
    }

    label input[type='checkbox'] {
        margin-left: -18px;
    }

    .mt20 {
        margin-top: 20px;
    }
</style>

<div class="row mt20">
    <div class="col">
        <div class="m-3">
            <p>To help us make this process a little easier for others in the future, we've recorded that {context.library.name} libraries use a "{context.type.name}" barcode. No personal information has been shared or stored.</p>
        </div>
    </div>
</div>
<div class="row">
    <div class="col">
        <div class="alert alert-warning m-3" role="alert">
            <label><input type="checkbox" bind:checked={confirmed}> I understand that I should continue to carry my physical card until I've confirmed that my electronic card works OK.</label>
        </div>
    </div>
</div>
<div class="row">
    <div class="col text-center m-3">
        <a href="download" on:click|preventDefault={() => download()}>
            <img class:disabled={!confirmed} class="wallet-logo" src="/images/add-to-apple-wallet.png" alt="Apple Wallet" />
            <img class:disabled={!confirmed} class="wallet-logo" src="/images/add-to-walletpasses.png" alt="Wallet Passes" />
        </a>
    </div>
</div>
<div class="row mt20">
    <div class="col text-center">
        <button class="btn btn-success" on:click={() => next()} disabled={!context.number}>Done</button>
    </div>
</div>
