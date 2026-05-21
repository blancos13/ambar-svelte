<script lang="ts">
	import List, { type ListItem } from '$lib/components/List.svelte';
	import Button    from '$lib/components/Button.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import PropsTable from '$lib/components/PropsTable.svelte';

	/* ── animated FLIP demo ── */
	let flipItems = $state<ListItem[]>([
		{ id: 1, label: 'Crash',    description: 'Click to remove' },
		{ id: 2, label: 'Aviator',  description: 'Click to remove' },
		{ id: 3, label: 'Double',   description: 'Click to remove' },
		{ id: 4, label: 'Roulette', description: 'Click to remove' },
	]);
	function shuffle() { flipItems = [...flipItems].sort(() => Math.random() - 0.5); }
	function addFlip() {
		const id = Math.max(0, ...flipItems.map(i => Number(i.id))) + 1;
		flipItems = [...flipItems, { id, label: `Game ${id}`, description: 'Click to remove' }];
	}
	function removeFlip(item: ListItem) { flipItems = flipItems.filter(i => i.id !== item.id); }
	function resetFlip() {
		flipItems = [
			{ id: 1, label: 'Crash',    description: 'Click to remove' },
			{ id: 2, label: 'Aviator',  description: 'Click to remove' },
			{ id: 3, label: 'Double',   description: 'Click to remove' },
			{ id: 4, label: 'Roulette', description: 'Click to remove' },
		];
	}

	/* ── variant demo items ── */
	const techItems: ListItem[] = [
		{ id: 'a', label: 'Svelte',      description: 'UI framework' },
		{ id: 'b', label: 'TypeScript',  description: 'Typed JS' },
		{ id: 'c', label: 'Vite',        description: 'Build tool' },
	];

	/* ── density demo ── */
	const taskItems: ListItem[] = [
		{ id: 't1', label: 'Design review',     description: 'Due today' },
		{ id: 't2', label: 'Publish changelog',  description: 'Overdue' },
		{ id: 't3', label: 'Reply to comments',  description: '2 mins' },
	];

	/* ── columns demo ── */
	const gameItems: ListItem[] = [
		{ id: 'g1', label: 'Crash' },
		{ id: 'g2', label: 'Aviator' },
		{ id: 'g3', label: 'Double' },
		{ id: 'g4', label: 'Roulette' },
		{ id: 'g5', label: 'Slots' },
		{ id: 'g6', label: 'Mines' },
		{ id: 'g7', label: 'Plinko' },
		{ id: 'g8', label: 'Keno' },
	];

	/* ── disabled ── */
	const mixedItems: ListItem[] = [
		{ id: 'm1', label: 'Available',     description: 'Select me' },
		{ id: 'm2', label: 'Unavailable',   description: 'Maintenance', disabled: true },
		{ id: 'm3', label: 'Available',     description: 'Select me' },
		{ id: 'm4', label: 'Unavailable',   description: 'Coming soon', disabled: true },
	];

	/* ── code snippets ── */
	const importCode = `import List, { type ListItem } from '$lib/components/List.svelte';`;

	const usageCode = `<script lang="ts">
  import List, { type ListItem } from '$lib/components/List.svelte';

  const items: ListItem[] = [
    { id: 1, label: 'Crash',   description: 'Card game' },
    { id: 2, label: 'Aviator', description: 'Multiplier game' },
  ];
<\/script>

<List {items} onselect={(item) => console.log(item)} />`;

	const variantsCode = `<!-- default: bordered card style -->
<List {items} variant="default" />

<!-- soft: subtle muted background (default) -->
<List {items} variant="soft" />

<!-- card: elevated with shadow -->
<List {items} variant="card" />`;

	const densityCode = `<List {items} density="compact" />
<List {items} density="default" />
<List {items} density="roomy" />`;

	const columnsCode = `<List {items} columns={4} />`;

	const animatedCode = `<!-- animated FLIP reorder + enter/exit (default: true) -->
<List {items} animated />

<!-- disable all motion -->
<List {items} animated={false} />`;

	const customSlotCode = `<List {items}>
  {#snippet children(item)}
    <span class="font-bold">{item.label}</span>
    <span class="text-xs text-muted-foreground">{item.description}</span>
  {/snippet}
</List>`;

	const props = [
		{ name: 'items',    type: 'ListItem[]',                              description: 'Array of items to render. Each item: { id, label, description?, disabled? }.' },
		{ name: 'variant',  type: "'default' | 'soft' | 'card'",            default: "'soft'",    description: 'Visual style of each list item.' },
		{ name: 'density',  type: "'compact' | 'default' | 'roomy'",        default: "'default'", description: 'Padding preset controlling item height.' },
		{ name: 'columns',  type: '1 | 2 | 3 | 4',                          default: '1',         description: 'Number of grid columns.' },
		{ name: 'animated', type: 'boolean',                                 default: 'true',      description: 'Enables FLIP reorder and scale enter/exit animations.' },
		{ name: 'onselect', type: '(item: ListItem) => void',                description: 'Callback fired when a non-disabled item is clicked.' },
		{ name: 'children', type: 'Snippet<[ListItem]>',                     description: 'Custom render snippet — receives the item as argument.' },
		{ name: 'class',    type: 'string',                                  description: 'Extra CSS classes merged onto the grid wrapper.' },
	];
