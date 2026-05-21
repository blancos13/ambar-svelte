<script lang="ts">
	import Sheet from '$lib/components/Sheet.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import PropsTable from '$lib/components/PropsTable.svelte';

	let opens: Record<string, boolean> = $state({});
	const open  = (k: string) => { opens[k] = true;  };
	const close = (k: string) => { opens[k] = false; };

	const importCode = `import Sheet from '$lib/components/Sheet.svelte';`;

	const usageCode = `<script lang="ts">
  let open = $state(false);
<\/script>

<Button onclick={() => (open = true)}>Open Sheet</Button>

<Sheet {open} onClose={() => (open = false)} title="Options" size="md">
  <p>Sheet content goes here.</p>
  {#snippet footer()}
    <Button onclick={() => (open = false)}>Confirm</Button>
  {/snippet}
</Sheet>`;

	const props = [
		{ name: 'open',     type: 'boolean',                      default: '—',         description: 'Controls whether the sheet is visible.' },
		{ name: 'onClose',  type: '() => void',                   default: '—',         description: 'Callback fired when the backdrop is clicked, Escape is pressed, or the user swipes down past the dismiss threshold.' },
		{ name: 'title',    type: 'string',                       default: 'undefined', description: 'Optional header title displayed with a close button.' },
		{ name: 'size',     type: "'sm' | 'md' | 'lg' | 'full'", default: "'md'",      description: 'Height of the sheet panel: sm (38vh), md (56vh), lg (78vh), full (96vh).' },
		{ name: 'children', type: 'Snippet',                      default: '—',         description: 'Scrollable body content.' },
		{ name: 'footer',   type: 'Snippet',                      default: 'undefined', description: 'Optional sticky footer rendered below the body.' },
	];
</script>

<div class="comp-header">
	<div class="comp-header-top">
		<h1 class="comp-title">Sheet</h1>
		<span class="comp-badge">Overlay</span>
	</div>
	<p class="comp-desc">Bottom sheet with drag handle, swipe-to-dismiss, spring animation, and 4 size presets. Portal-based.</p>
</div>

<section class="doc-section">
	<h2 class="doc-section-title">Import</h2>
	<CodeBlock code={importCode} lang="ts" />
</section>

<section class="doc-section">
	<h2 class="doc-section-title">Usage</h2>
	<CodeBlock code={usageCode} lang="svelte" />
</section>

<section class="doc-section">
	<h2 class="doc-section-title">Sizes</h2>
	<p class="doc-section-desc">sm (38vh) · md (56vh) · lg (78vh) · full (96vh). Drag the handle or tap the backdrop to dismiss.</p>
	<div class="preview-box preview-box-accent">
		{#each (['sm', 'md', 'lg', 'full'] as const) as size}
			<button
				onclick={() => open(size)}
				class="rounded-lg bg-card border border-border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors"
			>
				{size}
			</button>

			<Sheet
				open={opens[size] ?? false}
				onClose={() => close(size)}
				title="Sheet — {size}"
				{size}
			>
				<div class="space-y-3 text-sm text-muted-foreground">
					<p>This is a <strong class="text-foreground">{size}</strong> sheet. Drag the handle down or tap the backdrop to dismiss.</p>
					<p>Sheets slide up from the bottom with a spring animation. They're great for actions, pickers, and detail panels.</p>
					{#each [1,2,3] as i}
						<div class="rounded-lg bg-muted p-3 text-foreground">Content block {i}</div>
					{/each}
				</div>
				{#snippet footer()}
					<div class="flex gap-2">
						<button
							onclick={() => close(size)}
							class="flex-1 rounded-lg border border-border py-2 text-sm font-medium hover:bg-muted transition-colors"
						>
							Cancel
						</button>
						<button
							onclick={() => close(size)}
							class="flex-1 rounded-lg bg-primary py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity"
						>
							Confirm
						</button>
					</div>
				{/snippet}
			</Sheet>
		{/each}
	</div>
</section>

<section class="doc-section">
	<h2 class="doc-section-title">Use Cases</h2>
	<p class="doc-section-desc">Real-world sheet patterns: filter panel and iOS-style share sheet.</p>
	<div class="preview-box">
		<button
			onclick={() => open('filter')}
			class="inline-flex items-center gap-2 rounded-lg bg-card border border-border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors"
		>
			<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				<polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
			</svg>
			Filters
		</button>

		<button
			onclick={() => open('share')}
			class="inline-flex items-center gap-2 rounded-lg bg-card border border-border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors"
		>
			<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				<path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/>
			</svg>
			Share
		</button>
	</div>
</section>

<!-- Filter sheet (portal) -->
<Sheet
	open={opens['filter'] ?? false}
	onClose={() => close('filter')}
	title="Filter & Sort"
	size="md"
>
	<div class="space-y-6">
		<div>
			<p class="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Content type</p>
			<div class="flex flex-wrap gap-2">
				{#each ['All', 'Reels', 'Photos', 'Stories', 'Lives'] as t}
					<button class="rounded-full border border-border px-3 py-1 text-sm hover:bg-muted transition-colors first:bg-accent first:text-accent-foreground first:border-accent">
						{t}
					</button>
				{/each}
			</div>
		</div>
		<div>
			<p class="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Sort by</p>
			<div class="space-y-1">
				{#each ['Most recent', 'Most views', 'Most likes', 'Most comments'] as s}
					<label class="flex items-center gap-3 rounded-lg p-2 hover:bg-muted cursor-pointer transition-colors">
						<input type="radio" name="sort" class="accent-[var(--accent)]" />
						<span class="text-sm text-foreground">{s}</span>
					</label>
				{/each}
			</div>
		</div>
		<div>
			<p class="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Date range</p>
			<div class="grid grid-cols-2 gap-2">
				{#each ['Last 7 days', 'Last 30 days', 'Last 90 days', 'All time'] as r}
					<button class="rounded-lg border border-border px-3 py-2 text-sm text-left hover:bg-muted transition-colors">{r}</button>
				{/each}
			</div>
		</div>
	</div>
	{#snippet footer()}
		<div class="flex gap-2">
			<button
				onclick={() => close('filter')}
				class="flex-1 rounded-lg border border-border py-2 text-sm font-medium hover:bg-muted transition-colors"
			>
				Reset
			</button>
			<button
				onclick={() => close('filter')}
				class="flex-1 rounded-lg bg-primary py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity"
			>
				Apply filters
			</button>
		</div>
	{/snippet}
</Sheet>

<!-- Share sheet (portal) -->
<Sheet
	open={opens['share'] ?? false}
	onClose={() => close('share')}
	size="sm"
>
	<div class="space-y-4">
		<p class="text-sm font-semibold text-foreground">Share this post</p>
		<div class="grid grid-cols-4 gap-3 text-center">
			{#each [
				{ label: 'Copy link', icon: 'M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244' },
				{ label: 'Message', icon: 'M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z' },
				{ label: 'Instagram', icon: 'M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z' },
				{ label: 'More', icon: 'M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z' },
			] as item}
				<button
					onclick={() => close('share')}
					class="flex flex-col items-center gap-1.5 group"
				>
					<span class="flex size-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
						<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
							<path d={item.icon}/>
						</svg>
					</span>
					<span class="text-[11px] text-muted-foreground">{item.label}</span>
				</button>
			{/each}
		</div>
	</div>
</Sheet>

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
</style>
