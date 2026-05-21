<script lang="ts">
	import CodeBlock from '$lib/components/CodeBlock.svelte';

	const step1 = `# Copy a component into your project
npx ambar-ui@latest add button`;

	const step2 = `# Or copy all components at once
npx ambar-ui@latest add --all`;

	const manualCopy = `# Manually copy from the repo
src/lib/components/Button.svelte
src/lib/components/Input.svelte
# ... etc`;

	const tailwindConfig = `/* app.css — already set up if you used the init command */
@import 'tailwindcss';

@theme inline {
  --color-accent: oklch(0.6 0.2 265);
  /* override any CSS variable here */
}`;

	const importExample = `<script lang="ts">
  import Button  from '$lib/components/Button.svelte';
  import Input   from '$lib/components/Input.svelte';
  import Select  from '$lib/components/Select.svelte';
<\/script>

<Input label="Email" bind:value={email} />
<Button onclick={submit}>Send</Button>`;

	const initCommand = `npx ambar-ui@latest init`;
	const addCommand  = `npx ambar-ui@latest add button input select`;
</script>

<div class="comp-header">
	<div class="comp-header-top">
		<h1 class="comp-title">Installation</h1>
	</div>
	<p class="comp-desc">Ambar UI is a copy-paste component library for Svelte 5 + Tailwind CSS v4. No npm package to install — you own the source code.</p>
</div>

<!-- Requirements -->
<section class="doc-section">
	<h2 class="doc-section-title">Requirements</h2>
	<div class="req-grid">
		<div class="req-card">
			<span class="req-label">Svelte</span>
			<span class="req-version">5.0+</span>
		</div>
		<div class="req-card">
			<span class="req-label">SvelteKit</span>
			<span class="req-version">2.0+</span>
		</div>
		<div class="req-card">
			<span class="req-label">Tailwind CSS</span>
			<span class="req-version">4.0+</span>
		</div>
		<div class="req-card">
			<span class="req-label">TypeScript</span>
			<span class="req-version">5.0+</span>
		</div>
	</div>
</section>

<!-- Quick start via CLI -->
<section class="doc-section">
	<h2 class="doc-section-title">Quick Start</h2>
	<p class="doc-section-desc">Use the CLI to scaffold and add components automatically.</p>

	<div class="step">
		<div class="step-num">1</div>
		<div class="step-body">
			<p class="step-title">Initialize in your project</p>
			<p class="step-desc">Copies <code>app.css</code>, theme tokens, and the stores to your project.</p>
			<CodeBlock code={initCommand} lang="bash" collapsible={false} />
		</div>
	</div>

	<div class="step">
		<div class="step-num">2</div>
		<div class="step-body">
			<p class="step-title">Add components</p>
			<p class="step-desc">Copies the component files into <code>src/lib/components/</code>.</p>
			<CodeBlock code={addCommand} lang="bash" collapsible={false} />
		</div>
	</div>

	<div class="step">
		<div class="step-num">3</div>
		<div class="step-body">
			<p class="step-title">Import and use</p>
			<CodeBlock code={importExample} lang="svelte" collapsible={false} />
		</div>
	</div>
</section>

<!-- Manual installation -->
<section class="doc-section">
	<h2 class="doc-section-title">Manual Installation</h2>
	<p class="doc-section-desc">Prefer to copy files yourself? Every component is a single <code>.svelte</code> file with no runtime dependencies.</p>
	<CodeBlock code={manualCopy} lang="bash" collapsible={false} />
	<div class="info-box">
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="info-icon"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
		<p>Some components depend on each other. <strong>Spinner</strong> is used by <strong>Button</strong>. The CLI handles these dependencies automatically.</p>
	</div>
</section>

<!-- Tailwind setup -->
<section class="doc-section">
	<h2 class="doc-section-title">Tailwind Setup</h2>
	<p class="doc-section-desc">Ambar UI uses Tailwind CSS v4's <code>@theme inline</code> directive. CSS custom properties are the source of truth.</p>
	<CodeBlock code={tailwindConfig} lang="css" collapsible={false} />
</section>

