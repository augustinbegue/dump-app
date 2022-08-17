import { sveltekit } from '@sveltejs/kit/vite';

/** @type {import('vite').UserConfig} */
const config = {
	plugins: [sveltekit()],
	server: {
		fs: {
			allow: ['static', '../node_modules']
		},
		port: 4173,
	},
	preview: {
		port: 4173,
	}
};

export default config;
