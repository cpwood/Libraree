<script lang="ts">
	import Home from './Home.svelte';
	import { Screen } from './back/Screens';
	import CardContext from './back/CardContext';
	import Wizard from './Wizard.svelte';
	import Authority from './Authority.svelte';
	import Number from './Number.svelte';
	import FullPhoto from './FullPhoto.svelte';
	import ZoomCrop from './ZoomCrop.svelte';
	import Working from './Working.svelte';
	import Name from './Name.svelte';
	import Download from './Download.svelte';
	import Support from './Support.svelte';
	import QuickCreate from './QuickCreate.svelte';
	import { LIBRARIES } from './back/Library';

	let context = new CardContext();

	function start() {
		context = new CardContext();
		context.screen = Screen.Authority;
	}

	function quickCreate() {
		context = new CardContext();
		context.screen = Screen.QuickCreate;
	}

	function next() {
		context.screen = context.screen;
	}

	if (location.hash != undefined) {
		const library = LIBRARIES.find(x => x.code == location.hash.substring(1));

		if (library) {
			context.library = library;
			context.screen = Screen.Number;
			history.pushState(null, '', '/');
		}
	}

</script>

<style>
	main {
		padding: 0;
		margin: 0;
	}
</style>


<main>
	{#if context.screen == Screen.Home}
		<Home on:start={() => start()} on:quickCreate={() => quickCreate()}></Home>
	{:else if context.screen == Screen.Authority}
		<Wizard title="Choose your library service." on:home={() => context.screen = Screen.Home }>
			<Authority context={context} on:next={() => next()} />
		</Wizard>
	{:else if context.screen == Screen.Number}
		<Wizard title="Enter your card number." on:home={() => context.screen = Screen.Home }>
			<Number context={context} on:next={() => next()} />
		</Wizard>
	{:else if context.screen == Screen.FullPhoto}
		<Wizard title="Take a photo of your card." on:home={() => context.screen = Screen.Home }>
			<FullPhoto context={context} on:next={() => next()} />
		</Wizard>
	{:else if context.screen == Screen.ZoomCrop}
		<Wizard title="Adjust your photo." on:home={() => context.screen = Screen.Home }>
			<ZoomCrop context={context} on:next={() => next()} />
		</Wizard>
	{:else if context.screen == Screen.Working}
		<Wizard title="Checking the barcode.." on:home={() => context.screen = Screen.Home }>
			<Working context={context} on:next={() => next()} />
		</Wizard>
	{:else if context.screen == Screen.Name}
		<Wizard title="Nearly there!" on:home={() => context.screen = Screen.Home }>
			<Name context={context} on:next={() => next()} />
		</Wizard>
	{:else if context.screen == Screen.Download}
		<Wizard title="Good news - it's ready!" on:home={() => context.screen = Screen.Home }>
			<Download context={context} on:next={() => next()} />
		</Wizard>
	{:else if context.screen == Screen.Support}
		<Wizard title="Bad news." on:home={() => context.screen = Screen.Home }>
			<Support context={context} on:next={() => next()} />
		</Wizard>
	{:else}
		<Wizard title="Quick Create" on:home={() => context.screen = Screen.Home }>
			<QuickCreate context={context} on:next={() => next()} />
		</Wizard>
	{/if}
</main>