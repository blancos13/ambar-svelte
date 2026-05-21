<script lang="ts">
	import Textarea from '$lib/components/Textarea.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import PropsTable from '$lib/components/PropsTable.svelte';

	let v = $state({ bio: '', caption: '', comment: '', desc: '' });

	const importCode = `import Textarea from '$lib/components/Textarea.svelte';`;

	const usageCode = `<Textarea label="Bio" placeholder="Tell us about yourself..." />`;

	const maxlengthCode = `<Textarea label="Bio" maxlength={150} placeholder="Tell us about yourself..." />`;

	const autoresizeCode = `<Textarea label="Caption" autoresize rows={2} placeholder="Add a caption..." />`;

	const statesCode = `<!-- Error -->
<Textarea label="Bio" error="Bio is required." />

<!-- Disabled -->
<Textarea label="Description" value="This account is disabled." disabled />`;

	const props = [
		{ name: 'label',       type: 'string',            description: 'Floating label text.' },
		{ name: 'value',       type: 'string',            default: "''",     description: 'Bindable textarea value.' },
		{ name: 'placeholder', type: 'string',            description: 'Placeholder text shown when empty.' },
		{ name: 'rows',        type: 'number',            default: '3',      description: 'Initial row count.' },
		{ name: 'maxlength',   type: 'number',            description: 'Max character count — shows a counter.' },
		{ name: 'autoresize',  type: 'boolean',           default: 'false',  description: 'Grows with content, no scrollbar.' },
		{ name: 'hint',        type: 'string',            description: 'Helper text shown below the textarea.' },
		{ name: 'error',       type: 'string',            description: 'Error message — replaces hint, adds red ring.' },
		{ name: 'disabled',    type: 'boolean',           default: 'false',  description: 'Disables input and reduces opacity.' },
		{ name: 'class',       type: 'string',            description: 'Extra CSS classes.' },
	];
</script>

<!-- Page header -->
<div class="comp-header">
	<div class="comp-header-top">
		<h1 class="comp-title">Textarea</h1>
	</div>
	<p class="comp-desc">Multi-line text input with floating label, character counter, auto-resize, and error states.</p>
	<div class="comp-links">
		<a href="https://github.com" target="_blank" rel="noreferrer" class="comp-link">
			<svg viewBox="0 0 24 24" fill="currentColor" class="size-3.5"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/></svg>
			Source
		</a>
	</div>
</div>

<section class="doc-section">
	<h2 class="doc-section-title">Import</h2>
	<CodeBlock code={importCode} lang="ts" />
</section>

<section class="doc-section">
	<h2 class="doc-section-title">Usage</h2>
	<div class="preview-box">
		<div class="w-full max-w-sm">
			<Textarea label="Bio" placeholder="Tell us about yourself..." />
		</div>
	</div>
	<CodeBlock code={usageCode} lang="svelte" />
</section>

<section class="doc-section">
	<h2 class="doc-section-title">Character Counter</h2>
	<p class="doc-desc">Pass <code>maxlength</code> to show a live character counter below the textarea.</p>
	<div class="preview-box">
		<div class="w-full max-w-sm">
			<Textarea bind:value={v.bio} label="Bio" maxlength={150} placeholder="Tell us about yourself..." hint="Visible to everyone" />
		</div>
	</div>
	<CodeBlock code={maxlengthCode} lang="svelte" />
</section>

<section class="doc-section">
	<h2 class="doc-section-title">Auto Resize</h2>
	<p class="doc-desc">When <code>autoresize</code> is set, the textarea expands with content instead of scrolling.</p>
	<div class="preview-box">
		<div class="w-full max-w-sm">
			<Textarea bind:value={v.caption} label="Caption" autoresize rows={2} placeholder="Add a caption..." />
		</div>
	</div>
	<CodeBlock code={autoresizeCode} lang="svelte" />
</section>

<section class="doc-section">
	<h2 class="doc-section-title">States</h2>
	<p class="doc-desc">Error and disabled states.</p>
	<div class="preview-box">
		<div class="w-full max-w-sm space-y-4">
			<Textarea label="Bio" error="Bio is required." />
			<Textarea label="Description" value="This account is disabled." disabled />
		</div>
	</div>
	<CodeBlock code={statesCode} lang="svelte" />
</section>

<section class="doc-section">
	<h2 class="doc-section-title">Multiple Sizes</h2>
	<div class="preview-box">
		<div class="w-full max-w-sm space-y-4">
			<Textarea label="Comment" placeholder="Write a comment..." rows={2} />
			<Textarea label="Description" placeholder="Describe your project..." rows={4} maxlength={300} />
			<Textarea label="Notes" placeholder="Long-form notes..." rows={6} />
		</div>
	</div>
</section>

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
	.comp-desc {
		color: var(--muted-foreground);
		font-size: 0.9375rem;
		line-height: 1.6;
		margin-bottom: 1rem;
	}
	.comp-links { display: flex; gap: 0.5rem; flex-wrap: wrap; }
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
	.comp-link:hover { color: var(--foreground); border-color: var(--foreground); }

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
	}
	.doc-desc {
		font-size: 0.875rem;
		color: var(--muted-foreground);
		margin-top: -0.5rem;
	}
	.doc-desc code {
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
		align-items: flex-start;
		justify-content: center;
		min-height: 6rem;
	}
</style>
