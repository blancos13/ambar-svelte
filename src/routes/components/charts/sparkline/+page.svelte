<script lang="ts">
	import Sparkline from '$lib/components/Sparkline.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import PropsTable from '$lib/components/PropsTable.svelte';

	const revenueData  = [42, 55, 48, 72, 61, 85, 78, 93, 88, 104];
	const usersData    = [120, 98, 135, 110, 148, 162, 145, 178, 190, 215];
	const bounceData   = [58, 62, 55, 70, 65, 52, 48, 60, 45, 42];
	const sessionData  = [3.2, 2.8, 3.5, 3.1, 4.0, 3.8, 4.2, 3.9, 4.5, 4.8];

	const importCode = `import Sparkline from '$lib/components/Sparkline.svelte';`;

	const usageCode = `<script lang="ts">
  const data = [42, 55, 48, 72, 61, 85, 78, 93, 88, 104];
<\/script>

<Sparkline {data} />`;

	const statsCardCode = `<div class="stat-card">
  <div class="stat-info">
    <span class="stat-label">Revenue</span>
    <span class="stat-value">$12,450</span>
    <span class="stat-delta positive">+18.2%</span>
  </div>
  <Sparkline data={revenueData} width={80} height={36} area />
</div>`;

	const minmaxCode = `<Sparkline data={data} minmax value />`;

	const colorCode = `<Sparkline data={data} color="#22c55e" area />
<Sparkline data={data} color="#f43f5e" area />
<Sparkline data={data} color="#a855f7" area />`;

	const props = [
		{ name: 'data',   type: 'number[]', description: 'Array of numeric values to plot.' },
		{ name: 'width',  type: 'number',   default: '80',    description: 'SVG width in pixels.' },
		{ name: 'height', type: 'number',   default: '32',    description: 'SVG height in pixels.' },
		{ name: 'color',  type: 'string',   description: 'Stroke and fill color. Defaults to the accent CSS variable.' },
		{ name: 'area',   type: 'boolean',  default: 'true',  description: 'Fill the area beneath the line with a gradient.' },
		{ name: 'value',  type: 'boolean',  default: 'false', description: 'Show the last data value as text next to the chart.' },
		{ name: 'minmax', type: 'boolean',  default: 'false', description: 'Annotate the minimum and maximum data points.' },
		{ name: 'class',  type: 'string',   description: 'Extra CSS classes applied to the root element.' },
	];
</script>

<div class="comp-header">
	<div class="comp-header-top">
		<h1 class="comp-title">Sparkline</h1>
	</div>
	<p class="comp-desc">Compact inline chart for embedding trend data inside cards, tables, and stat displays.</p>
</div>

<!-- IMPORT -->
<section class="doc-section">
	<h2 class="doc-section-title">Import</h2>
	<CodeBlock code={importCode} lang="ts" />
</section>

<!-- USAGE -->
<section class="doc-section">
	<h2 class="doc-section-title">Usage</h2>
	<div class="preview-box">
		<Sparkline data={revenueData} />
	</div>
	<CodeBlock code={usageCode} lang="svelte" />
</section>

<!-- STATS CARDS -->
<section class="doc-section">
	<h2 class="doc-section-title">In Stats Cards</h2>
	<p class="doc-section-desc">Combine sparklines with metric values for compact KPI cards.</p>
	<div class="preview-box">
		<div class="stats-grid">
			<div class="stat-card">
				<div class="stat-info">
					<span class="stat-label">Revenue</span>
					<span class="stat-value">$12,450</span>
					<span class="stat-delta positive">+18.2%</span>
				</div>
				<Sparkline data={revenueData} width={80} height={36} area={true} />
			</div>
			<div class="stat-card">
				<div class="stat-info">
					<span class="stat-label">Active Users</span>
					<span class="stat-value">2,150</span>
					<span class="stat-delta positive">+12.5%</span>
				</div>
				<Sparkline data={usersData} width={80} height={36} area={true} color="#22c55e" />
			</div>
			<div class="stat-card">
				<div class="stat-info">
					<span class="stat-label">Bounce Rate</span>
					<span class="stat-value">42%</span>
					<span class="stat-delta negative">-8.1%</span>
				</div>
				<Sparkline data={bounceData} width={80} height={36} area={true} color="#f43f5e" />
			</div>
			<div class="stat-card">
				<div class="stat-info">
					<span class="stat-label">Avg Session</span>
					<span class="stat-value">4.8 min</span>
					<span class="stat-delta positive">+9.4%</span>
				</div>
				<Sparkline data={sessionData} width={80} height={36} area={true} color="#a855f7" />
			</div>
		</div>
	</div>
	<CodeBlock code={statsCardCode} lang="svelte" />
</section>

<!-- MIN MAX -->
<section class="doc-section">
	<h2 class="doc-section-title">With Min / Max & Value</h2>
	<p class="doc-section-desc">Enable <code>minmax</code> and <code>value</code> to annotate the chart with data extremes and the latest reading.</p>
	<div class="preview-box" style="gap: 1.5rem; display: flex; align-items: center; justify-content: center; flex-wrap: wrap;">
		<Sparkline data={revenueData} width={120} height={48} minmax={true} value={true} />
		<Sparkline data={usersData}   width={120} height={48} minmax={true} value={true} color="#22c55e" />
	</div>
	<CodeBlock code={minmaxCode} lang="svelte" />
</section>

<!-- COLORS -->
<section class="doc-section">
	<h2 class="doc-section-title">Custom Colors</h2>
	<p class="doc-section-desc">Use the <code>color</code> prop to set any stroke / fill color.</p>
	<div class="preview-box" style="gap: 1.5rem; display: flex; align-items: center; justify-content: center; flex-wrap: wrap;">
		<Sparkline data={revenueData} color="#22c55e" area={true} width={80} height={36} />
		<Sparkline data={revenueData} color="#f43f5e" area={true} width={80} height={36} />
		<Sparkline data={revenueData} color="#a855f7" area={true} width={80} height={36} />
	</div>
	<CodeBlock code={colorCode} lang="svelte" />
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

	.stats-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
		gap: 1rem;
		width: 100%;
	}
	.stat-card {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 1rem 1.25rem;
		border: 1px solid var(--border);
		border-radius: 0.75rem;
		background: var(--background);
		gap: 1rem;
	}
	.stat-info {
		display: flex;
		flex-direction: column;
		gap: 0.125rem;
	}
	.stat-label {
		font-size: 0.75rem;
		color: var(--muted-foreground);
		font-weight: 500;
	}
	.stat-value {
		font-size: 1.125rem;
		font-weight: 700;
		color: var(--foreground);
	}
	.stat-delta {
		font-size: 0.75rem;
		font-weight: 600;
	}
	.stat-delta.positive { color: #22c55e; }
	.stat-delta.negative { color: #f43f5e; }
</style>
