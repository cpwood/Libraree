<script lang="ts">
    import { createEventDispatcher } from 'svelte';
	import DeviceDetector from 'device-detector-js';

	const dispatch = createEventDispatcher();

	const deviceDetector = new DeviceDetector();
	const device = deviceDetector.parse(navigator.userAgent);

    function start(){
        dispatch('start');
    }

</script>

<style>
	#home {
		font-family: "Readex Pro", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
		width: 100%;
		margin: 0;
	}

	.title {
		color: rgb(206, 38, 38);
		font-size: 1.3em;
	}

	img.logo {
		width: 200px;
	}

	.wallet-logo {
		max-width: 150px;
	}

	.example {
		max-width: 95vw;
		max-height: 25vh
	}

	.qr {
		max-width: 150px;
	}
</style>

<div id="home" class="row">
	<div class="col">
		<div class="container">
			<div class="row m-2">
				<div class="col text-center title">
					<img class="logo" src="/images/Libraree-light.png" alt="Libraree" />
					<p>CARDS</p>
				</div>
			</div>
			<div class="row m-3">
				<div class="col text-center">
					<img class="example" src="/images/Example.png" alt="Example Cards" />
				</div>
			</div>
			<div class="row m-5">
				<div class="col text-center">
					<h1>Put UK library cards in your Apple or Android wallet for free.</h1>
				</div>
			</div>
			{#if device.os.name != 'iOS' && device.os.name != 'Android' && location.hostname == 'cards.libraree.org'}
				<div class="row m-5">
					<div class="col text-center">
						<img class="qr" src="/images/libraree-qr.png" alt="QR Code for cards.libraree.org" />
						<p>Scan this QR code using your phone's Camera app to get started!</p>
					</div>
				</div>
			{:else}
				<div class="row m-5">
					<div class="col text-center">
						<button id="start" class="btn btn-success" on:click={() => start()}>Get Started</button>
					</div>
				</div>
			{/if}
			<div class="row">
				<div class="col text-center">
					<img class="wallet-logo" src="/images/apple-wallet.png" alt="Apple Wallet" />
					<a href="https://walletpasses.io/" target="_blank"><img class="wallet-logo" src="/images/walletpasses.png" alt="Wallet Passes" /></a>
				</div>
			</div>
		</div>
	</div>
</div>