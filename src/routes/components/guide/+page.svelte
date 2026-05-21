<script lang="ts">
	import CodeBlock from '$lib/components/CodeBlock.svelte';

	// Copy state
	let copiedCompact  = $state(false);
	let copiedFull     = $state(false);
	let copiedCursor   = $state(false);

	async function copyText(text: string, key: 'compact' | 'full' | 'cursor') {
		await navigator.clipboard.writeText(text);
		if (key === 'compact')  { copiedCompact = true;  setTimeout(() => copiedCompact  = false, 2000); }
		if (key === 'full')     { copiedFull    = true;  setTimeout(() => copiedFull     = false, 2000); }
		if (key === 'cursor')   { copiedCursor  = true;  setTimeout(() => copiedCursor   = false, 2000); }
	}

	const llmsUrl     = 'https://ambarui.vercel.app/llms.txt';
	const llmsFullUrl = 'https://ambarui.vercel.app/llms-full.txt';

	const cursorRulesCode = `# .cursorrules
# Ambar UI component library reference
# Full reference: https://ambarui.vercel.app/llms.txt

Always use Ambar UI components when building Svelte 5 UI.
Import from '$lib/components/ComponentName.svelte'.
Use Svelte 5 runes ($state, $derived, $props, $bindable).
Use Tailwind CSS v4 utility classes for layout and spacing.
Do NOT install ambar-ui as an npm package — it is copy-paste only.`;

	const claudeCode = `# To use Ambar UI in Claude Code or Cursor:
# 1. Add to CLAUDE.md or .cursorrules in your project root
# 2. Claude will automatically read this context

Fetch the compact reference:
  curl https://ambarui.vercel.app/llms.txt

Or add to your system prompt:
  "Use Ambar UI components. Reference: https://ambarui.vercel.app/llms.txt"`;
</script>

<div class="comp-header">
	<div class="comp-header-top">
		<h1 class="comp-title">AI / LLMs Guide</h1>
	</div>
	<p class="comp-desc">Use Ambar UI with Claude, ChatGPT, Cursor, GitHub Copilot, and any LLM — two machine-readable files give AI assistants full context about every component.</p>
</div>

