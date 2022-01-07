<script lang="ts">
    import { createEventDispatcher } from 'svelte';
	import { Icon } from 'sveltestrap';
	import PwaInstaller from './back/pwa-installer';
	import Menu from './Menu.svelte';
	import BarcodeService from './back/barcode-service';
	import PinchZoom from './PinchZoom.svelte';
	import DeviceDetector from 'device-detector-js';

	const dispatch = createEventDispatcher();
	const barcode = new BarcodeService();

	const deviceDetector = new DeviceDetector();
	const device = deviceDetector.parse(navigator.userAgent);

	let fileInput: HTMLInputElement;
	
	let installed = PwaInstaller.isInstalled;
    PwaInstaller.addEventListener((isInstalled: boolean) => installed = isInstalled);

    let filter = '';

	window.document.body.classList.toggle('home');

    function doSearch(){
        dispatch('search', filter);
		window.document.body.classList.toggle('home');
		window.document.body.classList.add('transition');
    }

	function configureLibraries() {
		dispatch('my-libraries');
		window.document.body.classList.toggle('home'); 
		window.document.body.classList.add('transition');
	}

	function goToCredits() {
		dispatch('credits');
		window.document.body.classList.toggle('home');
		window.document.body.classList.add('transition');
	}

	const state = {
		open: false,
		doNotShow: localStorage.getItem('pinchModalHidden') == 'true'
	};

	function launchModal() {
		if (state.doNotShow) {
			closeModal();
		}
		else {
			state.open = true;
		}
	}

	function closeModal() {
		localStorage.setItem('pinchModalHidden', `${state.doNotShow}`);
		fileInput.click();
	}

	async function onBarcode(e) {
		const result = await barcode.readBarcode(e.target.files[0]);

		if (result) {
			filter = result;
			doSearch();
		}
	}
</script>

<style>
	#home {
		color: white;
		font-family: "Readex Pro", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
		height:90vh; 
		position:relative;
		width: 100%;
		margin: 0;
	}

	.vertical-middle {
		position: absolute; 
		top: 50%; 
		transform: translateY(-50%);
	}

	img.logo {
		width: 200px;
	}

	.installer {
		width: 100%;
		text-align: center;
		margin-top: 50px;
	}

	.installer a {
		color: white;
	}

	.installer a:hover {
		color: white;
	}

	.installer a:visited {
		color: white;
	}

	#fileInput {
		display: none;
	}
</style>

<Menu colour="white" 
	on:my-libraries={() => configureLibraries()} 
	on:credits={() => goToCredits()}
	/>

<div id="home" class="row">
	<div class="col vertical-middle">
		<div class="container">
			<div class="row m-2">
				<div class="col text-center">
					<img class="logo" src="/images/Libraree-darkshade.png" alt="Libraree" />
					<p>Search for books in UK libraries.</p>
				</div>
			</div>
			<div class="row">
				<form>
					<div class="col input-group">
						
							<input type="search" placeholder="Title, author or ISBN"
							bind:value={filter} class="form-control text-center"
							enterkeyhint="search" />
							<div class="input-group-append">
								<button type="submit" class="btn btn-secondary ml-10" on:click|preventDefault={() => doSearch()}><Icon name="search" /></button>
								{#if device.os.name == 'iOS' || device.os.name == 'Android'}
									<button type="submit" class="btn btn-secondary" on:click|preventDefault={() => launchModal()}><img class="barcode" src="/images/barcode.png" alt="Scan barcode"></button>
								{/if}
							</div>
						
					</div>
				</form>
			</div>
			{#if !PwaInstaller.isStandalone && !installed}
				<div class="row installer">
					<div class="col">
						<a href="#install" on:click|preventDefault={() => PwaInstaller.install()}><Icon name="cloud-download-fill" /> Install the App!</a>
					</div>
				</div>
			{/if}
			<div class="row installer">
				<div class="col">
					<a href="https://cards.libraree.org" target="_blank"><Icon name="credit-card" /> Add a library card to Apple Wallet</a>
				</div>
			</div>
		</div>
	</div>
</div>

<input bind:this={fileInput} id="fileInput" type="file" accept=".jpg, .jpeg, .png" on:change={(e)=>onBarcode(e)} capture={true} />

<PinchZoom {state} on:close={() => closeModal()} />