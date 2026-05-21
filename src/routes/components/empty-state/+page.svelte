<script lang="ts">
	import EmptyState from '$lib/components/EmptyState.svelte';
	import CodeBlock  from '$lib/components/CodeBlock.svelte';
	import PropsTable from '$lib/components/PropsTable.svelte';

	let showList = $state(true);

	/* ── code snippets ── */
	const importCode = `import EmptyState from '$lib/components/EmptyState.svelte';`;

	const usageCode = `<EmptyState
  preset="inbox"
  title="All caught up"
  description="No new messages in your inbox."
/>`;

	const presetCode = `<!-- 7 built-in presets -->
<EmptyState preset="inbox"  title="All caught up"        description="No new messages." />
<EmptyState preset="search" title="No results"           description="Try different keywords." />
<EmptyState preset="data"   title="No data yet"          description="Charts appear once you have activity." />
<EmptyState preset="folder" title="This folder is empty" description="Upload files to get started." />
<EmptyState preset="users"  title="No followers yet"     description="Share your profile." />
<EmptyState preset="error"  title="Something went wrong" description="We could not load this content." />
<EmptyState preset="custom" title="Custom"               description="Bring your own icon via the icon snippet." />`;

	const actionCode = `<EmptyState
  preset="search"
  title="No results found"
  description="Try different keywords or filters."
  action={{ label: 'Clear search', onclick: () => clearSearch() }}
/>`;

	const sizesCode = `<EmptyState preset="data" title="No data" size="sm" />
<EmptyState preset="data" title="No data" size="md" />
<EmptyState preset="data" title="No data" size="lg" />`;

	const customIconCode = `<EmptyState preset="custom" title="No notifications" description="You are all caught up.">
  {#snippet icon()}
    <svg class="size-10 text-muted-foreground" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
      <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
    </svg>
  {/snippet}
</EmptyState>`;

	const props = [
		{ name: 'preset',      type: "'inbox' | 'search' | 'data' | 'folder' | 'users' | 'error' | 'custom'", default: "'inbox'", description: 'Built-in icon preset. Use custom to supply your own icon snippet.' },
		{ name: 'title',       type: 'string',                   description: 'Primary heading text.' },
		{ name: 'description', type: 'string',                   description: 'Secondary description text below the title.' },
		{ name: 'action',      type: '{ label: string, onclick: () => void }', description: 'Optional call-to-action button rendered below the description.' },
		{ name: 'size',        type: "'sm' | 'md' | 'lg'",       default: "'md'",    description: 'Controls icon size, spacing and text scale.' },
		{ name: 'icon',        type: 'Snippet',                  description: 'Custom icon snippet — used when preset is "custom".' },
		{ name: 'children',    type: 'Snippet',                  description: 'Additional content rendered below the action button.' },
		{ name: 'class',       type: 'string',                   description: 'Extra CSS classes applied to the root element.' },
	];
</script>

<!-- Page header -->
<div class="comp-header">
	<div class="comp-header-top">
		<h1 class="comp-title">EmptyState</h1>
	</div>
	<p class="comp-desc">
		Placeholder component for empty lists, zero-result searches, and error states — with 6 built-in icon presets, optional action button, and 3 size variants.
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
		<div class="preview-card">
			<EmptyState preset="inbox" title="All caught up" description="No new messages in your inbox." />
		</div>
	</div>
	<CodeBlock code={usageCode} lang="svelte" />
</section>

<!-- ── PRESETS ── -->
<section class="doc-section">
	<h2 class="doc-section-title">Presets</h2>
	<p class="doc-section-desc">Six built-in icons covering the most common empty-state scenarios.</p>
	<div class="preview-box" style="align-items: stretch;">
		<div class="presets-grid">
			{#each [
				{ preset: 'inbox',  title: 'All caught up',        desc: 'No new messages in your inbox.' },
				{ preset: 'search', title: 'No results',           desc: 'Try adjusting your search terms.' },
				{ preset: 'data',   title: 'No data yet',          desc: 'Charts will appear once you have activity.' },
				{ preset: 'folder', title: 'This folder is empty', desc: 'Upload files to get started.' },
				{ preset: 'users',  title: 'No followers yet',     desc: 'Share your profile to grow your audience.' },
				{ preset: 'error',  title: 'Something went wrong', desc: 'We could not load this content.' },
			] as item}
				<div class="preset-card">
					<EmptyState
						preset={item.preset as any}
						title={item.title}
						description={item.desc}
						size="sm"
					/>
				</div>
			{/each}
		</div>
	</div>
	<CodeBlock code={presetCode} lang="svelte" />
</section>

