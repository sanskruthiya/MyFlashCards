import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		// adapter-staticは静的サイト生成に使用します
		// fallback設定はSPAモードを有効にします
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: 'index.html',
			precompress: false
		}),
		// ベースパスを設定（サブディレクトリにデプロイする場合）
		paths: {
			base: '/flashcards'
		}
	}
};

export default config;
