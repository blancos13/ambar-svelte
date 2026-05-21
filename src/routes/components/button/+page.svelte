<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import PropsTable from '$lib/components/PropsTable.svelte';
	import { toastStore } from '$lib/stores/toast.svelte';

	let loading = $state<Record<string, boolean>>({});

	function trigger(key: string, ms = 2000) {
		if (loading[key]) return;
		loading[key] = true;
		setTimeout(() => { loading[key] = false; }, ms);
	}

	const importCode = `import Button from '$lib/components/Button.svelte';`;

	const usageCode = `<Button>Click me</Button>`;

	const variantsCode = `<Button>Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="danger">Danger</Button>`;

	const sizesCode = `<Button size="sm">Small</Button>
<Button>Default</Button>
<Button size="lg">Large</Button>`;

	const iconCode = `<Button variant="icon" ariaLabel="Like">
  <svg .../>
</Button>`;

	const loadingCode = `<Button loading={true}>Loading...</Button>`;

	const linkCode = `<Button href="/dashboard">Go to Dashboard</Button>
<Button href="https://example.com" external>External Link</Button>`;

	const props = [
		{ name: 'variant',      type: "'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'icon'", default: "'primary'",    description: 'Visual style of the button.' },
		{ name: 'size',         type: "'sm' | 'md' | 'lg' | 'icon'",                                        default: "'md'",         description: 'Size preset for padding and font.' },
		{ name: 'href',         type: 'string',                                                              description: 'Renders as <a> when provided.' },
		{ name: 'external',     type: 'boolean',                                                             default: 'false',        description: 'Adds target="_blank" rel="noreferrer" to links.' },
		{ name: 'disabled',     type: 'boolean',                                                             default: 'false',        description: 'Prevents interaction and reduces opacity.' },
		{ name: 'loading',      type: 'boolean',                                                             default: 'false',        description: 'Shows spinner; blocks clicks during async operations.' },
		{ name: 'fullWidth',    type: 'boolean',                                                             default: 'false',        description: 'Stretches to fill its container width.' },
		{ name: 'type',         type: "'button' | 'submit' | 'reset'",                                       default: "'button'",     description: 'HTML button type attribute.' },
		{ name: 'ariaLabel',    type: 'string',                                                              description: 'Accessible label, required for icon-only buttons.' },
		{ name: 'ariaPressed',  type: 'boolean',                                                             description: 'ARIA toggle state for icon buttons.' },
		{ name: 'onclick',      type: '(e: MouseEvent) => void',                                             description: 'Click handler — skipped when disabled or loading.' },
		{ name: 'class',        type: 'string',                                                              description: 'Extra CSS classes merged with the base button class.' },
		{ name: 'children',     type: 'Snippet',                                                             description: 'Button label and optional icon content.' },
	];
</script>

<!-- Page header -->
<div class="comp-header">
	<div class="comp-header-top">
		<h1 class="comp-title">Button</h1>
		<span class="comp-badge">Updated</span>
	</div>
	<p class="comp-desc">Interactive button component with variants, sizes, loading state, and link rendering.</p>

	<div class="comp-links">
		<a href="https://github.com" target="_blank" rel="noreferrer" class="comp-link">
			<svg viewBox="0 0 24 24" fill="currentColor" class="size-3.5"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/></svg>
			Source
		</a>
	</div>
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
		<Button>Click me</Button>
	</div>
	<CodeBlock code={usageCode} lang="svelte" />
</section>

<!-- ── VARIANTS ── -->
<section class="doc-section">
	<h2 class="doc-section-title">Variants</h2>
	<p class="doc-section-desc">Five visual styles to match your UI context.</p>
	<div class="preview-box">
		<div class="flex flex-wrap items-center gap-3">
			<Button>Primary</Button>
			<Button variant="secondary">Secondary</Button>
			<Button variant="outline">Outline</Button>
			<Button variant="ghost">Ghost</Button>
			<Button variant="danger">Danger</Button>
		</div>
	</div>
	<CodeBlock code={variantsCode} lang="svelte" />
</section>

<!-- ── SIZES ── -->
<section class="doc-section">
	<h2 class="doc-section-title">Sizes</h2>
	<div class="preview-box">
		<div class="flex flex-wrap items-end gap-3">
			<Button size="sm">Small</Button>
			<Button>Default</Button>
			<Button size="lg">Large</Button>
		</div>
	</div>
	<CodeBlock code={sizesCode} lang="svelte" />
</section>