<!-- Component dependencies -->
<section class="doc-section">
	<h2 class="doc-section-title">Component Dependencies</h2>
	<div class="dep-table">
		<div class="dep-row dep-header">
			<span>Component</span>
			<span>Depends on</span>
		</div>
		{#each [
			{ name: 'Button',         deps: 'Spinner'              },
			{ name: 'Dialog',         deps: 'Button'               },
			{ name: 'Drawer',         deps: 'Button'               },
			{ name: 'Sheet',          deps: 'Button'               },
			{ name: 'Search',         deps: 'Spinner'              },
			{ name: 'Toast',          deps: 'toastStore (stores/)' },
			{ name: 'Accordion',      deps: '—'                    },
			{ name: 'Avatar',         deps: '—'                    },
			{ name: 'Breadcrumb',     deps: '—'                    },
			{ name: 'Checkbox',       deps: '—'                    },
			{ name: 'Dropdown',       deps: '—'                    },
			{ name: 'Empty State',    deps: '—'                    },
			{ name: 'Input',          deps: '—'                    },
			{ name: 'Link',           deps: '—'                    },
			{ name: 'List',           deps: '—'                    },
			{ name: 'OTP Input',      deps: '—'                    },
			{ name: 'Popover',        deps: '—'                    },
			{ name: 'Progress',       deps: '—'                    },
			{ name: 'Radio',          deps: '—'                    },
			{ name: 'Select',         deps: '—'                    },
			{ name: 'Sidebar',        deps: '—'                    },
			{ name: 'Skeleton',       deps: '—'                    },
			{ name: 'Slider',         deps: '—'                    },
			{ name: 'Spinner',        deps: '—'                    },
			{ name: 'Switch',         deps: '—'                    },
			{ name: 'Tabs',           deps: '—'                    },
			{ name: 'Textarea',       deps: '—'                    },
			{ name: 'Tooltip',        deps: '—'                    },
			{ name: 'Typography',     deps: '—'                    },
			{ name: 'Bar Chart',      deps: '—'                    },
			{ name: 'Candlestick',    deps: '—'                    },
			{ name: 'Donut Chart',    deps: '—'                    },
			{ name: 'Heatmap',        deps: '—'                    },
			{ name: 'Line Chart',     deps: '—'                    },
			{ name: 'Realtime',       deps: '—'                    },
			{ name: 'Sparkline',      deps: '—'                    },
		] as row}
			<div class="dep-row">
				<code>{row.name}</code>
				<span class="dep-val">{row.deps}</span>
			</div>
		{/each}
	</div>
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

	/* Requirements grid */
	.req-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.75rem; }
	@media (max-width: 600px) { .req-grid { grid-template-columns: repeat(2, 1fr); } }
	.req-card {
		border: 1px solid var(--border);
		border-radius: 0.75rem;
		background: var(--card);
		padding: 1rem;
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}
	.req-label { font-size: 0.8rem; color: var(--muted-foreground); font-weight: 500; }
	.req-version { font-size: 1rem; font-weight: 700; color: var(--foreground); font-family: ui-monospace, monospace; }

	/* Steps */
	.step {
		display: flex;
		gap: 1rem;
		padding: 1.25rem;
		border: 1px solid var(--border);
		border-radius: 0.875rem;
		background: var(--card);
	}
	.step-num {
		width: 1.75rem;
		height: 1.75rem;
		border-radius: 50%;
		background: var(--accent);
		color: var(--accent-foreground);
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 0.8rem;
		font-weight: 700;
		flex-shrink: 0;
		margin-top: 0.1rem;
	}
	.step-body { flex: 1; display: flex; flex-direction: column; gap: 0.5rem; }
	.step-title { font-size: 0.9375rem; font-weight: 600; color: var(--foreground); }
	.step-desc { font-size: 0.8rem; color: var(--muted-foreground); }
	.step-desc code { font-family: ui-monospace, monospace; font-size: 0.85em; background: var(--muted); padding: 0.1rem 0.3rem; border-radius: 0.25rem; }

	/* Info box */
	.info-box {
		display: flex;
		gap: 0.75rem;
		padding: 0.875rem 1rem;
		background: color-mix(in srgb, var(--accent) 8%, transparent);
		border: 1px solid color-mix(in srgb, var(--accent) 25%, transparent);
		border-radius: 0.75rem;
		font-size: 0.85rem;
		color: var(--foreground);
		line-height: 1.5;
	}
	.info-icon { width: 1rem; height: 1rem; color: var(--accent); flex-shrink: 0; margin-top: 0.1rem; }

	/* Dependency table */
	.dep-table { border: 1px solid var(--border); border-radius: 0.75rem; overflow: hidden; }
	.dep-row {
		display: grid;
		grid-template-columns: 1fr 1fr;
		padding: 0.6rem 1rem;
		font-size: 0.8375rem;
		border-bottom: 1px solid var(--border);
	}
	.dep-row:last-child { border-bottom: none; }
	.dep-header { background: var(--muted); font-weight: 700; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--muted-foreground); }
	.dep-row code { font-family: ui-monospace, monospace; color: var(--accent); }
	.dep-val { color: var(--muted-foreground); }
</style>
