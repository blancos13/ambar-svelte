<script lang="ts">
	import CandlestickChart from '$lib/components/CandlestickChart.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import PropsTable from '$lib/components/PropsTable.svelte';

	// Generate realistic-looking OHLCV candle data
	function generateCandles(count: number, startPrice = 185, startDate = '2024-10-01') {
		const candles = [];
		let price = startPrice;
		const date = new Date(startDate);
		for (let i = 0; i < count; i++) {
			const change = (Math.random() - 0.48) * price * 0.025;
			const open = parseFloat(price.toFixed(2));
			const close = parseFloat((price + change).toFixed(2));
			const high = parseFloat((Math.max(open, close) + Math.random() * price * 0.012).toFixed(2));
			const low = parseFloat((Math.min(open, close) - Math.random() * price * 0.012).toFixed(2));
			const volume = Math.floor(Math.random() * 18_000_000 + 4_000_000);
			candles.push({
				date: date.toISOString().slice(0, 10),
				open,
				high,
				low,
				close,
				volume
			});
			price = close;
			date.setDate(date.getDate() + 1);
			// Skip weekends
			while (date.getDay() === 0 || date.getDay() === 6) {
				date.setDate(date.getDate() + 1);
			}
		}
		return candles;
	}

	const candles = generateCandles(30);
	const candlesNoVolume = generateCandles(30, 420, '2024-10-01');

	const importCode = `import CandlestickChart from '$lib/components/CandlestickChart.svelte';`;

	const usageCode = `<script lang="ts">
  const candles = [
    { date: '2024-10-01', open: 185.20, high: 188.50, low: 183.10, close: 187.30, volume: 12500000 },
    { date: '2024-10-02', open: 187.30, high: 190.80, low: 186.00, close: 189.90, volume: 9800000 },
    // ...30 candles total
  ];
<\/script>

<CandlestickChart {candles} />`;

	const noVolumeCode = `<CandlestickChart {candles} :volume="false" />`;

	const noGridCode = `<CandlestickChart {candles} :grid="false" />`;

	const heightCode = `<CandlestickChart {candles} :height="240" />`;

	const props = [
		{ name: 'candles', type: 'Candle[]',  description: 'Array of OHLCV candle objects. Each: { date: string, open, high, low, close: number, volume?: number }.' },
		{ name: 'height',  type: 'number',    default: '320',  description: 'Total chart height in pixels (includes volume panel if shown).' },
		{ name: 'volume',  type: 'boolean',   default: 'true', description: 'Show the volume bar panel beneath the price chart.' },
		{ name: 'grid',    type: 'boolean',   default: 'true', description: 'Show horizontal price grid lines.' },
		{ name: 'class',   type: 'string',    description: 'Extra CSS classes applied to the root element.' },
	];
</script>

<div class="comp-header">
	<div class="comp-header-top">
		<h1 class="comp-title">Candlestick Chart</h1>
	</div>
	<p class="comp-desc">OHLCV candlestick chart for financial price data with an optional volume panel.</p>
</div>

<!-- IMPORT -->
<section class="doc-section">
	<h2 class="doc-section-title">Import</h2>
	<CodeBlock code={importCode} lang="ts" />
</section>

<!-- USAGE -->
<section class="doc-section">
	<h2 class="doc-section-title">Usage</h2>
	<p class="doc-section-desc">Pass an array of candle objects with <code>open</code>, <code>high</code>, <code>low</code>, and <code>close</code> values. Add <code>volume</code> for the volume panel.</p>
	<div class="preview-box">
		<CandlestickChart {candles} />
	</div>
	<CodeBlock code={usageCode} lang="svelte" />
</section>

<!-- NO VOLUME -->
<section class="doc-section">
	<h2 class="doc-section-title">Without Volume</h2>
	<p class="doc-section-desc">Hide the volume bars by setting <code>volume={false}</code>.</p>
	<div class="preview-box">
		<CandlestickChart candles={candlesNoVolume} volume={false} />
	</div>
	<CodeBlock code={noVolumeCode} lang="svelte" />
</section>

<!-- NO GRID -->
<section class="doc-section">
	<h2 class="doc-section-title">Without Grid</h2>
	<div class="preview-box">
		<CandlestickChart {candles} grid={false} />
	</div>
	<CodeBlock code={noGridCode} lang="svelte" />
</section>

<!-- CUSTOM HEIGHT -->
<section class="doc-section">
	<h2 class="doc-section-title">Custom Height</h2>
	<div class="preview-box">
		<CandlestickChart {candles} height={240} />
	</div>
	<CodeBlock code={heightCode} lang="svelte" />
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