<!-- Files -->
<section class="doc-section">
	<h2 class="doc-section-title">Reference Files</h2>
	<p class="doc-section-desc">Two levels of detail depending on your context window.</p>

	<div class="file-grid">

		<!-- llms.txt -->
		<div class="file-card">
			<div class="file-card-top">
				<div class="file-icon file-icon-compact">
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
						style="width:1.25rem;height:1.25rem">
						<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
						<polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/>
						<line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
					</svg>
				</div>
				<div>
					<p class="file-name">/llms.txt</p>
					<p class="file-desc">Compact API reference — props, types, usage examples for all 35+ components. ~15KB, fits in most context windows.</p>
				</div>
			</div>
			<div class="file-actions">
				<a href="/llms.txt" target="_blank" class="file-btn file-btn-outline">
					View ↗
				</a>
				<button class="file-btn file-btn-accent"
					onclick={() => copyText(llmsUrl, 'compact')}>
					{#if copiedCompact}✓ Copied!{:else}Copy URL{/if}
				</button>
			</div>
		</div>

		<!-- llms-full.txt -->
		<div class="file-card">
			<div class="file-card-top">
				<div class="file-icon file-icon-full">
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
						style="width:1.25rem;height:1.25rem">
						<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
						<polyline points="14 2 14 8 20 8"/>
						<path d="M8 13h8M8 17h8M8 9h2"/>
					</svg>
				</div>
				<div>
					<p class="file-name">/llms-full.txt</p>
					<p class="file-desc">Full source of every component — complete Svelte 5 + TypeScript code. ~260KB. Use when you need exact implementation details.</p>
				</div>
			</div>
			<div class="file-actions">
				<a href="/llms-full.txt" target="_blank" class="file-btn file-btn-outline">
					View ↗
				</a>
				<button class="file-btn file-btn-accent"
					onclick={() => copyText(llmsFullUrl, 'full')}>
					{#if copiedFull}✓ Copied!{:else}Copy URL{/if}
				</button>
			</div>
		</div>

	</div>
</section>

<!-- Claude Code -->
<section class="doc-section">
	<h2 class="doc-section-title">Claude Code</h2>
	<p class="doc-section-desc">Add the reference to your <code>CLAUDE.md</code> so Claude Code always knows about your components.</p>

	<div class="step">
		<div class="step-num">1</div>
		<div class="step-body">
			<p class="step-title">Create <code>CLAUDE.md</code> in your project root</p>
			<p class="step-desc">Claude Code automatically reads this file at the start of every session.</p>
		</div>
	</div>

	<div class="step">
		<div class="step-num">2</div>
		<div class="step-body">
			<p class="step-title">Add this to your CLAUDE.md</p>
			<CodeBlock code={`# UI Components
This project uses Ambar UI — Svelte 5 + Tailwind CSS v4 component library.
Full reference: https://ambarui.vercel.app/llms.txt

- Import from \`$lib/components/ComponentName.svelte\`
- Use Svelte 5 runes: $state, $derived, $props, $bindable
- Do NOT install as npm package — copy-paste only`} lang="markdown" collapsible={false} />
		</div>
	</div>

	<div class="step">
		<div class="step-num">3</div>
		<div class="step-body">
			<p class="step-title">Or fetch inline with <code>/fetch</code></p>
			<CodeBlock code={`# In Claude Code terminal or chat:
/fetch https://ambarui.vercel.app/llms.txt`} lang="bash" collapsible={false} />
		</div>
	</div>
</section>

<!-- Cursor -->
<section class="doc-section">
	<h2 class="doc-section-title">Cursor / Windsurf</h2>
	<p class="doc-section-desc">Add a <code>.cursorrules</code> file or use Cursor's Docs feature.</p>

	<CodeBlock code={cursorRulesCode} lang="bash" collapsible={false} />

	<div class="info-box">
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="info-icon">
			<circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
		</svg>
		<p>In Cursor: <strong>Settings → Docs → Add Doc</strong>, then paste <code>https://ambarui.vercel.app/llms.txt</code>. Cursor will index it and reference it automatically.</p>
	</div>

	<button class="copy-rules-btn" onclick={() => copyText(cursorRulesCode, 'cursor')}>
		{#if copiedCursor}
			<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
				style="width:0.875rem;height:0.875rem"><path d="M20 6L9 17l-5-5"/></svg>
			Copied!
		{:else}
			<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
				style="width:0.875rem;height:0.875rem">
				<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
			</svg>
			Copy .cursorrules
		{/if}
	</button>
</section>

<!-- ChatGPT / Claude web -->
<section class="doc-section">
	<h2 class="doc-section-title">ChatGPT / Claude (web)</h2>
	<p class="doc-section-desc">Paste the URL directly in your message or upload the file as context.</p>

	<div class="prompt-box">
		<p class="prompt-text">Here is the Ambar UI component reference. Use these components for all Svelte UI code:</p>
		<p class="prompt-url">[paste contents of https://ambarui.vercel.app/llms.txt]</p>
	</div>

	<p class="doc-section-desc" style="margin-top:0">Or upload <code>llms-full.txt</code> as a file attachment — both ChatGPT and Claude support uploading .txt context files.</p>
</section>

<!-- GitHub Copilot -->
<section class="doc-section">
	<h2 class="doc-section-title">GitHub Copilot</h2>
	<p class="doc-section-desc">Add a <code>.github/copilot-instructions.md</code> file to your repo.</p>
	<CodeBlock code={`# .github/copilot-instructions.md
This project uses Ambar UI for all UI components.
Reference: https://ambarui.vercel.app/llms.txt

Import pattern: import ComponentName from '$lib/components/ComponentName.svelte'`} lang="markdown" collapsible={false} />
</section>

<style>
	.comp-header { margin-bottom: 2.5rem; padding-bottom: 1.5rem; border-bottom: 1px solid var(--border); }
	.comp-header-top { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.5rem; }
	.comp-title { font-size: 1.875rem; font-weight: 800; letter-spacing: -0.025em; color: var(--foreground); }
	.comp-desc { color: var(--muted-foreground); font-size: 0.9375rem; line-height: 1.6; margin-bottom: 1rem; }
	.doc-section { margin-bottom: 2.5rem; display: flex; flex-direction: column; gap: 1rem; }
	.doc-section-title { font-size: 1.125rem; font-weight: 700; color: var(--foreground); }
	.doc-section-desc { font-size: 0.875rem; color: var(--muted-foreground); margin-top: -0.5rem; }
	.doc-section-desc code { font-family: ui-monospace, monospace; font-size: 0.8em; background: var(--muted); padding: 0.1rem 0.35rem; border-radius: 0.25rem; color: var(--accent); }

	/* File cards */
	.file-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
	@media (max-width: 640px) { .file-grid { grid-template-columns: 1fr; } }

	.file-card {
		border: 1px solid var(--border);
		border-radius: 0.875rem;
		background: var(--card);
		padding: 1.25rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.file-card-top { display: flex; gap: 0.875rem; align-items: flex-start; }

	.file-icon {
		width: 2.5rem; height: 2.5rem;
		border-radius: 0.625rem;
		display: flex; align-items: center; justify-content: center;
		flex-shrink: 0;
	}
	.file-icon-compact { background: color-mix(in srgb, var(--accent) 12%, transparent); color: var(--accent); }
	.file-icon-full    { background: color-mix(in srgb, #8b5cf6 12%, transparent); color: #8b5cf6; }

	.file-name { font-size: 0.9375rem; font-weight: 700; color: var(--foreground); font-family: ui-monospace, monospace; margin-bottom: 0.25rem; }
	.file-desc { font-size: 0.8rem; color: var(--muted-foreground); line-height: 1.5; }

	.file-actions { display: flex; gap: 0.5rem; }
	.file-btn {
		padding: 0.4rem 0.875rem;
		border-radius: 0.5rem;
		font-size: 0.8125rem;
		font-weight: 600;
		cursor: pointer;
		text-decoration: none;
		transition: background 0.12s, color 0.12s, border-color 0.12s;
		display: inline-flex; align-items: center; gap: 0.375rem;
		border: 1px solid transparent;
	}
	.file-btn-outline {
		border-color: var(--border);
		background: var(--background);
		color: var(--muted-foreground);
	}
	.file-btn-outline:hover { color: var(--foreground); background: var(--secondary); }
	.file-btn-accent {
		background: var(--accent);
		color: var(--accent-foreground);
	}
	.file-btn-accent:hover { background: color-mix(in srgb, var(--accent) 85%, black); }

	/* Steps */
	.step {
		display: flex; gap: 1rem; padding: 1.25rem;
		border: 1px solid var(--border); border-radius: 0.875rem; background: var(--card);
	}
	.step-num {
		width: 1.75rem; height: 1.75rem; border-radius: 50%;
		background: var(--accent); color: var(--accent-foreground);
		display: flex; align-items: center; justify-content: center;
		font-size: 0.8rem; font-weight: 700; flex-shrink: 0; margin-top: 0.1rem;
	}
	.step-body { flex: 1; display: flex; flex-direction: column; gap: 0.5rem; }
	.step-title { font-size: 0.9375rem; font-weight: 600; color: var(--foreground); }
	.step-desc  { font-size: 0.8rem; color: var(--muted-foreground); }
	.step-title code, .step-desc code {
		font-family: ui-monospace, monospace; font-size: 0.85em;
		background: var(--muted); padding: 0.1rem 0.3rem; border-radius: 0.25rem;
	}

	/* Info box */
	.info-box {
		display: flex; gap: 0.75rem; padding: 0.875rem 1rem;
		background: color-mix(in srgb, var(--accent) 8%, transparent);
		border: 1px solid color-mix(in srgb, var(--accent) 25%, transparent);
		border-radius: 0.75rem; font-size: 0.85rem; color: var(--foreground); line-height: 1.5;
	}
	.info-icon { width: 1rem; height: 1rem; color: var(--accent); flex-shrink: 0; margin-top: 0.1rem; }

	/* Copy button */
	.copy-rules-btn {
		display: inline-flex; align-items: center; gap: 0.4rem;
		padding: 0.5rem 1rem;
		border-radius: 0.5rem;
		border: 1px solid var(--border);
		background: var(--card);
		color: var(--foreground);
		font-size: 0.8125rem; font-weight: 600;
		cursor: pointer;
		transition: background 0.12s, border-color 0.12s;
		align-self: flex-start;
	}
	.copy-rules-btn:hover { background: var(--muted); }

	/* Prompt box */
	.prompt-box {
		border: 1px solid var(--border);
		border-radius: 0.75rem;
		background: var(--card);
		padding: 1rem 1.25rem;
		font-size: 0.875rem;
		color: var(--muted-foreground);
		line-height: 1.6;
	}
	.prompt-text { margin-bottom: 0.25rem; color: var(--foreground); }
	.prompt-url  { font-family: ui-monospace, monospace; font-size: 0.8em; color: var(--accent); }
</style>
