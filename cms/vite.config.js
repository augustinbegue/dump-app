import { sveltekit } from '@sveltejs/kit/vite';

/** @type {import('vite').UserConfig} */
const config = {
	plugins: [sveltekit()],
	server: {
		port: 4174,
	},
	preview: {
		port: 4174,
	}
};

export default config;
