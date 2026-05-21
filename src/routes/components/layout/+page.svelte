<script lang="ts">
	import Flex    from '$lib/components/Flex.svelte';
	import Grid    from '$lib/components/Grid.svelte';
	import HStack  from '$lib/components/HStack.svelte';
	import VStack  from '$lib/components/VStack.svelte';
	import Spacer  from '$lib/components/Spacer.svelte';
	import CodeBlock  from '$lib/components/CodeBlock.svelte';
	import PropsTable from '$lib/components/PropsTable.svelte';

	const importCode = `import Flex   from '$lib/components/Flex.svelte';
import Grid   from '$lib/components/Grid.svelte';
import HStack from '$lib/components/HStack.svelte';
import VStack from '$lib/components/VStack.svelte';
import Spacer from '$lib/components/Spacer.svelte';`;

	const usageCode = `<HStack gap={3}>
  <div>Alpha</div>
  <div>Beta</div>
  <div>Gamma</div>
</HStack>`;

	const hstackCode = `<HStack gap={3}>
  <div>One</div>
  <div>Two</div>
  <div>Three</div>
</HStack>`;

	const vstackCode = `<VStack gap={3}>
  <div>First</div>
  <div>Second</div>
  <div>Third</div>
</VStack>`;

	const flexCode = `<!-- row-reverse -->
<Flex direction="row-reverse" gap={3}>
  <div>1</div>
  <div>2</div>
  <div>3</div>
</Flex>

<!-- column, right-aligned -->
<Flex direction="column" align="end" gap={2}>
  <div>Right aligned</div>
  <div>Items here</div>
</Flex>`;

	const gridCode = `<Grid cols={3} gap={3}>
  <div>1</div>
  <div>2</div>
  <div>3</div>
  <div>4</div>
  <div>5</div>
  <div>6</div>
</Grid>`;

	const spacerCode = `<!-- Push items to opposite ends -->
<HStack gap={2}>
  <div>Logo</div>
  <Spacer />
  <div>Login</div>
  <div>Sign up</div>
</HStack>`;

	const box = (label: string, accent = false) => ({ label, accent });

	const flexProps = [
		{ name: 'direction', type: "'row' | 'column' | 'row-reverse' | 'column-reverse'", default: "'row'",      description: 'flex-direction value.' },
		{ name: 'gap',       type: 'number | string',                                      default: '0',           description: 'Gap between children. Numbers map to rem (n × 0.25rem).' },
		{ name: 'align',     type: "'start' | 'center' | 'end' | 'stretch' | 'baseline'",  default: "'stretch'",   description: 'align-items value.' },
		{ name: 'justify',   type: "'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'", default: "'start'", description: 'justify-content value.' },
		{ name: 'wrap',      type: "boolean | 'reverse'",                                   default: 'false',       description: 'flex-wrap: wrap or wrap-reverse.' },
		{ name: 'grow',      type: 'boolean',                                               default: 'false',       description: 'flex-grow: 1.' },
		{ name: 'shrink',    type: 'boolean',                                               default: 'false',       description: 'flex-shrink: 1.' },
		{ name: 'as',        type: 'string',                                                default: "'div'",       description: 'HTML element tag to render (e.g. "section", "article").' },
		{ name: 'class',     type: 'string',                                                default: "''",          description: 'Extra CSS classes.' },
		{ name: 'children',  type: 'Snippet',                                               description: 'Content placed inside the flex container.' },
	];

	const gridProps = [
		{ name: 'cols',    type: 'number | string', default: '1',         description: 'Column count, or a custom grid-template-columns string.' },
		{ name: 'rows',    type: 'number | string', default: 'undefined', description: 'Row count, or a custom grid-template-rows string.' },
		{ name: 'gap',     type: 'number | string', default: 'undefined', description: 'Gap for both axes.' },
		{ name: 'gapX',   type: 'number | string', default: 'undefined', description: 'column-gap only.' },
		{ name: 'gapY',   type: 'number | string', default: 'undefined', description: 'row-gap only.' },
		{ name: 'padding', type: 'number | string', default: '0',         description: 'Padding shorthand. Same rem scale as gap.' },
		{ name: 'as',      type: 'string',          default: "'div'",     description: 'HTML element tag to render.' },
		{ name: 'class',   type: 'string',          default: "''",        description: 'Extra CSS classes.' },
		{ name: 'children', type: 'Snippet',                               description: 'Grid cell content.' },
	];

	const hstackProps = [
		{ name: 'gap',     type: 'number | string', default: '0',        description: 'Gap between children.' },
		{ name: 'align',   type: "'start' | 'center' | 'end' | 'stretch' | 'baseline'", default: "'center'", description: 'align-items value.' },
		{ name: 'justify', type: "'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'", default: "'start'", description: 'justify-content value.' },
		{ name: 'wrap',    type: 'boolean',          default: 'false',   description: 'Allow children to wrap to the next row.' },
		{ name: 'as',      type: 'string',           default: "'div'",   description: 'HTML element tag to render.' },
		{ name: 'class',   type: 'string',           default: "''",      description: 'Extra CSS classes.' },
		{ name: 'children', type: 'Snippet',                              description: 'Row content.' },
	];

	const vstackProps = [
		{ name: 'gap',     type: 'number | string', default: '0',          description: 'Gap between children.' },
		{ name: 'align',   type: "'start' | 'center' | 'end' | 'stretch' | 'baseline'", default: "'stretch'", description: 'align-items value.' },
		{ name: 'justify', type: "'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'", default: "'start'", description: 'justify-content value.' },
		{ name: 'as',      type: 'string',           default: "'div'",    description: 'HTML element tag to render.' },
		{ name: 'class',   type: 'string',           default: "''",       description: 'Extra CSS classes.' },
		{ name: 'children', type: 'Snippet',                               description: 'Column content.' },
	];

	const spacerProps = [
		{ name: 'size', type: 'number | string', default: 'undefined', description: 'Fixed size in rem units. When omitted the spacer grows to fill remaining space (flex: 1).' },
	];
