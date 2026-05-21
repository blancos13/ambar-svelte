<script lang="ts">
	import { onMount } from 'svelte';

	type Props = {
		label?:        string;
		initialPrice?: number;
		tickMs?:       number;
		points?:       number;
		height?:       number;
		class?:        string;
		/**
		 * Live price feed (optional).
		 * When provided, internal simulation stops and the chart animates
		 * toward each new value you push — e.g. from a WebSocket or poll.
		 * Set `tickMs` to match your feed interval for smooth animation.
		 */
		latestPrice?:  number;
	};

	let {
		label        = 'BTC/USD',
		initialPrice = 42000,
		tickMs       = 350,
		points       = 120,
		height       = 280,
		class: cls   = '',
		latestPrice  = undefined,
	}: Props = $props();

	const BULL = '#34d399';
	const BEAR = '#f87171';
	const P    = { t: 48, r: 76, b: 24, l: 12 };

	let wrapEl: HTMLDivElement | undefined = $state();
	let svgW = $state(0);

	$effect(() => {
		if (!wrapEl) return;
		svgW = wrapEl.clientWidth;
		const ro = new ResizeObserver(() => { svgW = wrapEl!.clientWidth; });
		ro.observe(wrapEl);
		return () => ro.disconnect();
	});

	const cW    = $derived(Math.max(0, svgW - P.l - P.r));
	const cH    = $derived(Math.max(0, height - P.t - P.b));
	const stepW = $derived(points > 1 ? cW / (points - 1) : cW);

	/* ── seed data ── */
	function genPrices(start: number, n: number): number[] {
		const arr = [start];
		for (let i = 1; i < n; i++) {
			const noise = (Math.random() - 0.49) * arr[i - 1] * 0.003;
			arr.push(Math.max(arr[i - 1] * 0.5, arr[i - 1] + noise));
		}
		return arr;
	}

	let prices       = $state<number[]>(genPrices(initialPrice, points));
	let pendingPrice = $state(prices[prices.length - 1]);
	let phase        = $state(0);   // 0..1 scroll progress within current tick
	let dMin         = $state(0);
	let dMax         = $state(0);

	/* ── init display range ── */
	{
		const mn = Math.min(...prices), mx = Math.max(...prices);
		const pad = Math.max((mx - mn) * 0.25, mx * 0.005);
		dMin = mn - pad;
		dMax = mx + pad;
	}

	/* ── scale helpers ── */
	function sy(v: number) {
		if (dMax === dMin) return P.t + cH / 2;
		return P.t + cH - ((v - dMin) / (dMax - dMin)) * cH;
	}
	function sx(i: number) {
		return P.l + (i - phase) * stepW;
	}

	function ease(t: number) {
		return 1 - Math.pow(1 - t, 3);
	}

	const renderPrices = $derived([
		...prices,
		prices[prices.length - 1] + (pendingPrice - prices[prices.length - 1]) * ease(phase),
	]);

	/* ── path builders ── */
	function makePath(): string {
		if (renderPrices.length < 2 || !cW) return '';
		const pts = renderPrices.map((v, i) => [sx(i), sy(v)] as [number, number]);
		let d = `M ${pts[0][0]} ${pts[0][1]}`;
		for (let i = 1; i < pts.length; i++) {
			const [x0, y0] = pts[i - 1], [x1, y1] = pts[i];
			const cpx = (x0 + x1) / 2;
			d += ` C ${cpx} ${y0} ${cpx} ${y1} ${x1} ${y1}`;
		}
		return d;
	}
	function makeArea(): string {
		const path = makePath();
		if (!path) return '';
		return `${path} L ${sx(renderPrices.length - 1)} ${P.t + cH} L ${sx(0)} ${P.t + cH} Z`;
	}

	/* ── derived display values ── */
	const current = $derived(renderPrices[renderPrices.length - 1]);
	const open    = $derived(prices[0]);
	const change  = $derived(current - open);
	const pct     = $derived((change / open) * 100);
	const bull    = $derived(change >= 0);
	const color   = $derived(bull ? BULL : BEAR);

	function fmt(v: number) {
		if (v >= 1000) return v.toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
		if (v >= 1)    return v.toFixed(4);
		return v.toFixed(6);
	}

	/* ── y ticks ── */
	function niceRange(lo: number, hi: number) {
		if (lo === hi) return [lo];
		const mag  = Math.pow(10, Math.floor(Math.log10((hi - lo) / 4)));
		const norm = (hi - lo) / mag / 4;
		const step = norm < 1.5 ? mag : norm < 3 ? 2 * mag : norm < 7 ? 5 * mag : 10 * mag;
		const out: number[] = [];
		for (let v = Math.floor(lo / step) * step; v <= hi + step * 0.01; v = Math.round((v + step) * 1e9) / 1e9) {
			if (v >= lo && v <= hi) out.push(v);
		}
		return out;
	}
	const yTicks = $derived(niceRange(dMin, dMax));

	const clipId = `rtc-${Math.random().toString(36).slice(2, 8)}`;

	/* ── RAF loop ── */
	let raf = 0, lastTs = 0, nextP = initialPrice;

	function nextPrice(): number {
		const drift = (initialPrice - nextP) * 0.002;
		const vol   = nextP * 0.005;
		nextP = Math.max(nextP * 0.6, nextP + drift + (Math.random() - 0.5) * vol);
		return nextP;
	}

	function updateRange(arr: number[]) {
		const mn = Math.min(...arr), mx = Math.max(...arr);
		const pad = Math.max((mx - mn) * 0.25, mx * 0.005);
		dMin = dMin * 0.94 + (mn - pad) * 0.06;
		dMax = dMax * 0.94 + (mx + pad) * 0.06;
	}

	function loop(ts: number) {
		if (lastTs === 0) lastTs = ts;
		const elapsed = ts - lastTs;
		phase = Math.min(1, elapsed / tickMs);

		if (elapsed >= tickMs) {
			const next = [...prices.slice(1), pendingPrice];
			prices = next;
			// In demo mode, generate the next price internally.
			// In live mode, pendingPrice is already being kept up to date
			// by the $effect below — we just leave it as-is.
			if (latestPrice === undefined) {
				pendingPrice = nextPrice();
			}
			updateRange([...next, pendingPrice]);
			lastTs = ts;
			phase = 0;
		}

		raf = requestAnimationFrame(loop);
	}

	// When an external price arrives, animate toward it immediately.
	$effect(() => {
		if (latestPrice !== undefined) {
			pendingPrice = latestPrice;
			updateRange([...prices, latestPrice]);
		}
	});

	onMount(() => {
		nextP = prices[prices.length - 1];
		if (latestPrice === undefined) pendingPrice = nextPrice();
		raf = requestAnimationFrame(loop);
		return () => cancelAnimationFrame(raf);
	});

	/* ── hover ── */
	let hoverIdx = $state<number | null>(null);
	let tipX     = $state(0);
	let tipY     = $state(0);

	function onMove(e: MouseEvent) {
		if (!wrapEl || !svgW || !stepW) return;
		const r  = wrapEl.getBoundingClientRect();
		const mx = e.clientX - r.left - P.l;
		if (mx < 0 || mx > cW) { hoverIdx = null; return; }
		hoverIdx = Math.max(0, Math.min(renderPrices.length - 1, Math.round((mx + phase * stepW) / stepW)));
		tipX = e.clientX - r.left;
		tipY = e.clientY - r.top;
	}
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	bind:this={wrapEl}
	class="relative select-none {cls}"
	onmousemove={onMove}
	onmouseleave={() => (hoverIdx = null)}
