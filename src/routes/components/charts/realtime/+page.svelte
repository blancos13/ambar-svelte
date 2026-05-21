<script lang="ts">
	import { onMount } from 'svelte';
	import RealtimeLineChart from '$lib/components/RealtimeLineChart.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import PropsTable from '$lib/components/PropsTable.svelte';

	// ── simulated external feed for the live demo ──────────────────────
	let externalPrice = $state(42000);
	let simPrice      = 42000;

	onMount(() => {
		const id = setInterval(() => {
			const drift = (42000 - simPrice) * 0.003;
			const vol   = simPrice * 0.007;
			simPrice    = Math.max(simPrice * 0.6, simPrice + drift + (Math.random() - 0.5) * vol);
			externalPrice = simPrice;
		}, 500);
		return () => clearInterval(id);
	});

	// ── code snippets ──────────────────────────────────────────────────
	const importCode = `import { RealtimeLineChart } from 'ambar-ui';`;

	const demoCode = `<!-- Built-in simulation — no data source needed -->
<RealtimeLineChart label="BTC/USD" initialPrice={42000} />`;

	const wsCode = `<script>
  import { onMount } from 'svelte';
  import { RealtimeLineChart } from 'ambar-ui';

  let price = $state(42000);

  onMount(() => {
    const ws = new WebSocket('wss://your-api/prices');

    ws.onmessage = (event) => {
      // Parse whatever shape your API returns
      price = JSON.parse(event.data).price;
    };

    return () => ws.close();
  });
<\/script>

<!--
  latestPrice  →  drives the chart from outside
  initialPrice →  sets the starting value (used before first WS message)
  tickMs       →  match your server's publish interval for smooth animation
-->
<RealtimeLineChart
  label="BTC/USD"
  initialPrice={42000}
  latestPrice={price}
  tickMs={500}
  points={120}
/>`;

	const pollCode = `<script>
  import { onMount } from 'svelte';
  import { RealtimeLineChart } from 'ambar-ui';

  let price = $state(0);

  onMount(() => {
    async function fetchPrice() {
      const res  = await fetch('/api/price/BTC');
      const data = await res.json();
      price = data.price;
    }

    fetchPrice();
    const id = setInterval(fetchPrice, 1000);
    return () => clearInterval(id);
  });
<\/script>

<RealtimeLineChart
  label="BTC/USD"
  latestPrice={price}
  tickMs={1000}
/>`;

	const gamblingCode = `<script>
  import { onMount } from 'svelte';
  import { RealtimeLineChart } from 'ambar-ui';

  // Each round the multiplier ticks up, then crashes.
  // Just push each tick value into latestPrice.
  let multiplier = $state(1.00);

  onMount(() => {
    const ws = new WebSocket('wss://your-game/crash');
    ws.onmessage = (e) => {
      multiplier = JSON.parse(e.data).multiplier; // e.g. 1.05, 1.23, 2.44 …
    };
    return () => ws.close();
  });
<\/script>

<RealtimeLineChart
  label="Multiplier"
  initialPrice={1.00}
  latestPrice={multiplier}
  tickMs={100}
  points={80}
  height={220}
/>`;

	const props = [
		{ name: 'label',        type: 'string',  default: "'BTC/USD'",  description: 'Asset or metric label shown above the chart.' },
		{ name: 'initialPrice', type: 'number',  default: '42000',      description: 'Starting value. Used as the seed for the built-in simulation, or as the chart\'s initial state before the first external price arrives.' },
		{ name: 'latestPrice',  type: 'number',  default: 'undefined',  description: 'External live value. When provided, disables the built-in simulation and animates toward each new value you push (WebSocket, polling, game loop, etc.).' },
		{ name: 'tickMs',       type: 'number',  default: '350',        description: 'Animation cycle in milliseconds. Match this to your data source\'s publish interval for smooth scrolling.' },
		{ name: 'points',       type: 'number',  default: '120',        description: 'Number of data points visible in the rolling window.' },
		{ name: 'height',       type: 'number',  default: '280',        description: 'Chart height in pixels.' },
		{ name: 'class',        type: 'string',  default: "''",         description: 'Extra CSS classes applied to the root element.' },
	];
</script>

<div class="comp-header">
	<div class="comp-header-top">
		<h1 class="comp-title">Realtime Line Chart</h1>
	</div>
	<p class="comp-desc">
		Smooth rolling line chart with a built-in simulation mode for demos,
		and a <code>latestPrice</code> prop to drive it from any live data source —
		WebSocket, REST polling, game loop, or anything else.
	</p>
</div>

<!-- IMPORT -->
<section class="doc-section">
	<h2 class="doc-section-title">Import</h2>
	<CodeBlock code={importCode} lang="ts" />
</section>

<!-- DEMO MODE -->
<section class="doc-section">
	<h2 class="doc-section-title">Demo Mode</h2>
	<p class="doc-section-desc">
		Drop it in with no data source — the component runs its own simulation.
		Great for prototyping and previews.
	</p>
	<div class="preview-box">
		<RealtimeLineChart label="BTC/USD" initialPrice={42000} />
	</div>
	<CodeBlock code={demoCode} lang="svelte" />
</section>

<!-- LIVE DATA -->
<section class="doc-section">
	<h2 class="doc-section-title">Live Data (WebSocket)</h2>
	<p class="doc-section-desc">
		Pass <code>latestPrice</code> to take control. The chart animates toward
		each new value — this demo below is driven by a simulated external feed
		(500 ms interval) instead of the built-in random walk.
	</p>
	<div class="preview-box">
		<RealtimeLineChart
			label="BTC/USD (external feed)"
			initialPrice={42000}
			latestPrice={externalPrice}
			tickMs={500}
			points={100}
		/>
	</div>
	<p class="doc-section-desc" style="margin-top:0">
		Notice how the chart uses your data instead of its own simulation.
		Swap <code>setInterval</code> with a real WebSocket and it works identically.
	</p>
	<CodeBlock code={wsCode} lang="svelte" />
</section>

<!-- REST POLLING -->
<section class="doc-section">
	<h2 class="doc-section-title">REST Polling</h2>
	<p class="doc-section-desc">
		No WebSocket? A simple <code>setInterval</code> fetch works just as well.
		Set <code>tickMs</code> to match your poll interval.
	</p>
	<CodeBlock code={pollCode} lang="svelte" />
</section>

<!-- GAMBLING / GAME LOOP -->
<section class="doc-section">
	<h2 class="doc-section-title">Game / Crash Multiplier</h2>
	<p class="doc-section-desc">
		Crash-game, slot volatility graph, player balance over time — push any
		numeric series. <code>tickMs={100}</code> for fast game loops.
	</p>
	<CodeBlock code={gamblingCode} lang="svelte" />
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
	.comp-desc code { font-family: ui-monospace, monospace; font-size: 0.85em; background: var(--muted); padding: 0.1rem 0.35rem; border-radius: 0.25rem; color: var(--accent); }
	.doc-section { margin-bottom: 2.5rem; display: flex; flex-direction: column; gap: 1rem; }
	.doc-section-title { font-size: 1.125rem; font-weight: 700; color: var(--foreground); letter-spacing: -0.01em; }
	.doc-section-desc { font-size: 0.875rem; color: var(--muted-foreground); margin-top: -0.5rem; }
	.doc-section-desc code { font-family: ui-monospace, monospace; font-size: 0.8em; background: var(--muted); padding: 0.1rem 0.35rem; border-radius: 0.25rem; color: var(--accent); }
	.preview-box { padding: 1.5rem; border: 1px solid var(--border); border-radius: 0.875rem; background: var(--card); }
</style>
