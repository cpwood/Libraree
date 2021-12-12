import 'reflect-metadata';
import App from './App.svelte';
import { Settings } from './back/settings';

const settings = Settings.load();

const app = new App({
	target: document.body,
	props: {
		settings: settings
	}
});

export default app; 