>
{#if svgW > 0}
	<!-- price header -->
	<div class="pointer-events-none absolute top-0 left-0 z-10 flex items-baseline gap-2.5 px-3 pt-2">
		<span class="text-xs font-semibold text-muted-foreground tracking-wide">{label}</span>
		<span class="text-lg font-bold tabular-nums leading-none" style:color>{fmt(current)}</span>
		<span class="text-xs font-semibold tabular-nums" style:color>
			{change >= 0 ? '+' : ''}{fmt(change)}
			({pct >= 0 ? '+' : ''}{pct.toFixed(2)}%)
		</span>
	</div>

	<!-- live badge -->
	<div class="pointer-events-none absolute top-2 right-{P.r + 4}px z-10 flex items-center gap-1 pr-1"
		style:right="{P.r + 4}px">
		<span class="relative flex size-1.5">
			<span class="absolute inline-flex size-full rounded-full opacity-75 animate-ping" style:background={color}></span>
			<span class="relative inline-flex size-1.5 rounded-full" style:background={color}></span>
		</span>
		<span class="text-[10px] font-semibold" style:color>LIVE</span>
	</div>

	<svg width={svgW} {height} class="block">
		<defs>
			<clipPath id={clipId}>
				<rect x={P.l} y={P.t - 4} width={cW} height={cH + 8} />
			</clipPath>
			<linearGradient id="g-{clipId}" x1="0" y1="0" x2="0" y2="1">
				<stop offset="0%"   stop-color={color} stop-opacity="0.2" />
				<stop offset="100%" stop-color={color} stop-opacity="0" />
			</linearGradient>
		</defs>

		<!-- grid -->
		{#each yTicks as t}
			{@const ty = sy(t)}
			{#if ty >= P.t && ty <= P.t + cH}
				<line x1={P.l} y1={ty} x2={P.l + cW} y2={ty}
					stroke="var(--border)" stroke-width="1" />
			{/if}
		{/each}

		<!-- area + line (clipped) -->
		<g clip-path="url(#{clipId})">
			<path d={makeArea()} fill="url(#g-{clipId})" stroke="none" />
			<path d={makePath()} fill="none" stroke={color}
				stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" />
		</g>

		<!-- current price dashed line -->
		{#if sy(current) >= P.t && sy(current) <= P.t + cH}
			{@const cy2 = sy(current)}
			<line x1={P.l} y1={cy2} x2={P.l + cW} y2={cy2}
				stroke={color} stroke-width="1" stroke-dasharray="3 4" opacity="0.5" />
			<!-- pulsing dot at right edge -->
			<circle cx={P.l + cW} cy={cy2} r="6" fill={color} opacity="0.15" />
			<circle cx={P.l + cW} cy={cy2} r="3" fill={color} />
		{/if}

		<!-- hover crosshair -->
		{#if hoverIdx !== null}
			{@const hx = sx(hoverIdx)}
			{@const hy = sy(renderPrices[hoverIdx])}
			{#if hx >= P.l - 1 && hx <= P.l + cW + 1}
				<line x1={hx} y1={P.t} x2={hx} y2={P.t + cH}
					stroke="var(--muted-foreground)" stroke-width="1" stroke-dasharray="3 3" opacity="0.4" />
				<line x1={P.l} y1={hy} x2={P.l + cW} y2={hy}
					stroke="var(--muted-foreground)" stroke-width="1" stroke-dasharray="3 3" opacity="0.4" />
				<circle cx={hx} cy={hy} r="3.5" fill={color} stroke="var(--card)" stroke-width="2" />
			{/if}
		{/if}

		<!-- y labels (right side) -->
		{#each yTicks as t}
			{@const ty = sy(t)}
			{#if ty >= P.t + 8 && ty <= P.t + cH - 8}
				<!-- skip if too close to current price label -->
				{#if Math.abs(ty - sy(current)) > 14}
					<text x={P.l + cW + 6} y={ty} dominant-baseline="middle"
						font-size="10" fill="var(--muted-foreground)" font-family="monospace">{fmt(t)}</text>
				{/if}
			{/if}
		{/each}

		<!-- current price label box -->
		{#if sy(current) >= P.t && sy(current) <= P.t + cH}
			{@const ly = sy(current)}
			<rect x={P.l + cW + 4} y={ly - 9} width={P.r - 6} height={18} rx="3" fill={color} />
			<text x={P.l + cW + P.r / 2 + 1} y={ly} text-anchor="middle" dominant-baseline="middle"
				font-size="9.5" fill="white" font-family="monospace" font-weight="700">{fmt(current)}</text>
		{/if}

		<!-- x axis -->
		<line x1={P.l} y1={P.t + cH} x2={P.l + cW} y2={P.t + cH}
			stroke="var(--border)" stroke-width="1" />
	</svg>

	<!-- hover tooltip -->
	{#if hoverIdx !== null}
		{@const hx = sx(hoverIdx)}
		{#if hx >= P.l && hx <= P.l + cW}
			{@const flip = tipX > svgW * 0.55}
			<div class="pointer-events-none absolute z-20 rounded-lg bg-card border border-border shadow-lg px-2.5 py-1.5 text-xs tabular-nums"
				style:left="{tipX + (flip ? -8 : 8)}px"
				style:top="{Math.max(P.t, tipY - 18)}px"
				style:transform={flip ? 'translateX(-100%)' : undefined}
			>
				<span class="font-bold text-foreground">{fmt(renderPrices[hoverIdx])}</span>
			</div>
		{/if}
	{/if}
{/if}
</div>

<style>
	@keyframes ping {
		75%, 100% { transform: scale(2.5); opacity: 0; }
	}
	.animate-ping {
		animation: ping 1.6s cubic-bezier(0, 0, 0.2, 1) infinite;
	}
</style>
