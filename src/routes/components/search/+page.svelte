<script lang="ts">
	import Search from '$lib/components/Search.svelte';
	import type { SearchItem } from '$lib/components/Search.svelte';
	import CodeBlock  from '$lib/components/CodeBlock.svelte';
	import PropsTable from '$lib/components/PropsTable.svelte';

	/* ── demo data ── */
	const allVideos: SearchItem[] = [
		{ id: 1,  label: 'Svelte 5 Runes Deep Dive',       description: '12:34 · 284K views',          category: 'Videos', badge: 'Trending' },
		{ id: 2,  label: 'Svelte Component Library Build',  description: '18:22 · 196K views',          category: 'Videos' },
		{ id: 3,  label: 'CSS Grid Master Class',           description: '24:10 · 112K views',          category: 'Videos' },
		{ id: 4,  label: 'Motion Design Basics',            description: '8:45 · 87K views',            category: 'Videos' },
		{ id: 5,  label: 'TypeScript Tips & Tricks',       description: '22:15 · 154K views',           category: 'Videos', badge: 'New' },
		{ id: 6,  label: '@ui.engineer',                    description: '124K followers',                category: 'People' },
		{ id: 7,  label: '@frontend.dev',                  description: '98K followers',                 category: 'People' },
		{ id: 8,  label: '@design.systems',                description: '72K followers',                 category: 'People' },
		{ id: 9,  label: '#sveltedev',                     description: '3.2K videos',                  category: 'Tags' },
		{ id: 10, label: '#ambarui',                       description: '1.8K videos',                  category: 'Tags' },
		{ id: 11, label: '#motiondesign',                  description: '892 videos',                   category: 'Tags' },
	];

	const allPages: SearchItem[] = [
		{ id: 'p1', label: 'Button',    description: 'Interactive button variants',       category: 'Components', badge: 'UI' },
		{ id: 'p2', label: 'Dropdown',  description: 'Menu dropdown — submenu support',   category: 'Components', badge: 'UI' },
		{ id: 'p3', label: 'Popover',   description: '8 placement · arrow · portal',      category: 'Components', badge: 'UI' },
		{ id: 'p4', label: 'Slider',    description: 'Range slider — drag, keyboard',     category: 'Components', badge: 'UI' },
		{ id: 'p5', label: 'Accordion', description: '3 variant · 5 animations',          category: 'Components', badge: 'UI' },
		{ id: 'p6', label: 'Search',    description: 'Suggestions · async · ⌘K palette', category: 'Components', badge: 'UI' },
		{ id: 'p7', label: 'Dashboard', description: 'Metric cards, charts',              category: 'Pages' },
		{ id: 'p8', label: 'Settings',  description: 'User preferences',                  category: 'Pages' },
	];

	/* ── state ── */
	let q1           = $state('');
	let q2           = $state('');
	let q3           = $state('');
	let loadingQ     = $state(false);
	let lastSelected = $state('');

	const results1 = $derived(
		q1.trim()
			? allVideos.filter(v =>
				v.label.toLowerCase().includes(q1.toLowerCase()) ||
				v.description?.toLowerCase().includes(q1.toLowerCase()))
			: []
	);

	const results2 = $derived(
		q2.trim()
			? allPages.filter(p =>
				p.label.toLowerCase().includes(q2.toLowerCase()) ||
				p.description?.toLowerCase().includes(q2.toLowerCase()))
			: []
	);

	let asyncResults = $state<SearchItem[]>([]);
	let asyncTimer: ReturnType<typeof setTimeout>;
	function onSearch3(q: string) {
		clearTimeout(asyncTimer);
		if (!q.trim()) { asyncResults = []; loadingQ = false; return; }
		loadingQ = true;
		asyncTimer = setTimeout(() => {
			asyncResults = allVideos.filter(v => v.label.toLowerCase().includes(q.toLowerCase()));
			loadingQ = false;
		}, 800);
	}

	/* ── code snippets ── */
	const importCode = `import Search from '$lib/components/Search.svelte';
import type { SearchItem } from '$lib/components/Search.svelte';`;

	const usageCode = `<script lang="ts">
  let value = $state('');
<\/script>

<Search bind:value placeholder="Search..." />`;

	const sizesCode = `<Search size="sm" placeholder="Small..." />
<Search size="md" placeholder="Medium..." />
<Search size="lg" placeholder="Large..." />`;

	const expandableCode = `<!-- Collapses to an icon; expands on click with a spring animation -->
<Search expandable size="sm" placeholder="Search..." recentKey="exp-sm" />`;

	const suggestionsCode = `<script lang="ts">
  let q = $state('');
  const items: SearchItem[] = [
    { id: 1, label: 'Svelte 5 Runes', description: '12:34 · 284K views', category: 'Videos', badge: 'Trending' },
    { id: 2, label: 'CSS Grid',        description: '24:10 · 112K views', category: 'Videos' },
  ];
  const results = $derived(q.trim()
    ? items.filter(i => i.label.toLowerCase().includes(q.toLowerCase()))
    : []);
<\/script>

<Search
  bind:value={q}
  placeholder="Search videos..."
  items={results}
  recentKey="search-demo"
  onSelect={(item) => console.log(item)}
/>`;

	const asyncCode = `<script lang="ts">
  let q        = $state('');
  let loading  = $state(false);
  let results  = $state<SearchItem[]>([]);
  let timer: ReturnType<typeof setTimeout>;

  function onSearch(query: string) {
    clearTimeout(timer);
    if (!query) { results = []; return; }
    loading = true;
    timer = setTimeout(async () => {
      results = await fetchResults(query);
      loading = false;
    }, 400);
  }
<\/script>

<Search bind:value={q} {items} {loading} onSearch={onSearch} recentKey="async" />`;

	const commandCode = `<Search
  bind:value={q}
  placeholder="Search components or pages..."
  items={results}
  command
  shortcut="⌘K"
  size="lg"
  recentKey="cmdk"
/>`;

	const props = [
		{ name: 'value',       type: 'string',               default: "''",          description: 'Bindable input value.' },
		{ name: 'placeholder', type: 'string',               default: "'Search...'", description: 'Input placeholder text.' },
		{ name: 'size',        type: "'sm' | 'md' | 'lg'",   default: "'md'",        description: 'Controls height and font size.' },
		{ name: 'items',       type: 'SearchItem[]',                                 description: 'Suggestion items to display in the dropdown.' },
		{ name: 'loading',     type: 'boolean',              default: 'false',       description: 'Shows a spinner and loading dots in the dropdown.' },
		{ name: 'debounce',    type: 'number',                                       description: 'Milliseconds to debounce the onSearch callback.' },
		{ name: 'maxRecent',   type: 'number',                                       description: 'Max recent searches to store.' },
		{ name: 'recentKey',   type: 'string',                                       description: 'localStorage key for persisting recent searches. Unique per instance.' },
		{ name: 'command',     type: 'boolean',              default: 'false',       description: 'Enables ⌘K / Ctrl+K global keyboard shortcut to focus the input.' },
		{ name: 'shortcut',    type: 'string',                                       description: 'Shortcut badge label shown inside the input (e.g. "⌘K").' },
		{ name: 'emptyText',   type: 'string',                                       description: 'Text shown when items is empty and a query is active.' },
		{ name: 'expandable',  type: 'boolean',              default: 'false',       description: 'Collapses to an icon; expands on click with a spring animation.' },
		{ name: 'onSearch',    type: '(q: string) => void',                         description: 'Callback fired on every input change (after optional debounce).' },
	];
