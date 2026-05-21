<script lang="ts">
	import GlobeChart from '$lib/components/GlobeChart.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import PropsTable from '$lib/components/PropsTable.svelte';

	const trafficData: Record<string, number> = {
		US: 9200, CN: 7100, IN: 5800, DE: 3200, GB: 2900,
		FR: 2400, BR: 2100, CA: 1900, AU: 1600, JP: 1500,
		KR: 1200, MX: 1100, RU: 1000, IT: 980, ES: 870,
		NL: 760, SE: 640, PL: 580, TR: 520, AR: 490,
		ZA: 430, NG: 380, EG: 350, SA: 320, AE: 290,
		SG: 280, ID: 260, TH: 240, VN: 210, PH: 190,
	};

	const revenueData: Record<string, number> = {
		US: 48000, GB: 18000, DE: 15000, FR: 12000, JP: 10000,
		CA: 9000, AU: 8500, NL: 7200, SE: 6800, CH: 6500,
		NO: 5200, DK: 4800, FI: 4200, SG: 3900, NZ: 3200,
	};

	const importCode = `import GlobeChart from '$lib/components/GlobeChart.svelte';`;

	const usageCode = `<script lang="ts">
  // Keys are ISO 3166-1 alpha-2 country codes
  const data: Record<string, number> = {
    US: 9200, CN: 7100, IN: 5800, DE: 3200, GB: 2900,
    FR: 2400, BR: 2100, CA: 1900, AU: 1600, JP: 1500,
  };
<\/script>

<GlobeChart {data} />`;

	const rotateCode = `<!-- Auto-rotating globe -->
<GlobeChart {data} autoRotate speed={0.3} />

<!-- Faster rotation -->
<GlobeChart {data} autoRotate speed={1.2} />`;

	const colorCode = `<!-- Warm color scheme -->
<GlobeChart {data} colorFrom="#7c3aed" colorTo="#f59e0b" />

<!-- Green scheme -->
<GlobeChart {data} colorFrom="#14532d" colorTo="#22c55e" />`;

	const sizeCode = `<GlobeChart {data} :size="320" />`;

	const props = [
		{ name: 'data',        type: "Record<string, number>", description: "Country data keyed by ISO 3166-1 alpha-2 codes (e.g. 'US', 'DE'). Values drive color intensity." },
		{ name: 'colorFrom',   type: 'string', default: "'#1e40af'", description: 'Start color for the choropleth gradient (low values).' },
		{ name: 'colorTo',     type: 'string', description: 'End color for the gradient (high values). Defaults to a lighter accent shade.' },
		{ name: 'emptyColor',  type: 'string', description: 'Fill color for countries with no data.' },
		{ name: 'size',        type: 'number', description: 'Diameter of the rendered globe in pixels.' },
		{ name: 'autoRotate',  type: 'boolean', default: 'false', description: 'Continuously rotate the globe.' },
		{ name: 'speed',       type: 'number', description: 'Rotation speed multiplier when autoRotate is enabled.' },
		{ name: 'class',       type: 'string', description: 'Extra CSS classes applied to the root element.' },
	];
</script>

<div class="comp-header">
	<div class="comp-header-top">
		<h1 class="comp-title">Globe Chart</h1>
	</div>
	<p class="comp-desc">Interactive 3D globe with choropleth coloring for visualizing country-level data worldwide.</p>
</div>

<!-- IMPORT -->
<section class="doc-section">
	<h2 class="doc-section-title">Import</h2>
	<CodeBlock code={importCode} lang="ts" />
</section>

<!-- USAGE -->
<section class="doc-section">
	<h2 class="doc-section-title">Usage</h2>
	<p class="doc-section-desc">Pass a map of <code>ISO alpha-2 country codes</code> to numeric values. Higher values appear more intensely colored.</p>
	<div class="preview-box">
		<GlobeChart data={trafficData} />
	</div>
	<CodeBlock code={usageCode} lang="svelte" />
</section>

<!-- AUTO ROTATE -->
<section class="doc-section">
	<h2 class="doc-section-title">Auto Rotate</h2>
	<p class="doc-section-desc">Enable continuous rotation with <code>autoRotate</code> and control the speed with <code>speed</code>.</p>
	<div class="preview-box" style="gap: 2rem; display: flex; justify-content: center; flex-wrap: wrap;">
		<GlobeChart data={trafficData} autoRotate={true} speed={0.3} />
		<GlobeChart data={revenueData} autoRotate={true} speed={1.2} colorFrom="#7c3aed" />
	</div>
	<CodeBlock code={rotateCode} lang="svelte" />
</section>

<!-- COLORS -->
<section class="doc-section">
	<h2 class="doc-section-title">Color Schemes</h2>
	<p class="doc-section-desc">Use <code>colorFrom</code> and <code>colorTo</code> to define custom gradient schemes.</p>
	<div class="preview-box" style="gap: 2rem; display: flex; justify-content: center; flex-wrap: wrap;">
		<GlobeChart data={trafficData}  colorFrom="#7c3aed" colorTo="#f59e0b" />
		<GlobeChart data={revenueData}  colorFrom="#14532d" colorTo="#22c55e" />
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
	.preview-box { padding: 1.5rem; border: 1px solid var(--border); border-radius: 0.875rem; background: var(--card); display: flex; }
</style>
