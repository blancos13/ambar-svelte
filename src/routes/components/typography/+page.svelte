<script lang="ts">
	import Text from '$lib/components/Text.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import PropsTable from '$lib/components/PropsTable.svelte';

	const importCode = `import Text from '$lib/components/Text.svelte';`;

	const usageCode = `<Text variant="h1">Discover, Follow, Share</Text>
<Text variant="body" color="muted">Zero-dependency Svelte 5 component library.</Text>`;

	const variantsCode = `<Text variant="display">Ambar UI</Text>
<Text variant="h1">Heading 1</Text>
<Text variant="h2">Heading 2</Text>
<Text variant="h3">Heading 3</Text>
<Text variant="h4">Heading 4</Text>
<Text variant="body">Body text — default readable size.</Text>
<Text variant="body-sm" color="muted">Smaller body — metadata, timestamps.</Text>
<Text variant="caption" color="muted">Caption — inline labels, counts.</Text>
<Text variant="label" color="muted">Section label</Text>
<Text variant="code">import Text from '$lib/components/Text.svelte'</Text>
<Text variant="quote" color="muted">Every story is a connection.</Text>`;

	const weightsCode = `<Text variant="h3" weight="normal">Normal</Text>
<Text variant="h3" weight="medium">Medium</Text>
<Text variant="h3" weight="semibold">Semibold</Text>
<Text variant="h3" weight="bold">Bold</Text>
<Text variant="h3" weight="extrabold">Extrabold</Text>`;

	const colorsCode = `<Text color="default">Default foreground</Text>
<Text color="muted">Muted foreground</Text>
<Text color="accent">Accent color</Text>
<Text color="destructive">Destructive color</Text>`;

	const alignCode = `<Text variant="h3" align="left">Left-aligned</Text>
<Text variant="h3" align="center">Centered</Text>
<Text variant="h3" align="right">Right-aligned</Text>`;

	const truncateCode = `<div style="width: 200px;">
  <Text truncate>This long text will be clipped with an ellipsis.</Text>
</div>`;

	const props = [
		{ name: 'variant',  type: "'display' | 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'body-sm' | 'caption' | 'label' | 'code' | 'quote'", default: "'body'",    description: "Typographic style and the HTML element to render. Headings use h1–h4, body uses p, caption/label use span, code uses code, quote uses blockquote." },
		{ name: 'weight',   type: "'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold'",                                                 default: '—',         description: "Override the font weight. Each variant has a sensible default weight — only set this when you need to override it." },
		{ name: 'align',    type: "'left' | 'center' | 'right'",                                                                              default: '—',         description: "Text alignment. Inherits from parent when unset." },
		{ name: 'color',    type: "'default' | 'muted' | 'accent' | 'destructive'",                                                          default: "'default'", description: "Semantic color token applied to the text." },
		{ name: 'truncate', type: 'boolean',                                                                                                  default: 'false',     description: "Clip overflowing text with an ellipsis. Requires a bounded-width container." },
		{ name: 'children', type: 'Snippet',                                                                                                  required: true, description: "The text content or markup to render inside the element." },
	];
</script>

<div class="comp-header">
	<div class="comp-header-top">
		<h1 class="comp-title">Typography</h1>
		<span class="comp-badge">Content</span>
	</div>
	<p class="comp-desc">Semantic text component with eleven typographic variants, five weights, four color tokens, and alignment control — all built on design system CSS variables.</p>
</div>

<section class="doc-section">
	<h2 class="doc-section-title">Import</h2>
	<CodeBlock code={importCode} lang="ts" />
</section>

<section class="doc-section">
	<h2 class="doc-section-title">Usage</h2>
	<div class="preview-box" style="flex-direction:column; align-items:flex-start; gap:0.5rem;">
		<Text variant="h1">Discover, Follow, Share</Text>
		<Text variant="body" color="muted">Zero-dependency Svelte 5 component library with animations and accessibility.</Text>
	</div>
	<CodeBlock code={usageCode} lang="svelte" />
</section>

