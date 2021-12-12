import svelte from 'rollup-plugin-svelte';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import sveltePreprocess from 'svelte-preprocess';
import typescript from '@rollup/plugin-typescript';
import css from 'rollup-plugin-css-only';
import json from '@rollup/plugin-json';
import url from '@rollup/plugin-url';
//import nodePolyfills from 'rollup-plugin-polyfill-node';

const production = !process.env.ROLLUP_WATCH;

function serve() {
	let server;

	function toExit() {
		if (server) server.kill(0);
	}

	return {
		writeBundle() {
			if (server) return;
			server = require('child_process').spawn('npm', ['run', 'start', '--', '--dev'], {
				stdio: ['ignore', 'inherit', 'inherit'],
				shell: true
			});

			process.on('SIGTERM', toExit);
			process.on('exit', toExit);
		}
	};
}

export default {
	input: 'src/main.ts',
	output: {
		sourcemap: !production,
		format: 'iife',
		name: 'app',
		file: 'public/build/bundle.js',
		inlineDynamicImports: true
	},
	moduleContext: (id) => {
        // In order to match native module behaviour, Rollup sets `this`
        // as `undefined` at the top level of modules. Rollup also outputs
        // a warning if a module tries to access `this` at the top level.
        // The following modules use `this` at the top level and expect it
        // to be the global `window` object, so we tell Rollup to set
        // `this = window` for these modules.
        const thisAsWindowForModules = [
            'node_modules/intl-messageformat/lib/core.js',
            'node_modules/intl-messageformat/lib/compiler.js',
			'node_modules/class-transformer/esm5/ClassTransformer.js',
			'node_modules/class-transformer/esm5/TransformOperationExecutor.js',
			'node_modules/sax/lib/sax.js'
        ];

        if (thisAsWindowForModules.some(id_ => id.trimRight().endsWith(id_))) {
            return 'window';
        }
    },
	plugins: [
		svelte({
			preprocess: sveltePreprocess({ sourceMap: !production }),
			compilerOptions: {
				// enable run-time checks when not in production
				dev: !production
			}
		}),

		url({
			// by default, rollup-plugin-url will not handle font files
			include: ['**/*.woff', '**/*.woff2'],
			// setting infinite limit will ensure that the files 
			// are always bundled with the code, not copied to /dist
			limit: Infinity,
		  }),

		// we'll extract any component CSS out into
		// a separate file - better for performance
		css({ output: 'bundle.css' }),
/*
		nodePolyfills({
			browser: true, 
			exclude: [
				'axios'
			]
		}),*/

		// If you have external dependencies installed from
		// npm, you'll most likely need these plugins. In
		// some cases you'll need additional configuration -
		// consult the documentation for details:
		// https://github.com/rollup/plugins/tree/master/packages/commonjs
		resolve({
			browser: true,
			dedupe: ['svelte']
		}),
		commonjs(),
		typescript({
			sourceMap: !production,
			inlineSources: !production
		}),
		json({
			compact: true
		}),
		// In dev mode, call `npm run start` once
		// the bundle has been generated
		!production && serve(),

		// Watch the `public` directory and refresh the
		// browser on changes when not in production
		!production && livereload('public'),

		// If we're building for production (npm run build
		// instead of npm run dev), minify
		production && terser()
	],
	watch: {
		clearScreen: false
	}
};
