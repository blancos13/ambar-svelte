<script lang="ts">
	import CodeBlock from '$lib/components/CodeBlock.svelte';

	const themeVars = `/* app.css */
@theme inline {
  /* ── Accent colour ── */
  --color-accent:            oklch(0.6 0.2 265);   /* purple (default) */
  --color-accent-foreground: #ffffff;

  /* ── Backgrounds ── */
  --color-background: #ffffff;
  --color-foreground: #0a0a0a;
  --color-card:       #ffffff;
  --color-muted:      #f4f4f5;
  --color-border:     #e4e4e7;

  /* ── Text ── */
  --color-muted-foreground: #71717a;
  --color-secondary:        #f4f4f5;
}`;

	const darkVars = `/* Dark mode is applied via html.dark class */
:global(html.dark) {
  --background: #09090b;
  --foreground:  #fafafa;
  --card:        #18181b;
  --muted:       #27272a;
  --border:      #3f3f46;
  --muted-foreground: #a1a1aa;
  --secondary:   #27272a;
}`;

	const accentExample = `/* Change accent to red */
@theme inline {
  --color-accent: oklch(0.55 0.22 25);
}`;

	const fontExample = `/* Change font */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

@theme inline {
  --font-sans: 'Inter', system-ui, sans-serif;
}`;

	const cssVarUsage = `<!-- Access theme in components -->
<div style="color: var(--accent); background: var(--card)">
  Themed element
</div>

<!-- Tailwind utilities use the same tokens -->
<div class="bg-card text-foreground border border-border rounded-xl p-4">
  Card component
</div>`;
</script>

<div class="comp-header">
	<div class="comp-header-top">
		<h1 class="comp-title">Theming</h1>
	</div>
	<p class="comp-desc">Ambar UI uses CSS custom properties for theming. Change the accent color, dark mode, fonts, and more — all components update instantly.</p>
</div>

<section class="doc-section">
	<h2 class="doc-section-title">How It Works</h2>
	<div class="info-cards">
		<div class="info-card">
			<div class="info-card-icon">🎨</div>
			<div>
				<p class="info-card-title">CSS Variables</p>
				<p class="info-card-desc">All colors are CSS custom properties (<code>--accent</code>, <code>--card</code>, etc.). Changing them updates every component instantly.</p>
			</div>
		</div>
		<div class="info-card">
			<div class="info-card-icon">🌙</div>
			<div>
				<p class="info-card-title">Dark Mode</p>
				<p class="info-card-desc">Toggle via <code>html.dark</code> class. The theme store (<code>themeStore.toggleMode()</code>) handles this automatically with <code>localStorage</code> persistence.</p>
			</div>
		</div>
		<div class="info-card">
			<div class="info-card-icon">⚡</div>
			<div>
				<p class="info-card-title">Tailwind v4</p>
				<p class="info-card-desc">Uses <code>@theme inline</code> so Tailwind utilities (<code>bg-card</code>, <code>text-accent</code>, etc.) resolve to your CSS variables.</p>
			</div>
		</div>
	</div>
</section>

<section class="doc-section">
	<h2 class="doc-section-title">Theme Variables</h2>
	<p class="doc-section-desc">Override any of these in your <code>app.css</code>.</p>
	<CodeBlock code={themeVars} lang="css" />
</section>

<section class="doc-section">
	<h2 class="doc-section-title">Changing the Accent Color</h2>
	<p class="doc-section-desc">One line changes the entire UI. Use any valid CSS color — <code>oklch</code> recommended for vibrant colors.</p>
	<CodeBlock code={accentExample} lang="css" collapsible={false} />
	<div class="swatch-row">
		{#each [
			{ name: 'Purple',  v: 'oklch(0.6 0.2 265)'  },
			{ name: 'Blue',    v: 'oklch(0.55 0.2 230)'  },
			{ name: 'Teal',    v: 'oklch(0.6 0.17 180)'  },
			{ name: 'Green',   v: 'oklch(0.6 0.18 145)'  },
			{ name: 'Orange',  v: 'oklch(0.65 0.18 55)'  },
			{ name: 'Red',     v: 'oklch(0.55 0.22 25)'  },
			{ name: 'Pink',    v: 'oklch(0.65 0.2 330)'  },
		] as s}
			<div class="swatch" style="background: {s.v}" title={s.name}></div>
		{/each}
	</div>
</section>

<section class="doc-section">
	<h2 class="doc-section-title">Custom Font</h2>
	<CodeBlock code={fontExample} lang="css" collapsible={false} />
</section>

<section class="doc-section">
	<h2 class="doc-section-title">Using Theme in Your Code</h2>
	<CodeBlock code={cssVarUsage} lang="svelte" collapsible={false} />
</section>

<section class="doc-section">
	<h2 class="doc-section-title">Theme Store API</h2>
	<div class="api-table">
		<div class="api-row api-header"><span>Property / Method</span><span>Description</span></div>
		{#each [
			{ name: 'themeStore.mode',          desc: '"light" | "dark" — current color mode' },
			{ name: 'themeStore.toggleMode()',   desc: 'Toggle between light and dark mode' },
			{ name: 'themeStore.setMode(mode)',  desc: 'Set mode explicitly' },
			{ name: 'themeStore.accent',         desc: 'Current accent color value' },
			{ name: 'themeStore.setAccent(v)',   desc: 'Set accent to a CSS color string' },
			{ name: 'themeStore.init()',         desc: 'Initialize from localStorage (call in onMount)' },
		] as row}
			<div class="api-row">
				<code>{row.name}</code>
				<span>{row.desc}</span>
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

	.info-cards { display: flex; flex-direction: column; gap: 0.75rem; }
	.info-card {
		display: flex; gap: 1rem; align-items: flex-start;
		padding: 1rem 1.25rem;
		border: 1px solid var(--border);
		border-radius: 0.875rem;
		background: var(--card);
	}
	.info-card-icon { font-size: 1.25rem; flex-shrink: 0; }
	.info-card-title { font-size: 0.9rem; font-weight: 600; color: var(--foreground); margin-bottom: 0.2rem; }
	.info-card-desc { font-size: 0.8rem; color: var(--muted-foreground); line-height: 1.5; }
	.info-card-desc code { font-family: ui-monospace, monospace; font-size: 0.85em; background: var(--muted); padding: 0.05rem 0.3rem; border-radius: 0.2rem; }

	.swatch-row { display: flex; gap: 0.5rem; flex-wrap: wrap; }
	.swatch { width: 2rem; height: 2rem; border-radius: 50%; border: 2px solid color-mix(in srgb, var(--foreground) 10%, transparent); }

	.api-table, .dep-table { border: 1px solid var(--border); border-radius: 0.75rem; overflow: hidden; }
	.api-row {
		display: grid; grid-template-columns: 1.5fr 2fr;
		padding: 0.6rem 1rem;
		font-size: 0.8375rem;
		border-bottom: 1px solid var(--border);
		color: var(--muted-foreground);
	}
	.api-row:last-child { border-bottom: none; }
	.api-header { background: var(--muted); font-weight: 700; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; }
	.api-row code { font-family: ui-monospace, monospace; color: var(--accent); }
</style>