<section class="doc-section">
	<h2 class="doc-section-title">Type Scale</h2>
	<p class="doc-section-desc">All eleven variants from <code>display</code> down to <code>quote</code>.</p>
	<div class="scale-list">
		<div class="scale-item">
			<span class="scale-label">display</span>
			<Text variant="display">Ambar UI</Text>
		</div>
		<div class="scale-divider"></div>
		<div class="scale-item">
			<span class="scale-label">h1</span>
			<Text variant="h1">Discover, Follow, Share</Text>
		</div>
		<div class="scale-item">
			<span class="scale-label">h2</span>
			<Text variant="h2">Trending Videos</Text>
		</div>
		<div class="scale-item">
			<span class="scale-label">h3</span>
			<Text variant="h3">Popular This Week</Text>
		</div>
		<div class="scale-item">
			<span class="scale-label">h4</span>
			<Text variant="h4">Suggested Users</Text>
		</div>
		<div class="scale-divider"></div>
		<div class="scale-item">
			<span class="scale-label">body</span>
			<Text variant="body">A zero-dependency Svelte 5 component library. Every component ships with transition animations, keyboard navigation, and accessibility support.</Text>
		</div>
		<div class="scale-item">
			<span class="scale-label">body-sm</span>
			<Text variant="body-sm" color="muted">Last updated May 2026 · Svelte 5 · Tailwind v4</Text>
		</div>
		<div class="scale-divider"></div>
		<div class="scale-item">
			<span class="scale-label">caption</span>
			<Text variant="caption" color="muted">124K likes · 3.2K comments · 892 shares</Text>
		</div>
		<div class="scale-item">
			<span class="scale-label">label</span>
			<Text variant="label" color="muted">Categories</Text>
		</div>
		<div class="scale-divider"></div>
		<div class="scale-item">
			<span class="scale-label">code</span>
			<Text variant="code">import Text from '$lib/components/Text.svelte'</Text>
		</div>
		<div class="scale-item">
			<span class="scale-label">quote</span>
			<Text variant="quote" color="muted">Content creation is a way of life, not just a job. Every video is a story, every story a connection.</Text>
		</div>
	</div>
	<CodeBlock code={variantsCode} lang="svelte" />
</section>

<section class="doc-section">
	<h2 class="doc-section-title">Weights</h2>
	<p class="doc-section-desc">Use <code>weight</code> to override the default font weight for any variant.</p>
	<div class="preview-box" style="flex-direction:column; align-items:flex-start; gap:0.5rem; width:100%;">
		{#each ['normal','medium','semibold','bold','extrabold'] as w}
			<div class="weight-row">
				<span class="weight-label">{w}</span>
				<Text variant="h3" weight={w as any}>Ambar UI</Text>
			</div>
		{/each}
	</div>
	<CodeBlock code={weightsCode} lang="svelte" />
</section>

<section class="doc-section">
	<h2 class="doc-section-title">Colors</h2>
	<p class="doc-section-desc">Four semantic color tokens that map to CSS variables, adapting automatically to light and dark themes.</p>
	<div class="preview-box" style="flex-direction:column; align-items:flex-start; gap:0.5rem; width:100%;">
		{#each [
			{ color: 'default',     label: 'default'     },
			{ color: 'muted',       label: 'muted'       },
			{ color: 'accent',      label: 'accent'      },
			{ color: 'destructive', label: 'destructive' },
		] as item}
			<div class="weight-row">
				<span class="weight-label">{item.label}</span>
				<Text variant="h3" color={item.color as any}>Discover and Share</Text>
			</div>
		{/each}
	</div>
	<CodeBlock code={colorsCode} lang="svelte" />
</section>

<section class="doc-section">
	<h2 class="doc-section-title">Alignment</h2>
	<p class="doc-section-desc">Control text alignment with <code>align</code>. Inherits from the parent when unset.</p>
	<div class="preview-box" style="flex-direction:column; gap:1rem; width:100%;">
		<div style="width:100%; display:flex; flex-direction:column; gap:0.25rem;">
			<Text variant="h3" align="left">Left-aligned heading</Text>
			<Text variant="body" color="muted" align="left">The most readable alignment for long paragraphs and flowing text.</Text>
		</div>
		<div class="scale-divider"></div>
		<div style="width:100%; display:flex; flex-direction:column; gap:0.25rem;">
			<Text variant="h3" align="center">Centered heading</Text>
			<Text variant="body" color="muted" align="center">Used for short descriptions and hero sections.</Text>
		</div>
		<div class="scale-divider"></div>
		<div style="width:100%; display:flex; flex-direction:column; gap:0.25rem;">
			<Text variant="h3" align="right">Right-aligned heading</Text>
			<Text variant="body" color="muted" align="right">Suitable for numbers, dates, and currency values.</Text>
		</div>
	</div>
	<CodeBlock code={alignCode} lang="svelte" />
</section>

<section class="doc-section">
	<h2 class="doc-section-title">Truncate</h2>
	<p class="doc-section-desc">Add <code>truncate</code> to clip overflow with an ellipsis. Requires a bounded-width container.</p>
	<div class="preview-box">
		<div style="width:200px; border:1px solid var(--border); padding:0.5rem 0.75rem; border-radius:0.5rem;">
			<Text truncate>This long text will be clipped with an ellipsis when it overflows.</Text>
		</div>
	</div>
	<CodeBlock code={truncateCode} lang="svelte" />
</section>

