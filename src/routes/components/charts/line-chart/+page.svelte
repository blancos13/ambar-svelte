<script lang="ts">
	import LineChart from '$lib/components/LineChart.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import PropsTable from '$lib/components/PropsTable.svelte';

	const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

	const series = [
		{ label: 'Views', data: [1200, 1900, 1500, 2100, 1800, 2400, 2200], area: true },
		{ label: 'Likes', data: [340, 520, 410, 680, 590, 820, 760] }
	];

	const seriesNoArea = [
		{ label: 'Views', data: [1200, 1900, 1500, 2100, 1800, 2400, 2200] },
		{ label: 'Likes', data: [340, 520, 410, 680, 590, 820, 760] }
	];

	const seriesSharp = [
		{ label: 'Sessions', data: [900, 1400, 1100, 1700, 1300, 2000, 1800], area: true }
	];

	const importCode = `import LineChart from '$lib/components/LineChart.svelte';`;

	const usageCode = `<script lang="ts">
  const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const series = [
    { label: 'Views', data: [1200, 1900, 1500, 2100, 1800, 2400, 2200], area: true },
    { label: 'Likes', data: [340, 520, 410, 680, 590, 820, 760] }
  ];
<\/script>

<LineChart {labels} {series} />`;

	const noAreaCode = `<!-- area: true omitted for each series -->
<LineChart {labels} series={seriesNoArea} />`;

	const sharpCode = `<!-- smooth={false} for angular lines -->
<LineChart {labels} series={seriesSharp} :smooth="false" />`;

	const props = [
		{ name: 'labels', type: 'string[]',      description: 'X-axis labels, one per data point.' },
		{ name: 'series', type: 'LineSeries[]',   description: 'Each series: { label, data: number[], color?, area?: boolean }. Set area: true to fill beneath the line.' },
		{ name: 'height', type: 'number',         default: '260',  description: 'Chart height in pixels.' },
		{ name: 'smooth', type: 'boolean',        default: 'true', description: 'Use smooth bezier curves. Set false for straight angular lines.' },
		{ name: 'grid',   type: 'boolean',        default: 'true', description: 'Show horizontal grid lines.' },
		{ name: 'class',  type: 'string',         description: 'Extra CSS classes applied to the root element.' },
	];
</script>

<div class="comp-header">
	<div class="comp-header-top">
		<h1 class="comp-title">Line Chart</h1>
	</div>
	<p class="comp-desc">Smooth or sharp line chart with optional area fill — ideal for time-series and trend data.</p>
</div>

<!-- IMPORT -->
<section class="doc-section">
	<h2 class="doc-section-title">Import</h2>
	<CodeBlock code={importCode} lang="ts" />
</section>

<!-- USAGE -->
<section class="doc-section">
	<h2 class="doc-section-title">Usage</h2>
	<p class="doc-section-desc">Enable <code>area: true</code> on individual series to add a gradient fill beneath the line.</p>
	<div class="preview-box">
		<LineChart {labels} {series} />
	</div>
	<CodeBlock code={usageCode} lang="svelte" />
</section>

<!-- NO AREA -->
<section class="doc-section">
	<h2 class="doc-section-title">Lines Only</h2>
	<p class="doc-section-desc">Omit <code>area</code> from series to show clean lines without fill.</p>
	<div class="preview-box">
		<LineChart {labels} series={seriesNoArea} />
	</div>
	<CodeBlock code={noAreaCode} lang="svelte" />
</section>

<!-- SHARP LINES -->
<section class="doc-section">
	<h2 class="doc-section-title">Sharp Lines</h2>
	<p class="doc-section-desc">Set <code>smooth={false}</code> for angular, data-accurate lines without bezier interpolation.</p>
	<div class="preview-box">
		<LineChart {labels} series={seriesSharp} smooth={false} />
	</div>
	<CodeBlock code={sharpCode} lang="svelte" />
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
