<script lang="ts">
	import Toast from '$lib/components/Toast.svelte';
	import Button from '$lib/components/Button.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import PropsTable from '$lib/components/PropsTable.svelte';
	import { toastStore } from '$lib/stores/toast.svelte';

	const importCode = `import Toast from '$lib/components/Toast.svelte';
import { toastStore } from '$lib/stores/toast.svelte';`;

	const setupCode = `<!-- Add once to your root layout (+layout.svelte) -->
<Toast />`;

	const usageCode = `<!-- Trigger from anywhere -->
<script lang="ts">
  import { toastStore } from '$lib/stores/toast.svelte';
<\/script>

<button onclick={() => toastStore.show('Hello!')}>
  Show toast
</button>`;

	const variantCode = `toastStore.show('Saved successfully', 'success');
toastStore.show('Something went wrong', 'error');
toastStore.show('New message received', 'info');
toastStore.show('Default notification');           // 'default'`;

	const durationCode = `// Custom duration (ms) — default is 2500
toastStore.show('Quick flash', 'success', 1000);
toastStore.show('Long message', 'info', 5000);`;

	const dismissCode = `// Dismiss a specific toast by id
const id = toastStore.show('Processing…');
// ...later
toastStore.dismiss(id);`;

	const stackCode = `// Show multiple toasts — they stack with FLIP animation
toastStore.show('First toast');
setTimeout(() => toastStore.show('Second toast', 'success'), 300);
setTimeout(() => toastStore.show('Third toast', 'error'), 600);`;

	// Toast.svelte has no user-facing props (it renders the container)
	const toastComponentProps = [
		{ name: '—', type: '—', description: 'The Toast component takes no props. It renders the fixed overlay container and reads directly from toastStore.' },
	];

	const storeApiRows = [
		{ name: 'show',    type: '(message: string, variant?: ToastVariant, duration?: number) => void', description: "Display a new toast. variant defaults to 'default', duration defaults to 2500 ms." },
		{ name: 'dismiss', type: '(id: number) => void',                                                  description: 'Immediately remove a toast by its id.' },
		{ name: 'toasts',  type: 'ToastItem[]',                                                           description: 'Reactive array of active toasts. Read by Toast.svelte to render.' },
	];
</script>

<div class="comp-header">
	<div class="comp-header-top">
		<h1 class="comp-title">Toast</h1>
		<span class="comp-badge">Feedback</span>
	</div>
	<p class="comp-desc">Stack-aware notification toasts with FLIP reflow animation. Place the Toast container once in your layout and trigger notifications from anywhere via <code class="inline-code">toastStore</code>.</p>
</div>

<section class="doc-section">
	<h2 class="doc-section-title">Import</h2>
	<CodeBlock code={importCode} lang="ts" />
</section>

<section class="doc-section">
	<h2 class="doc-section-title">Setup</h2>
	<p class="doc-section-desc">Add <code>&lt;Toast /&gt;</code> once to your root layout. This renders the fixed overlay that displays all notifications.</p>
	<CodeBlock code={setupCode} lang="svelte" />
</section>

<section class="doc-section">
	<h2 class="doc-section-title">Usage</h2>
	<p class="doc-section-desc">Call <code>toastStore.show()</code> from any component — no prop drilling or context needed.</p>
	<div class="preview-box preview-box-accent">
		<Button onclick={() => toastStore.show('Hello from the toast store!')}>
			Show toast
		</Button>
	</div>
	<CodeBlock code={usageCode} lang="svelte" />
</section>

<section class="doc-section">
	<h2 class="doc-section-title">Variants</h2>
	<p class="doc-section-desc">Four built-in variants: <code>default</code>, <code>success</code>, <code>error</code>, and <code>info</code>.</p>
	<div class="preview-box preview-box-accent" style="flex-wrap:wrap; gap:0.75rem;">
		<button
			class="toast-demo-btn toast-demo-default"
			onclick={() => toastStore.show('Default notification')}
		>
			Default
		</button>
		<button
			class="toast-demo-btn toast-demo-success"
			onclick={() => toastStore.show('Saved successfully', 'success')}
		>
			Success
		</button>
		<button
			class="toast-demo-btn toast-demo-error"
			onclick={() => toastStore.show('Something went wrong', 'error')}
		>
			Error
		</button>
		<button
			class="toast-demo-btn toast-demo-info"
			onclick={() => toastStore.show('New message received', 'info')}
		>
			Info
		</button>
	</div>
	<CodeBlock code={variantCode} lang="ts" />