<section class="doc-section">
	<h2 class="doc-section-title">Example — Profile Card</h2>
	<p class="doc-section-desc">Combining multiple variants in a real-world component.</p>
	<div class="preview-box">
		<div style="width:100%; max-width:22rem; display:flex; flex-direction:column; gap:1rem; padding:1.5rem; border:1px solid var(--border); border-radius:1rem; background:var(--card);">
			<div style="display:flex; align-items:center; gap:1rem;">
				<div style="display:flex; width:4rem; height:4rem; align-items:center; justify-content:center; border-radius:9999px; background:var(--accent); font-size:1.5rem; font-weight:700; color:var(--accent-foreground); flex-shrink:0;">Z</div>
				<div>
					<Text variant="h4">Zeynep Kaya</Text>
					<Text variant="caption" color="muted">@zeynep.dance</Text>
				</div>
			</div>
			<Text variant="body" color="muted">Istanbul · dance & music · living life beautifully</Text>
			<div style="display:flex; gap:1.5rem;">
				<div style="text-align:center;">
					<Text variant="h3">842</Text>
					<Text variant="caption" color="muted">Following</Text>
				</div>
				<div style="text-align:center;">
					<Text variant="h3">12.4K</Text>
					<Text variant="caption" color="muted">Followers</Text>
				</div>
				<div style="text-align:center;">
					<Text variant="h3">284K</Text>
					<Text variant="caption" color="muted">Likes</Text>
				</div>
			</div>
			<Text variant="label" color="muted">Recent Videos</Text>
			<div style="display:grid; grid-template-columns:repeat(3,1fr); gap:0.375rem;">
				{#each [
					{ views: '124K', bg: 'color-mix(in srgb, var(--accent) 20%, transparent)' },
					{ views: '89K',  bg: 'var(--muted)' },
					{ views: '56K',  bg: 'color-mix(in srgb, var(--accent) 10%, transparent)' },
				] as item}
					<div style="aspect-ratio:9/16; background:{item.bg}; border-radius:0.75rem; overflow:hidden; display:flex; align-items:flex-end; padding:0.5rem;">
						<Text variant="caption" color="muted">&#9654; {item.views}</Text>
					</div>
				{/each}
			</div>
		</div>
	</div>
</section>

<section class="doc-section">
	<h2 class="doc-section-title">Variant → HTML Element</h2>
	<p class="doc-section-desc">The <code>variant</code> prop controls both the visual style and the semantic HTML element rendered.</p>
	<div class="tag-table">
		{#each [
			{ variant: 'display', tag: 'h1' },
			{ variant: 'h1',      tag: 'h1' },
			{ variant: 'h2',      tag: 'h2' },
			{ variant: 'h3',      tag: 'h3' },
			{ variant: 'h4',      tag: 'h4' },
			{ variant: 'body',    tag: 'p'  },
			{ variant: 'body-sm', tag: 'p'  },
			{ variant: 'caption', tag: 'span' },
			{ variant: 'label',   tag: 'span' },
			{ variant: 'code',    tag: 'code' },
			{ variant: 'quote',   tag: 'blockquote' },
		] as row}
			<div class="tag-row">
				<code class="tag-variant">{row.variant}</code>
				<code class="tag-el">&lt;{row.tag}&gt;</code>
			</div>
		{/each}
	</div>
</section>

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

	/* Type scale list */
	.scale-list { border: 1px solid var(--border); border-radius: 0.875rem; padding: 1.5rem 2rem; background: var(--card); display: flex; flex-direction: column; gap: 0.875rem; }
	.scale-item { display: flex; flex-direction: column; gap: 0.2rem; }
	.scale-label { font-size: 0.7rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; color: var(--muted-foreground); }
	.scale-divider { height: 1px; background: var(--border); margin: 0.25rem 0; }

	/* Weight & color rows */
	.weight-row { display: flex; align-items: baseline; gap: 1rem; width: 100%; }
	.weight-label { font-size: 0.75rem; color: var(--muted-foreground); width: 5.5rem; flex-shrink: 0; font-family: ui-monospace, monospace; }

	/* Variant → tag table */
	.tag-table { display: flex; flex-direction: column; border: 1px solid var(--border); border-radius: 0.75rem; overflow: hidden; }
	.tag-row { display: flex; align-items: center; gap: 1rem; padding: 0.5rem 1rem; border-bottom: 1px solid var(--border); }
	.tag-row:last-child { border-bottom: none; }
	.tag-variant { font-family: ui-monospace, monospace; font-size: 0.78rem; color: var(--accent); background: color-mix(in srgb, var(--accent) 10%, transparent); padding: 0.1rem 0.35rem; border-radius: 0.3rem; min-width: 5.5rem; }
	.tag-el { font-family: ui-monospace, monospace; font-size: 0.75rem; color: var(--muted-foreground); background: var(--muted); padding: 0.1rem 0.35rem; border-radius: 0.3rem; }
</style>