<!-- ── WITH ICONS ── -->
<section class="doc-section">
	<h2 class="doc-section-title">With Icons</h2>
	<p class="doc-section-desc">Pass SVG icons as children — they inherit <code>currentColor</code>.</p>
	<div class="preview-box">
		<div class="flex flex-wrap items-center gap-3">
			<Button>
				<svg class="size-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4"/></svg>
				Create
			</Button>
			<Button variant="secondary">
				<svg class="size-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
				Like
			</Button>
			<Button variant="outline">
				<svg class="size-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/></svg>
				Share
			</Button>
		</div>
	</div>
</section>

<!-- ── ICON ONLY ── -->
<section class="doc-section">
	<h2 class="doc-section-title">Icon Only</h2>
	<p class="doc-section-desc">Use <code>variant="icon"</code> with <code>ariaLabel</code> for accessible icon buttons.</p>
	<div class="preview-box">
		<div class="flex items-center gap-2">
			<Button variant="icon" ariaLabel="Like">
				<svg class="size-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
			</Button>
			<Button variant="icon" ariaLabel="Comment">
				<svg class="size-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
			</Button>
			<Button variant="icon" ariaLabel="Notifications">
				<svg class="size-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
			</Button>
		</div>
	</div>
	<CodeBlock code={iconCode} lang="svelte" />
</section>

<!-- ── LOADING ── -->
<section class="doc-section">
	<h2 class="doc-section-title">Loading State</h2>
	<p class="doc-section-desc">Shows a spinner and blocks clicks during async operations. Click to see it in action.</p>
	<div class="preview-box">
		<div class="flex flex-wrap items-center gap-3">
			<Button class="min-w-28" loading={loading['a']} onclick={() => trigger('a')}>
				{loading['a'] ? 'Loading...' : 'Save'}
			</Button>
			<Button variant="secondary" class="min-w-28" loading={loading['b']} onclick={() => trigger('b')}>
				{loading['b'] ? 'Sending...' : 'Send'}
			</Button>
			<Button variant="outline" class="min-w-28" loading={loading['c']} onclick={() => trigger('c')}>
				{loading['c'] ? 'Uploading...' : 'Upload'}
			</Button>
			<Button variant="danger" class="min-w-28" loading={loading['d']} onclick={() => trigger('d', 1500)}>
				{loading['d'] ? 'Deleting...' : 'Delete'}
			</Button>
		</div>
	</div>
	<CodeBlock code={loadingCode} lang="svelte" />
</section>

<!-- ── AS LINK ── -->
<section class="doc-section">
	<h2 class="doc-section-title">As Link</h2>
	<p class="doc-section-desc">Pass <code>href</code> to render as <code>&lt;a&gt;</code> — all button styles apply.</p>
	<div class="preview-box">
		<div class="flex flex-wrap items-center gap-3">
			<Button href="/">Go to Home</Button>
			<Button href="https://github.com" variant="outline" external>GitHub ↗</Button>
		</div>
	</div>
	<CodeBlock code={linkCode} lang="svelte" />
</section>

<!-- ── DISABLED ── -->
<section class="doc-section">
	<h2 class="doc-section-title">Disabled State</h2>
	<div class="preview-box">
		<div class="flex flex-wrap items-center gap-3">
			<Button disabled>Disabled</Button>
			<Button variant="secondary" disabled>Disabled</Button>
			<Button variant="outline" disabled>Disabled</Button>
		</div>
	</div>
</section>

<!-- ── INTERACTIVE DEMO ── -->
<section class="doc-section">
	<h2 class="doc-section-title">Interactive Demo</h2>
	<div class="preview-box preview-box-accent">
		<div class="flex flex-wrap items-center gap-4">
			<Button size="lg" onclick={() => toastStore.show('Saved successfully!', 'success')}>
				Save changes
			</Button>
			<Button variant="secondary" size="lg" onclick={() => toastStore.show('Message sent', 'info')}>
				Send message
			</Button>
			<Button variant="outline" size="lg" onclick={() => toastStore.show('Link copied!', 'info')}>
				Copy link
			</Button>
			<Button variant="danger" size="lg" onclick={() => toastStore.show('Deleted!', 'error')}>
				Delete
			</Button>
		</div>
	</div>
</section>

<!-- ── API REFERENCE ── -->
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

	.comp-links {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
	}

	.comp-link {
		display: inline-flex;
		align-items: center;
		gap: 0.375rem;
		font-size: 0.78rem;
		font-weight: 600;
		color: var(--muted-foreground);
		background: var(--secondary);
		border: 1px solid var(--border);
		padding: 0.3rem 0.75rem;
		border-radius: 0.5rem;
		text-decoration: none;
		transition: color 0.15s, border-color 0.15s;
	}

	.comp-link:hover {
		color: var(--foreground);
		border-color: var(--foreground);
	}

	/* ── Sections ── */
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

	/* ── Preview box ── */
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
</style>
