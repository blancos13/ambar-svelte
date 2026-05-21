<script lang="ts">
	import Like from '$lib/components/Like.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import PropsTable from '$lib/components/PropsTable.svelte';

	const importCode = `import Like from '$lib/components/Like.svelte';`;

	const usageCode = `<Like bind:liked bind:count size="md" showCount />`;

	const bindableCode = `<script lang="ts">
  let liked = $state(false);
  let count = $state(12400);
<\/script>

<Like bind:liked bind:count size="md" />`;

	const callbackCode = `<Like
  bind:liked
  bind:count
  onchange={(isLiked) => console.log('liked:', isLiked)}
/>`;

	const props = [
		{ name: 'liked', type: 'boolean', default: 'false', description: 'Whether the item is liked. Bindable.' },
		{ name: 'count', type: 'number', default: '0', description: 'The like count to display. Bindable — auto-increments/decrements on toggle.' },
		{ name: 'showCount', type: 'boolean', default: 'true', description: 'Show or hide the like count label.' },
		{ name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Controls the icon size and text size.' },
		{ name: 'onchange', type: '(liked: boolean) => void', default: 'undefined', description: 'Callback fired after each toggle with the new liked state.' },
	];

	let counts = $state({
		a: 12400,
		b: 843,
		c: 0,
		d: 99800,
	});

	let liked = $state({
		a: false, b: true, c: false, d: false,
	});

	/* Post cards */
	let posts = $state([
		{ id: 1, user: '@zeynep.dance', desc: 'Had so much fun today 🕺', liked: false, count: 48200 },
		{ id: 2, user: '@techbro.tr',   desc: 'New video is out 🔥',       liked: true,  count: 12900 },
		{ id: 3, user: '@foodlover',    desc: 'Homemade pizza 🍕',          liked: false, count: 7340  },
	]);
</script>

<div class="comp-header">
	<div class="comp-header-top">
		<h1 class="comp-title">Like</h1>
		<span class="comp-badge">Interactive</span>
	</div>
	<p class="comp-desc">Heart button with particle burst animation, bounce effect, and a live counter — ready for feeds, cards, and sidebars.</p>
</div>

<section class="doc-section">
	<h2 class="doc-section-title">Import</h2>
	<CodeBlock code={importCode} lang="ts" />
</section>

<section class="doc-section">
	<h2 class="doc-section-title">Usage</h2>
	<div class="preview-box preview-box-accent">
		<Like bind:liked={liked.b} bind:count={counts.b} size="md" />
	</div>
	<CodeBlock code={usageCode} lang="svelte" />
</section>

<section class="doc-section">
	<h2 class="doc-section-title">Sizes</h2>
	<p class="doc-section-desc">Three sizes: <code>sm</code>, <code>md</code> (default), and <code>lg</code>. Use <code>showCount={false}</code> to hide the counter.</p>
	<div class="preview-box">
		<div class="size-demo">
			<Like bind:liked={liked.a} bind:count={counts.a} size="sm" />
			<span class="size-label">sm</span>
		</div>
		<div class="size-demo">
			<Like bind:liked={liked.b} bind:count={counts.b} size="md" />
			<span class="size-label">md</span>
		</div>
		<div class="size-demo">
			<Like bind:liked={liked.c} bind:count={counts.c} size="lg" />
			<span class="size-label">lg</span>
		</div>
		<div class="size-demo">
			<Like bind:liked={liked.d} bind:count={counts.d} showCount={false} size="lg" />
			<span class="size-label">no count</span>
		</div>
	</div>
	<CodeBlock code={bindableCode} lang="svelte" />
</section>

<section class="doc-section">
	<h2 class="doc-section-title">onchange Callback</h2>
	<p class="doc-section-desc">Use <code>onchange</code> to react to state changes without two-way binding.</p>
	<CodeBlock code={callbackCode} lang="svelte" />
</section>

<section class="doc-section">
	<h2 class="doc-section-title">Use Case — Video Feed</h2>
	<p class="doc-section-desc">Example of Like buttons inside video feed cards.</p>
	<div class="preview-box" style="align-items: stretch; flex-direction: column; max-width: 26rem;">
		{#each posts as post}
			<div class="feed-card">
				<div>
					<p class="feed-user">{post.user}</p>
					<p class="feed-desc">{post.desc}</p>
				</div>
				<Like bind:liked={post.liked} bind:count={post.count} />
			</div>
		{/each}
	</div>
</section>

<section class="doc-section">
	<h2 class="doc-section-title">Use Case — Vertical Action Bar</h2>
	<p class="doc-section-desc">Like component placed in a vertical sidebar alongside comment and share actions.</p>
	<div class="preview-box">
		<div class="action-bar">
			<Like bind:liked={liked.a} bind:count={counts.a} size="lg" />

			<button class="action-btn" aria-label="Comment">
				<svg class="action-icon" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
					<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
				</svg>
				<span class="action-label">1.2K</span>
			</button>

			<button class="action-btn" aria-label="Share">
				<svg class="action-icon" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
					<path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
					<polyline points="16 6 12 2 8 6"/>
					<line x1="12" y1="2" x2="12" y2="15"/>
				</svg>
				<span class="action-label">Share</span>
			</button>
		</div>
	</div>
</section>

<section class="doc-section">
	<h2 class="doc-section-title">API Reference</h2>
	<PropsTable {props} />
</section>

<style>
	.comp-header { margin-bottom: 2.5rem; padding-bottom: 1.5rem; border-bottom: 1px solid var(--border); }
	.comp-header-top { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.5rem; }
	.comp-title { font-size: 1.875rem; font-weight: 800; letter-spacing: -0.025em; color: var(--foreground); }
	.comp-badge { font-size: 0.65rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; background: color-mix(in srgb, var(--accent) 15%, transparent); color: var(--accent); border: 1px solid color-mix(in srgb, var(--accent) 30%, transparent); padding: 0.15rem 0.5rem; border-radius: 9999px; }
	.comp-desc { color: var(--muted-foreground); font-size: 0.9375rem; line-height: 1.6; margin-bottom: 1rem; }
	.doc-section { margin-bottom: 2.5rem; display: flex; flex-direction: column; gap: 1rem; }
	.doc-section-title { font-size: 1.125rem; font-weight: 700; color: var(--foreground); letter-spacing: -0.01em; }
	.doc-section-desc { font-size: 0.875rem; color: var(--muted-foreground); margin-top: -0.5rem; }
	.doc-section-desc code { font-family: ui-monospace, monospace; font-size: 0.8em; background: var(--muted); padding: 0.1rem 0.35rem; border-radius: 0.25rem; color: var(--accent); }
	.preview-box { padding: 2rem; border: 1px solid var(--border); border-radius: 0.875rem; background: var(--card); display: flex; align-items: center; justify-content: center; min-height: 6rem; flex-wrap: wrap; gap: 0.75rem; }
	.preview-box-accent { background: radial-gradient(ellipse 80% 60% at 50% 0%, color-mix(in srgb, var(--accent) 8%, transparent), transparent); }

	.size-demo { display: flex; flex-direction: column; align-items: center; gap: 0.75rem; }
	.size-label { font-size: 0.75rem; color: var(--muted-foreground); }

	.feed-card { display: flex; align-items: center; justify-content: space-between; border-radius: 1rem; background: var(--background); padding: 1rem 1.25rem; width: 100%; }
	.feed-user { font-size: 0.875rem; font-weight: 600; color: var(--foreground); }
	.feed-desc { margin-top: 0.125rem; font-size: 0.75rem; color: var(--muted-foreground); }

	.action-bar { display: flex; flex-direction: column; align-items: center; gap: 1.5rem; border-radius: 1rem; background: var(--background); padding: 2rem 1.5rem; }
	.action-btn { display: flex; flex-direction: column; align-items: center; gap: 0.375rem; color: var(--muted-foreground); background: none; border: none; cursor: pointer; transition: transform 0.1s; }
	.action-btn:active { transform: scale(0.9); }
	.action-icon { width: 1.75rem; height: 1.75rem; }
	.action-label { font-size: 0.875rem; font-weight: 500; }
</style>