</script>

<!-- Page header -->
<div class="comp-header">
	<div class="comp-header-top">
		<h1 class="comp-title">List</h1>
	</div>
	<p class="comp-desc">
		Grid-based list component with FLIP reorder, scale enter/exit animations, three visual variants, density presets, and multi-column layout.
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
	<div class="preview-box" style="justify-content: flex-start; align-items: flex-start;">
		<div style="width:100%; max-width:14rem;">
			<List items={techItems} />
		</div>
	</div>
	<CodeBlock code={usageCode} lang="svelte" />
</section>

<!-- ── ANIMATED FLIP ── -->
<section class="doc-section">
	<h2 class="doc-section-title">Animated — FLIP reorder</h2>
	<p class="doc-section-desc">Shuffle reorders with a spring FLIP animation. Add/remove items animate in and out with a scale transition. Click an item to remove it.</p>
	<div class="preview-box" style="flex-direction: column; align-items: stretch; gap: 1rem;">
		<div class="flip-controls">
			<Button onclick={shuffle}>Shuffle</Button>
			<Button onclick={addFlip}>Add item</Button>
			<Button variant="secondary" onclick={resetFlip}>Reset</Button>
		</div>
		<List items={flipItems} columns={4} variant="soft" onselect={removeFlip} />
	</div>
	<CodeBlock code={animatedCode} lang="svelte" />
</section>

<!-- ── VARIANTS ── -->
<section class="doc-section">
	<h2 class="doc-section-title">Variants</h2>
	<p class="doc-section-desc">Three visual styles: <code>default</code> (bordered), <code>soft</code> (muted fill), <code>card</code> (elevated).</p>
	<div class="preview-box" style="flex-direction: column; align-items: stretch; gap: 1.5rem;">
		<div>
			<p class="variant-label">default</p>
			<List items={techItems} variant="default" />
		</div>
		<div>
			<p class="variant-label">soft (default)</p>
			<List items={techItems} variant="soft" />
		</div>
		<div>
			<p class="variant-label">card</p>
			<List items={techItems} variant="card" />
		</div>
	</div>
	<CodeBlock code={variantsCode} lang="svelte" />
</section>

<!-- ── DENSITY ── -->
<section class="doc-section">
	<h2 class="doc-section-title">Density</h2>
	<p class="doc-section-desc">Control padding with <code>compact</code>, <code>default</code>, or <code>roomy</code>.</p>
	<div class="preview-box" style="flex-direction: column; align-items: stretch; gap: 1.5rem;">
		<div>
			<p class="variant-label">compact</p>
			<List items={taskItems} density="compact" />
		</div>
		<div>
			<p class="variant-label">default</p>
			<List items={taskItems} density="default" />
		</div>
		<div>
			<p class="variant-label">roomy</p>
			<List items={taskItems} density="roomy" />
		</div>
	</div>
	<CodeBlock code={densityCode} lang="svelte" />
</section>

<!-- ── COLUMNS ── -->
<section class="doc-section">
	<h2 class="doc-section-title">Columns</h2>
	<p class="doc-section-desc">Set <code>columns</code> to 1–4 to create a multi-column grid. Responsive: 3- and 4-column grids collapse to 2 columns on small screens.</p>
	<div class="preview-box" style="flex-direction: column; align-items: stretch; gap: 1.5rem;">
		<div>
			<p class="variant-label">columns={2}</p>
			<List items={gameItems.slice(0,4)} columns={2} />
		</div>
		<div>
			<p class="variant-label">columns={4}</p>
			<List items={gameItems} columns={4} />
		</div>
	</div>
	<CodeBlock code={columnsCode} lang="svelte" />
</section>

<!-- ── DISABLED ── -->
<section class="doc-section">
	<h2 class="doc-section-title">Disabled items</h2>
	<p class="doc-section-desc">Set <code>disabled: true</code> on individual items to prevent selection.</p>
	<div class="preview-box" style="justify-content: flex-start; align-items: flex-start;">
		<div style="width: 100%; max-width: 20rem;">
			<List items={mixedItems} columns={2} />
		</div>
	</div>
</section>

<!-- ── CUSTOM SLOT ── -->
<section class="doc-section">
	<h2 class="doc-section-title">Custom render</h2>
	<p class="doc-section-desc">Provide a <code>children</code> snippet to fully control item rendering.</p>
	<div class="preview-box" style="justify-content: flex-start; align-items: flex-start;">
		<div style="width: 100%; max-width: 20rem;">
			<List items={techItems} columns={3}>
				{#snippet children(item)}
					<span style="font-size:1.25rem;">
						{item.label === 'Svelte' ? '🔶' : item.label === 'TypeScript' ? '🔷' : '⚡'}
					</span>
					<span style="font-size:0.8125rem; font-weight:650;">{item.label}</span>
					<span style="font-size:0.7rem; color:var(--muted-foreground);">{item.description}</span>
				{/snippet}
			</List>
		</div>
	</div>
	<CodeBlock code={customSlotCode} lang="svelte" />
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
	.flip-controls {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}
	.variant-label {
		font-size: 0.7rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.07em;
		color: var(--muted-foreground);
		margin-bottom: 0.5rem;
	}
</style>
