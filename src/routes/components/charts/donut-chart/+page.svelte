<script lang="ts">
	import DonutChart from '$lib/components/DonutChart.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import PropsTable from '$lib/components/PropsTable.svelte';

	const slices = [
		{ label: 'Video', value: 42 },
		{ label: 'Photo', value: 28 },
		{ label: 'Story', value: 18 },
		{ label: 'Live',  value: 12 },
	];

	const slicesRevenue = [
		{ label: 'Product A', value: 55 },
		{ label: 'Product B', value: 30 },
		{ label: 'Product C', value: 15 },
	];

	const importCode = `import DonutChart from '$lib/components/DonutChart.svelte';`;

	const usageCode = `<script lang="ts">
  const slices = [
    { label: 'Video', value: 42 },
    { label: 'Photo', value: 28 },
    { label: 'Story', value: 18 },
    { label: 'Live',  value: 12 },
  ];
<\/script>

<DonutChart {slices} centerLabel="Total" centerValue="100" />`;

	const thicknessCode = `<!-- Thinner ring -->
<DonutChart {slices} :thickness="28" />

<!-- Thicker ring -->
<DonutChart {slices} :thickness="60" />`;

	const sizeCode = `<DonutChart {slices} :size="160" centerLabel="Revenue" centerValue="$48k" />`;

	const props = [
		{ name: 'slices',       type: 'DonutSlice[]', description: 'Each slice: { label: string, value: number, color?: string }. Values are treated as relative proportions.' },
		{ name: 'size',         type: 'number',       default: '220',  description: 'Diameter of the donut in pixels.' },
		{ name: 'thickness',    type: 'number',       default: '44',   description: 'Ring thickness in pixels.' },
		{ name: 'centerLabel',  type: 'string',       description: 'Small text displayed at the center of the donut.' },
		{ name: 'centerValue',  type: 'string',       description: 'Large value displayed at the center of the donut.' },
		{ name: 'class',        type: 'string',       description: 'Extra CSS classes applied to the root element.' },
	];
</script>

<div class="comp-header">
	<div class="comp-header-top">
		<h1 class="comp-title">Donut Chart</h1>
	</div>
	<p class="comp-desc">Circular donut chart for part-to-whole comparisons with an optional center label.</p>
</div>

<!-- IMPORT -->
<section class="doc-section">
	<h2 class="doc-section-title">Import</h2>
	<CodeBlock code={importCode} lang="ts" />
</section>

<!-- USAGE -->
<section class="doc-section">
	<h2 class="doc-section-title">Usage</h2>
	<p class="doc-section-desc">Pass an array of slices and an optional <code>centerLabel</code> / <code>centerValue</code> for a KPI display.</p>
	<div class="preview-box">
		<DonutChart {slices} centerLabel="Total" centerValue="100" />
	</div>
	<CodeBlock code={usageCode} lang="svelte" />
</section>

<!-- THICKNESS -->
<section class="doc-section">
	<h2 class="doc-section-title">Ring Thickness</h2>
	<p class="doc-section-desc">Control the ring width with the <code>thickness</code> prop.</p>
	<div class="preview-box" style="gap: 2.5rem; display: flex; justify-content: center; flex-wrap: wrap;">
		<DonutChart {slices} thickness={28} centerLabel="Thin" />
		<DonutChart {slices} thickness={60} centerLabel="Thick" />
	</div>
	<CodeBlock code={thicknessCode} lang="svelte" />
</section>

<!-- SIZE + CENTER VALUE -->
<section class="doc-section">
	<h2 class="doc-section-title">Custom Size & Center Value</h2>
	<p class="doc-section-desc">Shrink the chart with <code>size</code> and show a formatted value in the center.</p>
	<div class="preview-box">
		<DonutChart slices={slicesRevenue} size={160} centerLabel="Revenue" centerValue="$48k" />
	</div>
	<CodeBlock code={sizeCode} lang="svelte" />
</section>

<!-- API REFERENCE -->
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
	.preview-box { padding: 1.5rem; border: 1px solid var(--border); border-radius: 0.875rem; background: var(--card); }
</style>
