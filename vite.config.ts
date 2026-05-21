import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	css: {
		// Lightning CSS — Rust ile yazılmış, en hızlı CSS minifier/transformer
		transformer: 'lightningcss',
		lightningcss: {
			drafts: {
				customMedia: true
			}
		}
	},
	build: {
		cssMinify: 'lightningcss'
	}
});
