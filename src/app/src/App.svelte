<script lang="ts">
	import type { Settings } from './back/settings';
	import Credits from './Credits.svelte';
	import Home from './Home.svelte';
	import MyLibraries from './MyLibraries.svelte';
	import Search from './Search.svelte';

	export let settings: Settings;
	let screenName = 'home';
	let filter = '';

	if (!settings.hasLibraries) {
		// Go to the My Libraries screen automatically.
		screenName = 'my-libraries';
	}

	function search(value) {
		screenName = 'search';
		filter = value.detail;
	}
</script>

<style>
	main {
		padding: 0;
		margin: 0;
	}
</style>


<main>
	{#if screenName == 'home'}
		<Home on:search={search} 
			on:my-libraries={() => screenName = 'my-libraries'}
			on:credits={() => screenName = 'credits'}></Home>
	{:else if screenName == 'search'}
		<Search {settings} {filter}
			on:my-libraries={() => screenName = 'my-libraries'}
			on:credits={() => screenName = 'credits'}></Search>
	{:else if screenName == 'credits'}
		<Credits
			on:home={() => screenName = 'home'} />
	{:else}
		<MyLibraries {settings} 
			on:home={() => screenName = 'home'}></MyLibraries>
	{/if}
</main>