</script>

<!-- ICON snippets -->
{#snippet videoIcon()}
	<svg style="width:1rem;height:1rem;color:var(--muted-foreground);" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
		<path d="M15 10l4.553-2.069A1 1 0 0 1 21 8.845v6.31a1 1 0 0 1-1.447.894L15 14M3 8a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8z"/>
	</svg>
{/snippet}
{#snippet personIcon()}
	<svg style="width:1rem;height:1rem;color:var(--accent);" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
		<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
	</svg>
{/snippet}
{#snippet tagIcon()}
	<svg style="width:1rem;height:1rem;color:var(--muted-foreground);" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
		<path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/>
	</svg>
{/snippet}

<!-- Page header -->
<div class="comp-header">
	<div class="comp-header-top">
		<h1 class="comp-title">Search</h1>
	</div>
	<p class="comp-desc">
		Search input with suggestion dropdown, grouped results, matched-text highlight, recent searches, async loading state, ⌘K command palette mode, and expandable animation.
	</p>
</div>

<!-- ── IMPORT ── -->
<section class="doc-section">
	<h2 class="doc-section-title">Import</h2>
	<CodeBlock code={importCode} lang="ts" />
</section>

<!-- ── USAGE ── -->
<section class="doc-section">
	<h2 class="doc-section-title">Usage</h2>
	<div class="preview-box">
		<div style="width: 100%; max-width: 24rem;">
			<Search placeholder="Search..." />
		</div>
	</div>
	<CodeBlock code={usageCode} lang="svelte" />
</section>

<!-- ── SIZES ── -->
<section class="doc-section">
	<h2 class="doc-section-title">Sizes</h2>
	<p class="doc-section-desc">Three size presets: <code>sm</code>, <code>md</code> (default), <code>lg</code>.</p>
	<div class="preview-box" style="flex-direction: column; align-items: stretch;">
		<div style="max-width: 24rem; display: flex; flex-direction: column; gap: 0.75rem;">
			<Search placeholder="Small..." size="sm" />
			<Search placeholder="Medium..." size="md" />
			<Search placeholder="Large..." size="lg" />
		</div>
	</div>
	<CodeBlock code={sizesCode} lang="svelte" />
</section>

<!-- ── EXPANDABLE ── -->
<section class="doc-section">
	<h2 class="doc-section-title">Expandable</h2>
	<p class="doc-section-desc">Set <code>expandable</code> to collapse the input to a search icon; it expands with a spring animation on click and closes on blur.</p>
	<div class="preview-box" style="gap: 2rem; flex-wrap: wrap; justify-content: flex-start; padding-left: 2rem;">
		<div style="width: 12rem;">
			<Search expandable size="sm" placeholder="sm search..." recentKey="exp-sm" />
		</div>
		<div style="width: 14rem;">
			<Search expandable size="md" placeholder="md search..." recentKey="exp-md" />
		</div>
		<div style="width: 16rem;">
			<Search expandable size="lg" placeholder="lg search..." recentKey="exp-lg" />
		</div>
	</div>
	<CodeBlock code={expandableCode} lang="svelte" />
</section>

<!-- ── SUGGESTIONS + RECENT + HIGHLIGHT ── -->
<section class="doc-section">
	<h2 class="doc-section-title">Suggestions, grouped results & highlight</h2>
	<p class="doc-section-desc">Pass <code>items</code> to show a suggestion dropdown. Results are grouped by <code>category</code>, matched text is highlighted, badges are shown. Recent searches are persisted via <code>recentKey</code>. Try: "svelte", "frontend", "#svelte"</p>
	<div class="preview-box" style="flex-direction: column; align-items: stretch;">
		<div style="max-width: 32rem; width: 100%;">
			<Search
				bind:value={q1}
				placeholder="Search videos, people or tags..."
				items={results1.map(r => ({
					...r,
					icon: r.category === 'People' ? personIcon : r.category === 'Tags' ? tagIcon : videoIcon,
				}))}
				recentKey="search-demo-1"
				onSearch={(q) => {}}
				onSelect={(item) => (lastSelected = item.label)}
			/>
			{#if lastSelected}
				<p class="selected-hint">
					Selected: <span>{lastSelected}</span>
				</p>
			{/if}
		</div>
	</div>
	<CodeBlock code={suggestionsCode} lang="svelte" />
</section>

<!-- ── ASYNC ── -->
<section class="doc-section">
	<h2 class="doc-section-title">Async search</h2>
	<p class="doc-section-desc">Simulated API call with 800ms delay — shows a spinner and loading dots. Pass <code>loading={true}</code> while your request is in flight.</p>
	<div class="preview-box" style="flex-direction: column; align-items: stretch;">
		<div style="max-width: 32rem; width: 100%;">
			<Search
				bind:value={q3}
				placeholder="Search videos (async)..."
				items={asyncResults}
				loading={loadingQ}
				recentKey="search-demo-3"
				onSearch={onSearch3}
			/>
		</div>
	</div>
	<CodeBlock code={asyncCode} lang="svelte" />
</section>

<!-- ── COMMAND PALETTE ── -->
<section class="doc-section">
	<h2 class="doc-section-title">Command palette (⌘K)</h2>
	<p class="doc-section-desc">
		Set <code>command</code> to register a global keyboard shortcut. Focus with
		<kbd>⌘K</kbd> or <kbd>Ctrl+K</kbd>. Try: "button", "slider", "dashboard"
	</p>
	<div class="preview-box" style="flex-direction: column; align-items: stretch;">
		<div style="max-width: 32rem; width: 100%;">
			<Search
				bind:value={q2}
				placeholder="Search components or pages..."
				items={results2}
				command
				shortcut="⌘K"
				recentKey="search-demo-2"
				size="lg"
				onSearch={(q) => {}}
				onSelect={(item) => (lastSelected = item.label)}
			/>
		</div>
	</div>
	<CodeBlock code={commandCode} lang="svelte" />
</section>

<!-- ── API ── -->
<section class="doc-section">
	<h2 class="doc-section-title">API Reference</h2>
	<PropsTable {props} />
</section>

<style>
	.comp-header {
		margin-bottom: 2.5rem;
		padding-bottom: 1.5rem;
		border-bottom: 1px solid var(--border);
	}
	.comp-header-top {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		margin-bottom: 0.5rem;
	}
	.comp-title {
		font-size: 1.875rem;
		font-weight: 800;
		letter-spacing: -0.025em;
		color: var(--foreground);
	}
	.comp-badge {
		font-size: 0.65rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		background: color-mix(in srgb, var(--accent) 15%, transparent);
		color: var(--accent);
		border: 1px solid color-mix(in srgb, var(--accent) 30%, transparent);
		padding: 0.15rem 0.5rem;
		border-radius: 9999px;
	}
	.comp-desc {
		color: var(--muted-foreground);
		font-size: 0.9375rem;
		line-height: 1.6;
		margin-bottom: 1rem;
	}
	.doc-section {
		margin-bottom: 2.5rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
	.doc-section-title {
		font-size: 1.125rem;
		font-weight: 700;
		color: var(--foreground);
		letter-spacing: -0.01em;
	}
	.doc-section-desc {
		font-size: 0.875rem;
		color: var(--muted-foreground);
		margin-top: -0.5rem;
	}
	.doc-section-desc code {
		font-family: ui-monospace, monospace;
		font-size: 0.8em;
		background: var(--muted);
		padding: 0.1rem 0.35rem;
		border-radius: 0.25rem;
		color: var(--accent);
	}
	.preview-box {
		padding: 2rem;
		border: 1px solid var(--border);
		border-radius: 0.875rem;
		background: var(--card);
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 6rem;
		flex-wrap: wrap;
		gap: 0.75rem;
	}
	.preview-box-accent {
		background: radial-gradient(ellipse 80% 60% at 50% 0%, color-mix(in srgb, var(--accent) 8%, transparent), transparent);
	}

	/* helpers */
	kbd {
		border-radius: 0.25rem;
		border: 1px solid var(--border);
		background: var(--muted);
		padding: 0.1rem 0.45rem;
		font-family: ui-monospace, monospace;
		font-size: 0.75rem;
	}
	.selected-hint {
		margin-top: 0.75rem;
		font-size: 0.8125rem;
		color: var(--muted-foreground);
	}
	.selected-hint span {
		font-weight: 600;
		color: var(--foreground);
	}
</style>