</section>

<section class="doc-section">
	<h2 class="doc-section-title">Custom Duration</h2>
	<p class="doc-section-desc">Pass a third argument to override the default 2500 ms display time.</p>
	<div class="preview-box" style="gap:0.75rem;">
		<Button variant="secondary" onclick={() => toastStore.show('Quick flash', 'success', 1000)}>
			1 second
		</Button>
		<Button variant="secondary" onclick={() => toastStore.show('Normal duration', 'info')}>
			2.5 seconds
		</Button>
		<Button variant="secondary" onclick={() => toastStore.show('Longer notice', 'info', 5000)}>
			5 seconds
		</Button>
	</div>
	<CodeBlock code={durationCode} lang="ts" />
</section>

<section class="doc-section">
	<h2 class="doc-section-title">Stacking</h2>
	<p class="doc-section-desc">Toasts stack automatically with smooth FLIP reflow animation when multiple are shown in sequence.</p>
	<div class="preview-box preview-box-accent">
		<Button
			onclick={() => {
				toastStore.show('First toast');
				setTimeout(() => toastStore.show('Second toast', 'success'), 300);
				setTimeout(() => toastStore.show('Third toast', 'error'), 600);
				setTimeout(() => toastStore.show('Fourth toast', 'info'), 900);
			}}
		>
			Stack 4 toasts
		</Button>
	</div>
	<CodeBlock code={stackCode} lang="ts" />
</section>

<section class="doc-section">
	<h2 class="doc-section-title">Programmatic Dismiss</h2>
	<p class="doc-section-desc">Call <code>toastStore.dismiss(id)</code> to remove a specific toast before it expires. <code>show()</code> returns the toast's numeric id.</p>
	<CodeBlock code={dismissCode} lang="ts" />
</section>

<section class="doc-section">
	<h2 class="doc-section-title">Variant Reference</h2>
	<div class="variant-table">
		<div class="variant-row">
			<div class="variant-pill variant-pill-default">default</div>
			<span class="variant-desc">Neutral notification. Uses the card background.</span>
		</div>
		<div class="variant-row">
			<div class="variant-pill variant-pill-success">success</div>
			<span class="variant-desc">Positive outcome — saved, uploaded, completed.</span>
		</div>
		<div class="variant-row">
			<div class="variant-pill variant-pill-error">error</div>
			<span class="variant-desc">Failure or destructive action — delete failed, error occurred.</span>
		</div>
		<div class="variant-row">
			<div class="variant-pill variant-pill-info">info</div>
			<span class="variant-desc">Informational message — new message, status update.</span>
		</div>
	</div>
</section>