</script>

<!-- Page header -->
<div class="comp-header">
	<div class="comp-header-top">
		<h1 class="comp-title">Layout</h1>
		<span class="comp-badge">5 components</span>
	</div>
	<p class="comp-desc">Flex, Grid, HStack, VStack, and Spacer — composable layout primitives built on flexbox and CSS grid. No dependencies, no magic.</p>
</div>

<!-- Import -->
<section class="doc-section">
	<h2 class="doc-section-title">Import</h2>
	<CodeBlock code={importCode} lang="ts" />
</section>

<!-- Usage -->
<section class="doc-section">
	<h2 class="doc-section-title">Usage</h2>
	<div class="preview-box">
		<HStack gap={3}>
			<div class="demo-box">Alpha</div>
			<div class="demo-box">Beta</div>
			<div class="demo-box">Gamma</div>
		</HStack>
	</div>
	<CodeBlock code={usageCode} lang="svelte" />
</section>

<!-- HStack -->
<section class="doc-section">
	<h2 class="doc-section-title">HStack</h2>
	<p class="doc-section-desc">Horizontal stack — arranges children left to right with <code>flex-direction: row</code>. Default <code>align="center"</code>.</p>
	<div class="preview-box">
		<HStack gap={3}>
			<div class="demo-box">One</div>
			<div class="demo-box">Two</div>
			<div class="demo-box">Three</div>
		</HStack>
	</div>
	<CodeBlock code={hstackCode} lang="svelte" />
</section>

<!-- VStack -->
<section class="doc-section">
	<h2 class="doc-section-title">VStack</h2>
	<p class="doc-section-desc">Vertical stack — arranges children top to bottom with <code>flex-direction: column</code>.</p>
	<div class="preview-box">
		<VStack gap={3}>
			<div class="demo-box">First</div>
			<div class="demo-box">Second</div>
			<div class="demo-box">Third</div>
		</VStack>
	</div>
	<CodeBlock code={vstackCode} lang="svelte" />
</section>

