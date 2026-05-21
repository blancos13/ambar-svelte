<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Spinner from '$lib/components/Spinner.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import PropsTable from '$lib/components/PropsTable.svelte';

	type Variant = 'ring' | 'ring-dual' | 'ring-split' | 'ring-track' | 'dots' | 'bounce' | 'pulse' | 'bars' | 'wave' | 'ripple' | 'orbit';

	const variants: Variant[] = ['ring', 'ring-dual', 'ring-split', 'ring-track', 'dots', 'bounce', 'pulse', 'bars', 'wave', 'ripple', 'orbit'];

	/* Interactive button states */
	let loadingStates = $state<Record<string, boolean>>({});

	function triggerLoad(key: string, ms = 2000) {
		if (loadingStates[key]) return;
		loadingStates[key] = true;
		setTimeout(() => { loadingStates[key] = false; }, ms);
	}

	/* Overlay demo */
	let overlayActive = $state(false);
	function triggerOverlay() {
		overlayActive = true;
		setTimeout(() => { overlayActive = false; }, 2500);
	}

	/* Selected variant for playground */
	let playVariant = $state<Variant>('ring');
	let playSize    = $state<'xs'|'sm'|'md'|'lg'|'xl'>('md');

	const importCode = `import Spinner from '$lib/components/Spinner.svelte';`;

	const usageCode = `<Spinner />
<Spinner variant="dots" size="lg" />
<Spinner variant="bounce" color="var(--destructive)" />`;

	const variantsCode = `<Spinner variant="ring" />
<Spinner variant="ring-dual" />
<Spinner variant="ring-split" />
<Spinner variant="ring-track" />
<Spinner variant="dots" />
<Spinner variant="bounce" />
<Spinner variant="pulse" />
<Spinner variant="bars" />
<Spinner variant="wave" />
<Spinner variant="ripple" />
<Spinner variant="orbit" />`;

	const sizesCode = `<Spinner size="xs" />
<Spinner size="sm" />
<Spinner size="md" />
<Spinner size="lg" />
<Spinner size="xl" />`;

	const buttonCode = `<Button disabled={loading} onclick={handleSave}>
  {#if loading}
    <Spinner size="xs" color="currentColor" />
    Saving...
  {:else}
    Save
  {/if}
</Button>`;

	const overlayCode = `<div class="relative">
  <!-- your content -->
  {#if loading}
    <div class="absolute inset-0 flex items-center justify-center bg-background/70 backdrop-blur-sm">
      <Spinner size="lg" variant="ring-dual" />
    </div>
  {/if}
</div>`;

	const props = [
		{ name: 'variant', type: "'ring' | 'ring-dual' | 'ring-split' | 'ring-track' | 'dots' | 'bounce' | 'pulse' | 'bars' | 'wave' | 'ripple' | 'orbit'", default: "'ring'", description: 'Animation style of the spinner.' },
		{ name: 'size',    type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'",                                                                                         default: "'md'",  description: 'Size preset for the spinner.' },
		{ name: 'color',   type: 'string',                                                                                                                     default: 'var(--accent)', description: 'CSS color value or custom property for the spinner fill.' },
	];
</script>

<!-- Page header -->
<div class="comp-header">
	<div class="comp-header-top">
		<h1 class="comp-title">Spinner</h1>
	</div>
	<p class="comp-desc">11 loading animation variants — ring, dots, pulse, bars, wave, and more. Composable with buttons and overlays.</p>
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
		<Spinner />
		<Spinner variant="dots" size="lg" />
		<Spinner variant="bounce" color="var(--destructive)" />
	</div>
	<CodeBlock code={usageCode} lang="svelte" />
</section>

<!-- ── VARIANTS ── -->
<section class="doc-section">
	<h2 class="doc-section-title">Variants</h2>
	<p class="doc-section-desc">Click any card to trigger a 2s loading state and see the accent color.</p>
	<div class="variant-grid">
		{#each variants as v}
			<button
				type="button"
				class="variant-card {loadingStates[v] ? 'variant-card-active' : ''}"
				onclick={() => triggerLoad(v)}
			>
				{#if loadingStates[v]}
					<Spinner variant={v} size="md" />
				{:else}
					<Spinner variant={v} size="md" color="var(--muted-foreground)" />
				{/if}
				<span class="variant-label {loadingStates[v] ? 'variant-label-active' : ''}">{v}</span>
			</button>
		{/each}
	</div>
	<CodeBlock code={variantsCode} lang="svelte" />
</section>

<!-- ── SIZES ── -->
<section class="doc-section">
	<h2 class="doc-section-title">Sizes</h2>
	<p class="doc-section-desc">Five size presets: <code>xs</code> · <code>sm</code> · <code>md</code> · <code>lg</code> · <code>xl</code>.</p>
	<div class="preview-box">
		<div class="sizes-row">
			{#each ['xs', 'sm', 'md', 'lg', 'xl'] as size}
				<div class="size-item">
					<Spinner size={size as any} />
					<span class="size-label">{size}</span>
				</div>
			{/each}
		</div>
	</div>
	<CodeBlock code={sizesCode} lang="svelte" />
</section>

<!-- ── WITH BUTTONS ── -->
<section class="doc-section">
	<h2 class="doc-section-title">With Buttons</h2>
	<p class="doc-section-desc">Compose with buttons to show inline loading state. Use <code>color="currentColor"</code> to inherit the button's text color.</p>
	<div class="preview-box">
		<div class="flex flex-wrap gap-3">
			<Button
				class="min-w-32 gap-2"
				disabled={loadingStates['btn1']}
				onclick={() => triggerLoad('btn1')}
			>
				{#if loadingStates['btn1']}
					<Spinner size="xs" color="currentColor" />
					Loading...
				{:else}
					Follow
				{/if}
			</Button>

			<Button
				variant="secondary"
				class="min-w-32 gap-2"
				disabled={loadingStates['btn2']}
				onclick={() => triggerLoad('btn2')}
			>
				{#if loadingStates['btn2']}
					<Spinner size="xs" variant="dots" color="currentColor" />
					Saving...
				{:else}
					Save
				{/if}
			</Button>

			<Button
				variant="outline"
				class="min-w-32 gap-2"
				disabled={loadingStates['btn3']}
				onclick={() => triggerLoad('btn3')}
			>
				{#if loadingStates['btn3']}
					<Spinner size="xs" variant="ring-dual" color="currentColor" />
					Sending...
				{:else}
					Comment
				{/if}
			</Button>

			<Button
				variant="danger"
				class="min-w-32 gap-2"
				disabled={loadingStates['btn4']}
				onclick={() => triggerLoad('btn4', 1500)}
			>
				{#if loadingStates['btn4']}
					<Spinner size="xs" variant="pulse" color="currentColor" />
					Deleting...
				{:else}
					Delete
				{/if}
			</Button>
		</div>
	</div>
	<CodeBlock code={buttonCode} lang="svelte" />
</section>

<!-- ── OVERLAY ── -->
<section class="doc-section">
	<h2 class="doc-section-title">Overlay</h2>
	<p class="doc-section-desc">Render a spinner overlay on top of content using absolute positioning and a backdrop blur.</p>
	<div class="preview-box">
		<div class="overlay-demo">
			<div class="overlay-content">
				<div class="overlay-line" style="width: 12rem;"></div>
				<div class="overlay-line" style="width: 9rem;"></div>
				<div class="overlay-line" style="width: 11rem;"></div>
			</div>
			<Button class="mt-5" onclick={triggerOverlay} disabled={overlayActive}>
				Load content
			</Button>

			{#if overlayActive}
				<div class="overlay-veil">
					<Spinner size="lg" variant="ring-dual" />
				</div>
			{/if}
		</div>
	</div>
	<CodeBlock code={overlayCode} lang="svelte" />
</section>

<!-- ── PLAYGROUND ── -->
<section class="doc-section">
	<h2 class="doc-section-title">Playground</h2>
	<p class="doc-section-desc">Pick a variant and size to preview the spinner.</p>
	<div class="playground">
		<div class="playground-preview">
			<Spinner variant={playVariant} size={playSize} />
		</div>
		<div class="playground-controls">
			<div>
				<p class="control-label">Variant</p>
				<div class="control-pills">
					{#each variants as v}
						<button
							type="button"
							class="control-pill {playVariant === v ? 'control-pill-active' : ''}"
							onclick={() => (playVariant = v)}
						>{v}</button>
					{/each}
				</div>
			</div>
			<div>
				<p class="control-label">Size</p>
				<div class="control-pills">
					{#each ['xs', 'sm', 'md', 'lg', 'xl'] as s}
						<button
							type="button"
							class="control-pill {playSize === s ? 'control-pill-active' : ''}"
							onclick={() => (playSize = s as any)}
						>{s}</button>
					{/each}
				</div>
			</div>
		</div>
	</div>
</section>

<!-- ── API REFERENCE ── -->
<section class="doc-section">
	<h2 class="doc-section-title">API Reference</h2>
	<PropsTable {props} />
</section>

<style>
	.comp-header { margin-bottom: 2.5rem; padding-bottom: 1.5rem; border-bottom: 1px solid var(--border); }
	.comp-header-top { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.5rem; }
	.comp-title { font-size: 1.875rem; font-weight: 800; letter-spacing: -0.025em; color: var(--foreground); }
	.comp-desc { color: var(--muted-foreground); font-size: 0.9375rem; line-height: 1.6; margin-bottom: 1rem; }
	.doc-section { margin-bottom: 2.5rem; display: flex; flex-direction: column; gap: 1rem; }
	.doc-section-title { font-size: 1.125rem; font-weight: 700; color: var(--foreground); letter-spacing: -0.01em; }
	.doc-section-desc { font-size: 0.875rem; color: var(--muted-foreground); margin-top: -0.5rem; }
	.doc-section-desc code { font-family: ui-monospace, monospace; font-size: 0.8em; background: var(--muted); padding: 0.1rem 0.35rem; border-radius: 0.25rem; color: var(--accent); }
	.preview-box { padding: 2rem; border: 1px solid var(--border); border-radius: 0.875rem; background: var(--card); display: flex; align-items: center; justify-content: center; min-height: 6rem; flex-wrap: wrap; gap: 0.75rem; }

	/* Variants grid */
	.variant-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 0.75rem;
	}

	@media (min-width: 480px) { .variant-grid { grid-template-columns: repeat(4, 1fr); } }
	@media (min-width: 640px) { .variant-grid { grid-template-columns: repeat(6, 1fr); } }

	.variant-card {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.75rem;
		padding: 1.25rem 0.75rem;
		border-radius: 1rem;
		background: var(--card);
		border: 1px solid var(--border);
		cursor: pointer;
		transition: background 0.15s, transform 0.1s;
	}

	.variant-card:hover { background: color-mix(in srgb, var(--card) 85%, var(--border)); }
	.variant-card:active { transform: scale(0.95); }
	.variant-card-active { border-color: color-mix(in srgb, var(--accent) 40%, transparent); }

	.variant-label {
		font-size: 0.72rem;
		color: var(--muted-foreground);
	}

	.variant-label-active {
		color: var(--accent);
		font-weight: 500;
	}

	/* Sizes */
	.sizes-row {
		display: flex;
		align-items: flex-end;
		gap: 2rem;
		flex-wrap: wrap;
	}

	.size-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.75rem;
	}

	.size-label {
		font-size: 0.75rem;
		color: var(--muted-foreground);
	}

	/* Overlay demo */
	.overlay-demo {
		position: relative;
		border-radius: 1rem;
		border: 1px solid var(--border);
		background: var(--card);
		padding: 2rem;
	}

	.overlay-content {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.overlay-line {
		height: 0.75rem;
		border-radius: 9999px;
		background: var(--muted);
	}

	.overlay-veil {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 1rem;
		background: color-mix(in srgb, var(--background) 70%, transparent);
		backdrop-filter: blur(4px);
	}

	/* Playground */
	.playground {
		border: 1px solid var(--border);
		border-radius: 0.875rem;
		background: var(--card);
		overflow: hidden;
	}

	.playground-preview {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 7rem;
		border-bottom: 1px solid var(--border);
	}

	.playground-controls {
		padding: 1.25rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.control-label {
		font-size: 0.72rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: var(--muted-foreground);
		margin-bottom: 0.5rem;
	}

	.control-pills {
		display: flex;
		flex-wrap: wrap;
		gap: 0.375rem;
	}

	.control-pill {
		padding: 0.25rem 0.75rem;
		border-radius: 0.5rem;
		font-size: 0.75rem;
		background: var(--muted);
		color: var(--muted-foreground);
		border: none;
		cursor: pointer;
		transition: background 0.1s, color 0.1s, transform 0.1s;
	}

	.control-pill:hover { background: var(--border); }
	.control-pill:active { transform: scale(0.95); }

	.control-pill-active {
		background: var(--accent);
		color: var(--accent-foreground);
		font-weight: 500;
	}
</style>
