<script lang="ts">
	import BarChart from '$lib/components/BarChart.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import PropsTable from '$lib/components/PropsTable.svelte';

	const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

	const series = [
		{ label: 'Revenue', data: [42, 58, 51, 73, 65, 88] },
		{ label: 'Expenses', data: [28, 35, 31, 42, 38, 51] }
	];

	const seriesSingle = [
		{ label: 'Users', data: [310, 480, 390, 620, 540, 710] }
	];

	const importCode = `import BarChart from '$lib/components/BarChart.svelte';`;

	const usageCode = `<script lang="ts">
  const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const series = [
    { label: 'Revenue', data: [42, 58, 51, 73, 65, 88] },
    { label: 'Expenses', data: [28, 35, 31, 42, 38, 51] }
  ];
<\/script>

<BarChart {labels} {series} />`;

	const stackedCode = `<BarChart {labels} {series} stacked />`;

	const singleCode = `<script lang="ts">
  const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const series = [{ label: 'Users', data: [310, 480, 390, 620, 540, 710] }];
<\/script>

<BarChart {labels} {series} :height="200" />`;

	const noGridCode = `<BarChart {labels} {series} :grid="false" />`;

	const props = [
		{ name: 'labels',  type: 'string[]',      description: 'X-axis category labels, one per data point.' },
		{ name: 'series',  type: 'BarSeries[]',    description: 'Array of data series. Each series has label, data: number[], and optional color.' },
		{ name: 'height',  type: 'number',         default: '260',   description: 'Chart height in pixels.' },
		{ name: 'grid',    type: 'boolean',        default: 'true',  description: 'Show horizontal grid lines.' },
		{ name: 'stacked', type: 'boolean',        default: 'false', description: 'Stack bars on top of each other instead of grouping side-by-side.' },
		{ name: 'class',   type: 'string',         description: 'Extra CSS classes applied to the root element.' },
	];
</script>

<div class="comp-header">
	<div class="comp-header-top">
		<h1 class="comp-title">Bar Chart</h1>
	</div>
	<p class="comp-desc">Grouped and stacked bar chart for comparing categorical data across multiple series.</p>
</div>

<!-- IMPORT -->
<section class="doc-section">
	<h2 class="doc-section-title">Import</h2>
	<CodeBlock code={importCode} lang="ts" />
</section>

<!-- USAGE -->
<section class="doc-section">
	<h2 class="doc-section-title">Usage</h2>
	<p class="doc-section-desc">Pass <code>labels</code> and <code>series</code> to render a grouped bar chart.</p>
	<div class="preview-box">
		<BarChart {labels} {series} />
	</div>
	<CodeBlock code={usageCode} lang="svelte" />
</section>

<!-- STACKED -->
<section class="doc-section">
	<h2 class="doc-section-title">Stacked</h2>
	<p class="doc-section-desc">Enable <code>stacked</code> to display bars on top of each other, useful for part-to-whole comparisons.</p>
	<div class="preview-box">
		<BarChart {labels} {series} stacked />
	</div>
	<CodeBlock code={stackedCode} lang="svelte" />
</section>

<!-- SINGLE SERIES -->
<section class="doc-section">
	<h2 class="doc-section-title">Single Series</h2>
	<p class="doc-section-desc">Works just as well with a single data series.</p>
	<div class="preview-box">
		<BarChart {labels} series={seriesSingle} height={200} />
	</div>
	<CodeBlock code={singleCode} lang="svelte" />
</section>

<!-- NO GRID -->
<section class="doc-section">
	<h2 class="doc-section-title">Without Grid</h2>
	<p class="doc-section-desc">Hide the horizontal grid lines with <code>grid={false}</code>.</p>
	<div class="preview-box">
		<BarChart {labels} {series} grid={false} />
	</div>
	<CodeBlock code={noGridCode} lang="svelte" />
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
