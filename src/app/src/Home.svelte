<script lang="ts">
    import { createEventDispatcher } from 'svelte';
	import { Icon } from 'sveltestrap';
	import PwaInstaller from './back/pwa-installer';
	import Menu from './Menu.svelte';

	const dispatch = createEventDispatcher();
	
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
								<button type="submit" class="btn btn-secondary ml-10" on:click={() => { doSearch(); return false; }}><Icon name="search" /></button>
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
		</div>
	</div>
</div>