<!-- ── WITH ACTION ── -->
<section class="doc-section">
	<h2 class="doc-section-title">With action button</h2>
	<p class="doc-section-desc">Pass an <code>action</code> prop to render a call-to-action button.</p>
	<div class="preview-box" style="align-items: stretch; gap: 1rem; flex-wrap: wrap;">
		<div class="preview-card">
			<EmptyState
				preset="search"
				title="No results found"
				description="We couldn't find anything matching your search. Try different keywords."
				action={{ label: 'Clear search', onclick: () => {} }}
			/>
		</div>
		<div class="preview-card">
			<EmptyState
				preset="users"
				title="No followers yet"
				description="Start sharing your content to build your audience."
				action={{ label: 'Share profile', onclick: () => {} }}
			/>
		</div>
	</div>
	<CodeBlock code={actionCode} lang="svelte" />
</section>

<!-- ── SIZES ── -->
<section class="doc-section">
	<h2 class="doc-section-title">Sizes</h2>
	<p class="doc-section-desc">Use <code>size</code> to scale the icon, spacing and typography.</p>
	<div class="preview-box" style="align-items: stretch; gap: 1rem; flex-wrap: wrap;">
		{#each (['sm', 'md', 'lg'] as const) as size}
			<div class="preview-card" style="flex: 1; min-width: 10rem;">
				<div class="size-label">{size}</div>
				<EmptyState
					preset="data"
					title="No data"
					description="Nothing to show here."
					{size}
				/>
			</div>
		{/each}
	</div>
	<CodeBlock code={sizesCode} lang="svelte" />
</section>

<!-- ── CUSTOM ICON ── -->
<section class="doc-section">
	<h2 class="doc-section-title">Custom icon</h2>
	<p class="doc-section-desc">Use <code>preset="custom"</code> and pass an <code>icon</code> snippet for full control.</p>
	<div class="preview-box">
		<div class="preview-card">
			<EmptyState preset="custom" title="No notifications" description="You are all caught up.">
				{#snippet icon()}
					<svg style="width:2.5rem;height:2.5rem;color:var(--muted-foreground);" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
						<path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
					</svg>
				{/snippet}
			</EmptyState>
		</div>
	</div>
	<CodeBlock code={customIconCode} lang="svelte" />
</section>

<!-- ── IN CONTEXT ── -->
<section class="doc-section">
	<h2 class="doc-section-title">Inside a list</h2>
	<p class="doc-section-desc">Toggle the list to see the empty state rendered in context with an action to restore it.</p>
	<div class="preview-box" style="flex-direction: column; align-items: stretch; gap: 0.75rem;">
		<div>
			<button class="toggle-btn" onclick={() => (showList = !showList)}>
				{showList ? 'Clear list' : 'Show list'}
			</button>
		</div>
		<div class="list-shell">
			{#if showList}
				{#each ['Design system review', 'Publish weekly reel', 'Reply to comments'] as item}
					<div class="list-row">
						<span class="list-dot"></span>
						<span class="list-text">{item}</span>
					</div>
				{/each}
			{:else}
				<EmptyState
					preset="inbox"
					title="No tasks"
					description="You're all done for today."
					action={{ label: 'Add task', onclick: () => { showList = true; } }}
					size="sm"
				/>
			{/if}
		</div>
	</div>
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
	.presets-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 0.75rem;
		width: 100%;
	}
	@media (min-width: 640px) {
		.presets-grid { grid-template-columns: repeat(3, 1fr); }
	}

	.preset-card, .preview-card {
		border-radius: 0.75rem;
		border: 1px solid var(--border);
		background: var(--background);
		overflow: hidden;
	}

	.size-label {
		font-size: 0.7rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.07em;
		color: var(--muted-foreground);
		padding: 0.5rem 1rem 0;
		text-align: center;
	}

	.toggle-btn {
		display: inline-flex;
		align-items: center;
		padding: 0.375rem 0.875rem;
		border-radius: 0.5rem;
		border: 1px solid var(--border);
		background: transparent;
		color: var(--foreground);
		font-size: 0.8125rem;
		cursor: pointer;
		transition: background-color 0.15s;
	}
	.toggle-btn:hover { background: var(--muted); }

	.list-shell {
		border-radius: 0.75rem;
		border: 1px solid var(--border);
		background: var(--background);
		overflow: hidden;
		min-height: 11rem;
		display: flex;
		flex-direction: column;
	}

	.list-row {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.75rem 1rem;
		border-bottom: 1px solid var(--border);
	}
	.list-row:last-child { border-bottom: none; }

	.list-dot {
		width: 0.5rem;
		height: 0.5rem;
		border-radius: 9999px;
		background: var(--accent);
		flex-shrink: 0;
	}
	.list-text {
		font-size: 0.875rem;
		color: var(--foreground);
	}
</style>