<section class="doc-section">
	<h2 class="doc-section-title">Store API</h2>
	<p class="doc-section-desc">Import <code>toastStore</code> from <code>'$lib/stores/toast.svelte'</code> to trigger toasts from any component.</p>
	<div class="api-table">
		{#each storeApiRows as row}
			<div class="api-row">
				<code class="api-name">{row.name}</code>
				<code class="api-type">{row.type}</code>
				<span class="api-desc">{row.description}</span>
			</div>
		{/each}
	</div>
</section>

<section class="doc-section">
	<h2 class="doc-section-title">Toast Component Props</h2>
	<PropsTable props={toastComponentProps} />
</section>

<style>
	.comp-header { margin-bottom: 2.5rem; padding-bottom: 1.5rem; border-bottom: 1px solid var(--border); }
	.comp-header-top { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.5rem; }
	.comp-title { font-size: 1.875rem; font-weight: 800; letter-spacing: -0.025em; color: var(--foreground); }
	.comp-badge { font-size: 0.65rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; background: color-mix(in srgb, var(--accent) 15%, transparent); color: var(--accent); border: 1px solid color-mix(in srgb, var(--accent) 30%, transparent); padding: 0.15rem 0.5rem; border-radius: 9999px; }
	.comp-desc { color: var(--muted-foreground); font-size: 0.9375rem; line-height: 1.6; margin-bottom: 1rem; }
	.inline-code { font-family: ui-monospace, monospace; font-size: 0.85em; background: var(--muted); padding: 0.1rem 0.35rem; border-radius: 0.25rem; color: var(--accent); }
	.doc-section { margin-bottom: 2.5rem; display: flex; flex-direction: column; gap: 1rem; }
	.doc-section-title { font-size: 1.125rem; font-weight: 700; color: var(--foreground); letter-spacing: -0.01em; }
	.doc-section-desc { font-size: 0.875rem; color: var(--muted-foreground); margin-top: -0.5rem; }
	.doc-section-desc code { font-family: ui-monospace, monospace; font-size: 0.8em; background: var(--muted); padding: 0.1rem 0.35rem; border-radius: 0.25rem; color: var(--accent); }
	.preview-box { padding: 2rem; border: 1px solid var(--border); border-radius: 0.875rem; background: var(--card); display: flex; align-items: center; justify-content: center; min-height: 6rem; flex-wrap: wrap; gap: 0.75rem; }
	.preview-box-accent { background: radial-gradient(ellipse 80% 60% at 50% 0%, color-mix(in srgb, var(--accent) 8%, transparent), transparent); }

	/* Demo buttons for variant preview */
	.toast-demo-btn { padding: 0.5rem 1.25rem; border-radius: 0.625rem; font-size: 0.875rem; font-weight: 600; cursor: pointer; border: none; transition: opacity 0.15s, transform 0.1s; }
	.toast-demo-btn:hover { opacity: 0.85; }
	.toast-demo-btn:active { transform: scale(0.96); }
	.toast-demo-default { background: var(--card); color: var(--card-foreground); border: 1px solid var(--border); }
	.toast-demo-success { background: var(--accent); color: var(--accent-foreground); }
	.toast-demo-error   { background: var(--destructive); color: var(--destructive-foreground); }
	.toast-demo-info    { background: var(--card); color: var(--card-foreground); border: 1px solid var(--border); }

	/* Variant reference table */
	.variant-table { display: flex; flex-direction: column; gap: 0.5rem; border: 1px solid var(--border); border-radius: 0.75rem; padding: 0.75rem; background: var(--card); }
	.variant-row { display: flex; align-items: center; gap: 1rem; padding: 0.375rem 0.25rem; }
	.variant-pill { font-size: 0.75rem; font-weight: 600; padding: 0.25rem 0.75rem; border-radius: 9999px; white-space: nowrap; min-width: 5rem; text-align: center; }
	.variant-pill-default { background: var(--card); color: var(--card-foreground); border: 1px solid var(--border); }
	.variant-pill-success { background: var(--accent); color: var(--accent-foreground); }
	.variant-pill-error   { background: var(--destructive); color: var(--destructive-foreground); }
	.variant-pill-info    { background: var(--card); color: var(--card-foreground); border: 1px solid var(--border); }
	.variant-desc { font-size: 0.875rem; color: var(--muted-foreground); }

	/* Store API table */
	.api-table { display: flex; flex-direction: column; border: 1px solid var(--border); border-radius: 0.75rem; overflow: hidden; }
	.api-row { display: grid; grid-template-columns: 6rem 1fr 1fr; gap: 1rem; padding: 0.75rem 1rem; border-bottom: 1px solid var(--border); align-items: start; }
	.api-row:last-child { border-bottom: none; }
	.api-name { font-family: ui-monospace, monospace; font-size: 0.78rem; color: var(--accent); background: color-mix(in srgb, var(--accent) 10%, transparent); padding: 0.1rem 0.35rem; border-radius: 0.3rem; white-space: nowrap; align-self: start; }
	.api-type { font-family: ui-monospace, monospace; font-size: 0.72rem; color: #c792ea; background: color-mix(in srgb, #c792ea 8%, transparent); padding: 0.1rem 0.35rem; border-radius: 0.3rem; align-self: start; word-break: break-all; }
	.api-desc { font-size: 0.8125rem; color: var(--muted-foreground); }
</style>
