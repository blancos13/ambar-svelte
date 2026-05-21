<script lang="ts">
	import HeatMap from '$lib/components/HeatMap.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import PropsTable from '$lib/components/PropsTable.svelte';

	// Generate last 365 days of random contribution-like data
	function generateHeatmapData(): Record<string, number> {
		const data: Record<string, number> = {};
		const now = new Date();
		for (let i = 364; i >= 0; i--) {
			const d = new Date(now);
			d.setDate(d.getDate() - i);
			const key = d.toISOString().slice(0, 10);
			// Weighted random: mostly 0, occasional spikes
			const rand = Math.random();
			if (rand > 0.65) {
				data[key] = Math.floor(Math.random() * 12) + 1;
			}
		}
		return data;
	}

	const contributionData = generateHeatmapData();

	function generateGreenData(): Record<string, number> {
		const data: Record<string, number> = {};
		const now = new Date();
		for (let i = 364; i >= 0; i--) {
			const d = new Date(now);
			d.setDate(d.getDate() - i);
			const key = d.toISOString().slice(0, 10);
			if (Math.random() > 0.6) {
				data[key] = Math.floor(Math.random() * 8) + 1;
			}
		}
		return data;
	}

	const greenData = generateGreenData();

	const importCode = `import HeatMap from '$lib/components/HeatMap.svelte';`;

	const usageCode = `<script lang="ts">
  // Keys must be 'YYYY-MM-DD' format
  const data: Record<string, number> = {
    '2024-11-01': 4,
    '2024-11-02': 7,
    '2024-11-05': 2,
    // ...
  };
<\/script>

<HeatMap {data} label="Contributions" />`;

	const generateCode = `// Generate last 365 days
function generateData(): Record<string, number> {
  const result: Record<string, number> = {};
  const now = new Date();
  for (let i = 364; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    if (Math.random() > 0.6) {
      result[key] = Math.floor(Math.random() * 12) + 1;
    }
  }
  return result;
}`;

	const colorCode = `<!-- Blue (default) -->
<HeatMap {data} color="#60a5fa" label="Commits" />

<!-- Green (GitHub style) -->
<HeatMap {data} color="#22c55e" label="Activity" />`;

	const cellSizeCode = `<!-- Larger cells -->
<HeatMap {data} :cellSize="16" :gap="4" />

<!-- Compact cells -->
<HeatMap {data} :cellSize="10" :gap="2" />`;

	const props = [
		{ name: 'data',     type: "Record<string, number>", description: "Activity data keyed by 'YYYY-MM-DD' date strings. Values determine cell intensity." },
		{ name: 'label',    type: 'string',   default: "''",       description: 'Text label displayed below the heatmap.' },
		{ name: 'color',    type: 'string',   default: "'#60a5fa'", description: 'Base color for active cells. Intensity is derived from the value.' },
		{ name: 'cellSize', type: 'number',   default: '12',       description: 'Width and height of each day cell in pixels.' },
		{ name: 'gap',      type: 'number',   default: '3',        description: 'Gap between cells in pixels.' },
		{ name: 'class',    type: 'string',   description: 'Extra CSS classes applied to the root element.' },
	];
</script>

<div class="comp-header">
	<div class="comp-header-top">
		<h1 class="comp-title">Heatmap</h1>
	</div>
	<p class="comp-desc">GitHub-style contribution heatmap for visualizing daily activity over a full year.</p>
</div>

<!-- IMPORT -->
<section class="doc-section">
	<h2 class="doc-section-title">Import</h2>
	<CodeBlock code={importCode} lang="ts" />
</section>

<!-- USAGE -->
<section class="doc-section">
	<h2 class="doc-section-title">Usage</h2>
	<p class="doc-section-desc">Pass a <code>Record&lt;string, number&gt;</code> with <code>YYYY-MM-DD</code> keys. Missing dates render as empty cells.</p>
	<div class="preview-box">
		<HeatMap data={contributionData} label="Contributions" />
	</div>
	<CodeBlock code={usageCode} lang="svelte" />
</section>

<!-- GENERATE DATA -->
<section class="doc-section">
	<h2 class="doc-section-title">Generating Data</h2>
	<p class="doc-section-desc">Use this pattern to generate a full year of random activity data for demos.</p>
	<CodeBlock code={generateCode} lang="ts" />
</section>

<!-- COLORS -->
<section class="doc-section">
	<h2 class="doc-section-title">Colors</h2>
	<p class="doc-section-desc">Change the heatmap color with the <code>color</code> prop.</p>
	<div class="preview-box" style="flex-direction: column; gap: 1.5rem; align-items: flex-start;">
		<HeatMap data={contributionData} color="#60a5fa" label="Commits" />
		<HeatMap data={greenData} color="#22c55e" label="Activity" />
	</div>
	<CodeBlock code={colorCode} lang="svelte" />
</section>

<!-- CELL SIZE -->
<section class="doc-section">
	<h2 class="doc-section-title">Cell Size</h2>
	<p class="doc-section-desc">Adjust <code>cellSize</code> and <code>gap</code> for different density levels.</p>
	<div class="preview-box" style="flex-direction: column; gap: 1.5rem; align-items: flex-start;">
		<HeatMap data={contributionData} cellSize={16} gap={4} label="Large cells" />
		<HeatMap data={contributionData} cellSize={10} gap={2} label="Compact cells" />
	</div>
	<CodeBlock code={cellSizeCode} lang="svelte" />
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
	.preview-box { padding: 1.5rem; border: 1px solid var(--border); border-radius: 0.875rem; background: var(--card); display: flex; }
</style>