<!-- Flex -->
<section class="doc-section">
	<h2 class="doc-section-title">Flex</h2>
	<p class="doc-section-desc">General-purpose flex container. Exposes all flex properties — use it when HStack or VStack are not enough.</p>
	<div class="preview-box preview-box-start" style="flex-direction: column; align-items: stretch; gap: 1.5rem;">
		<div>
			<p class="demo-label">direction="row-reverse"</p>
			<Flex direction="row-reverse" gap={3}>
				<div class="demo-box">1</div>
				<div class="demo-box">2</div>
				<div class="demo-box">3</div>
			</Flex>
		</div>
		<div>
			<p class="demo-label">direction="column" align="end"</p>
			<Flex direction="column" align="end" gap={2}>
				<div class="demo-box">Right aligned</div>
				<div class="demo-box">Items here</div>
			</Flex>
		</div>
		<div>
			<p class="demo-label">justify="between"</p>
			<Flex justify="between" gap={2}>
				<div class="demo-box">Start</div>
				<div class="demo-box">End</div>
			</Flex>
		</div>
	</div>
	<CodeBlock code={flexCode} lang="svelte" />
</section>

<!-- Grid -->
<section class="doc-section">
	<h2 class="doc-section-title">Grid</h2>
	<p class="doc-section-desc">CSS Grid wrapper. A numeric <code>cols</code> value expands to <code>repeat(n, minmax(0, 1fr))</code>; pass a string for any custom template.</p>
	<div class="preview-box">
		<Grid cols={3} gap={3} class="w-full max-w-sm">
			<div class="demo-box">1</div>
			<div class="demo-box">2</div>
			<div class="demo-box">3</div>
			<div class="demo-box">4</div>
			<div class="demo-box">5</div>
			<div class="demo-box">6</div>
		</Grid>
	</div>
	<CodeBlock code={gridCode} lang="svelte" />
</section>

<!-- Spacer -->
<section class="doc-section">
	<h2 class="doc-section-title">Spacer</h2>
	<p class="doc-section-desc">Fills remaining space in a flex container (<code>flex: 1 1 0</code>). Pass <code>size</code> for a fixed gap instead.</p>
	<div class="preview-box preview-box-start" style="flex-direction: column; align-items: stretch; gap: 1.5rem;">
		<div>
			<p class="demo-label">Spacer pushes Login/Sign up to the right</p>
			<HStack gap={2} class="w-full rounded-xl bg-muted px-4 py-3">
				<div class="demo-box">Logo</div>
				<Spacer />
				<div class="demo-box accent">Login</div>
				<div class="demo-box accent">Sign up</div>
			</HStack>
		</div>
	</div>
	<CodeBlock code={spacerCode} lang="svelte" />
</section>

<!-- API Reference -->
<section class="doc-section">
	<h2 class="doc-section-title">API Reference — Flex</h2>
	<PropsTable props={flexProps} />
</section>

<section class="doc-section">
	<h2 class="doc-section-title">API Reference — Grid</h2>
	<PropsTable props={gridProps} />
</section>

<section class="doc-section">
	<h2 class="doc-section-title">API Reference — HStack</h2>
	<PropsTable props={hstackProps} />
</section>

<section class="doc-section">
	<h2 class="doc-section-title">API Reference — VStack</h2>
	<PropsTable props={vstackProps} />
</section>

<section class="doc-section">
	<h2 class="doc-section-title">API Reference — Spacer</h2>
	<PropsTable props={spacerProps} />
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
	.preview-box-start { align-items: flex-start; justify-content: flex-start; }

	.demo-box {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 3rem;
		height: 3rem;
		border-radius: 0.5rem;
		background: var(--accent);
		opacity: 0.7;
		font-size: 0.75rem;
		font-weight: 700;
		color: var(--accent-foreground, #fff);
	}

	.demo-box.accent {
		opacity: 1;
		background: color-mix(in srgb, var(--accent) 20%, transparent);
		color: var(--accent);
		border: 1px solid color-mix(in srgb, var(--accent) 30%, transparent);
	}

	.demo-label {
		font-size: 0.72rem;
		color: var(--muted-foreground);
		margin-bottom: 0.5rem;
	}
</style>
