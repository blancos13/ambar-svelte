<script lang="ts">
	const charts = [
		{ name: 'Bar Chart',   href: '/components/charts/bar-chart',   desc: 'Grouped & stacked bar charts with multi-series support.'      },
		{ name: 'Line Chart',  href: '/components/charts/line-chart',   desc: 'Smooth line chart with optional area fill and multi-series.'  },
		{ name: 'Donut Chart', href: '/components/charts/donut-chart',  desc: 'Animated donut/pie with center label support.'               },
		{ name: 'Sparkline',   href: '/components/charts/sparkline',    desc: 'Compact inline chart for stats and KPI cards.'               },
		{ name: 'Heatmap',     href: '/components/charts/heatmap',      desc: 'GitHub-style contribution heatmap, 365-day view.'           },
		{ name: 'Candlestick', href: '/components/charts/candlestick',  desc: 'OHLCV candlestick with optional volume panel.'              },
		{ name: 'Realtime',    href: '/components/charts/realtime',     desc: 'Live-updating line chart with simulated price feed.'        },
		{ name: 'Globe',       href: '/components/charts/globe',        desc: 'Interactive 3D globe with per-country data coloring.'       },
	];
</script>

<div class="comp-header">
	<div class="comp-header-top">
		<h1 class="comp-title">Charts</h1>
	</div>
	<p class="comp-desc">8 chart components — built with pure SVG, zero dependencies, fully theme-aware.</p>
</div>

<div class="chart-grid">
	{#each charts as chart}
		<a href={chart.href} class="chart-card">
			<div class="chart-info">
				<span class="chart-name">{chart.name}</span>
				<span class="chart-desc">{chart.desc}</span>
			</div>
			<svg class="chart-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<path d="M9 18l6-6-6-6"/>
			</svg>
		</a>
	{/each}
</div>

<style>
	.comp-header { margin-bottom: 2.5rem; padding-bottom: 1.5rem; border-bottom: 1px solid var(--border); }
	.comp-header-top { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.5rem; }
	.comp-title { font-size: 1.875rem; font-weight: 800; letter-spacing: -0.025em; color: var(--foreground); }
	.comp-desc { color: var(--muted-foreground); font-size: 0.9375rem; line-height: 1.6; }

	.chart-grid { display: flex; flex-direction: column; gap: 0.5rem; }

	.chart-card {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 1rem 1.25rem;
		border: 1px solid var(--border);
		border-radius: 0.875rem;
		background: var(--card);
		text-decoration: none;
		transition: border-color 0.15s, background 0.15s;
	}
	.chart-card:hover {
		border-color: var(--accent);
		background: color-mix(in srgb, var(--accent) 4%, var(--card));
	}

	.chart-info { flex: 1; display: flex; flex-direction: column; gap: 0.2rem; }
	.chart-name { font-size: 0.9rem; font-weight: 600; color: var(--foreground); }
	.chart-desc { font-size: 0.8rem; color: var(--muted-foreground); }
	.chart-arrow { width: 1rem; height: 1rem; color: var(--muted-foreground); flex-shrink: 0; }
</style>
