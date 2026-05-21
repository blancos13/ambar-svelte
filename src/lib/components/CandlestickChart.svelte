<script lang="ts">
	export type Candle = {
		date:    string;
		open:    number;
		high:    number;
		low:     number;
		close:   number;
		volume?: number;
	};

	type Props = {
		candles:  Candle[];
		height?:  number;
		volume?:  boolean;
		grid?:    boolean;
		class?:   string;
	};

	let {
		candles,
		height  = 320,
		volume  = true,
		grid    = true,
		class: cls = '',
	}: Props = $props();

	const BULL = '#34d399';
	const BEAR = '#f87171';
	const P    = { t: 16, r: 16, b: 40, l: 56 };
	const VOL_RATIO = 0.22; // volume panel takes this fraction of chart height

	let wrapEl: HTMLDivElement | undefined = $state();
	let svgW = $state(0);

	$effect(() => {
		if (!wrapEl) return;
		svgW = wrapEl.clientWidth;
		const ro = new ResizeObserver(() => { svgW = wrapEl!.clientWidth; });
		ro.observe(wrapEl);
		return () => ro.disconnect();
	});

	const priceH  = $derived(volume
		? Math.max(0, height - P.t - P.b) * (1 - VOL_RATIO) - 8
		: Math.max(0, height - P.t - P.b));
	const volH    = $derived(volume ? Math.max(0, height - P.t - P.b) * VOL_RATIO - 8 : 0);
	const volTopY = $derived(P.t + priceH + 16);
	const cW      = $derived(Math.max(0, svgW - P.l - P.r));

	/* ── nice range ── */
	function niceRange(lo: number, hi: number) {
		if (lo === hi) { lo -= 1; hi += 1; }
		const mag  = Math.pow(10, Math.floor(Math.log10((hi - lo) / 4)));
		const norm = (hi - lo) / mag / 4;
		const step = norm < 1.5 ? mag : norm < 3 ? 2 * mag : norm < 7 ? 5 * mag : 10 * mag;
		const lo2  = Math.floor(lo / step) * step;
		const hi2  = Math.ceil(hi  / step) * step;
		const out: number[] = [];
		for (let v = lo2; v <= hi2 + step * 0.01; v = Math.round((v + step) * 1e9) / 1e9) out.push(v);
		return out;
	}

	function fmt(v: number) {
		const a = Math.abs(v);
		if (a >= 1e6) return `${+(v / 1e6).toFixed(2)}M`;
		if (a >= 1e3) return `${+(v / 1e3).toFixed(2)}K`;
		return v % 1 === 0 ? String(v) : v.toFixed(2);
	}

	function fmtVol(v: number) {
		if (v >= 1e6) return `${+(v / 1e6).toFixed(1)}M`;
		if (v >= 1e3) return `${+(v / 1e3).toFixed(1)}K`;
		return String(v);
	}

	const prices  = $derived(candles.flatMap(c => [c.high, c.low]));
	const yTicks  = $derived(prices.length ? niceRange(Math.min(...prices), Math.max(...prices)) : [0, 50, 100]);
	const yMin    = $derived(yTicks[0]);
	const yMax    = $derived(yTicks[yTicks.length - 1]);

	const maxVol = $derived(candles.length ? Math.max(...candles.map(c => c.volume ?? 0)) : 1);

	/* ── scale helpers ── */
	function sy(v: number) {
		if (yMax === yMin) return P.t + priceH / 2;
		return P.t + priceH - ((v - yMin) / (yMax - yMin)) * priceH;
	}

	const candleW  = $derived(candles.length ? cW / candles.length : 0);
	const bodyW    = $derived(Math.max(2, Math.min(24, candleW * 0.55)));
	const cx2      = (i: number) => P.l + (i + 0.5) * candleW;

	/* ── animation ── */
	let animated = $state(false);
	$effect(() => {
		void svgW; void candles;
		animated = false;
		requestAnimationFrame(() => requestAnimationFrame(() => { animated = true; }));
	});

	/* ── hover ── */
	let hoverIdx = $state<number | null>(null);
	let tip = $state({ x: 0, y: 0 });

	function onMove(e: MouseEvent) {
		if (!wrapEl || !svgW || !candleW) return;
		const rect = wrapEl.getBoundingClientRect();
		const mx = e.clientX - rect.left - P.l;
		if (mx < 0 || mx > cW) { hoverIdx = null; return; }
		hoverIdx = Math.min(candles.length - 1, Math.floor(mx / candleW));
		tip = { x: e.clientX - rect.left, y: e.clientY - rect.top };
	}

</script>

<div
	bind:this={wrapEl}
	class="relative select-none {cls}"
	onmousemove={onMove}
	onmouseleave={() => (hoverIdx = null)}
>
{#if svgW > 0}
	<svg width={svgW} {height} class="block overflow-visible">

		<!-- price grid -->
		{#if grid}
			{#each yTicks as t}
				<line x1={P.l} y1={sy(t)} x2={svgW - P.r} y2={sy(t)}
					stroke="var(--border)" stroke-width="1" />
			{/each}
		{/if}

		<!-- hover column -->
		{#if hoverIdx !== null}
			<rect
				x={P.l + hoverIdx * candleW} y={P.t}
				width={candleW} height={priceH + (volume ? volH + 16 : 0)}
				fill="var(--muted)" opacity="0.45" rx="3"
			/>
		{/if}

		<!-- candles -->
		{#each candles as c, i}
			{@const bull   = c.close >= c.open}
			{@const color  = bull ? BULL : BEAR}
			{@const x      = cx2(i)}
			{@const bodyTop    = sy(Math.max(c.open, c.close))}
			{@const bodyBottom = sy(Math.min(c.open, c.close))}
			{@const rawH       = Math.max(1, bodyBottom - bodyTop)}
			{@const isHov  = hoverIdx === i}

			{@const animBodyTop = animated ? bodyTop    : sy((c.open + c.close) / 2)}
			{@const animBodyH   = animated ? rawH       : 0}
			{@const animHigh    = animated ? sy(c.high) : sy((c.open + c.close) / 2)}
			{@const animLow     = animated ? sy(c.low)  : sy((c.open + c.close) / 2)}
			{@const delay       = `${i * 18}ms`}

			<!-- wick -->
			<line
				x1={x} y1={animHigh} x2={x} y2={animBodyTop}
				stroke={color} stroke-width={isHov ? 2 : 1.5}
				style="transition: y1 0.5s cubic-bezier(.16,1,.3,1) {delay}, y2 0.5s cubic-bezier(.16,1,.3,1) {delay}"
			/>
			<line
				x1={x} y1={animBodyTop + animBodyH} x2={x} y2={animLow}
				stroke={color} stroke-width={isHov ? 2 : 1.5}
				style="transition: y1 0.5s cubic-bezier(.16,1,.3,1) {delay}, y2 0.5s cubic-bezier(.16,1,.3,1) {delay}"
			/>

			<!-- body -->
			<rect
				x={x - bodyW / 2}
				y={animBodyTop}
				width={bodyW}
				height={animBodyH}
				fill={bull ? color : color}
				fill-opacity={bull ? 0.85 : 1}
				stroke={color}
				stroke-width="1"
				rx={Math.min(2, bodyW / 4)}
				style="transition: y 0.5s cubic-bezier(.16,1,.3,1) {delay}, height 0.5s cubic-bezier(.16,1,.3,1) {delay}"
			/>
		{/each}

		<!-- volume bars -->
		{#if volume}
			<!-- volume divider -->
			<line x1={P.l} y1={volTopY - 4} x2={svgW - P.r} y2={volTopY - 4}
				stroke="var(--border)" stroke-width="1" stroke-dasharray="3 3" />

			{#each candles as c, i}
				{@const bull  = c.close >= c.open}
				{@const color = bull ? BULL : BEAR}
				{@const vol   = c.volume ?? 0}
				{@const fullH = maxVol > 0 ? (vol / maxVol) * volH : 0}
				{@const dispH = animated ? fullH : 0}
				{@const dispY = volTopY + volH - dispH}
				{@const delay = `${i * 18 + 80}ms`}
				<rect
					x={cx2(i) - bodyW / 2} y={dispY}
					width={bodyW} height={Math.max(0, dispH)}
					fill={color} fill-opacity="0.5"
					rx={Math.min(2, bodyW / 4)}
					style="transition: y 0.45s cubic-bezier(.16,1,.3,1) {delay}, height 0.45s cubic-bezier(.16,1,.3,1) {delay}"
				/>
			{/each}
		{/if}

		<!-- y labels (price) -->
		{#each yTicks as t}
			<text x={P.l - 8} y={sy(t)} text-anchor="end" dominant-baseline="middle"
				font-size="11" fill="var(--muted-foreground)">{fmt(t)}</text>
		{/each}

		<!-- x labels -->
		{#each candles as c, i}
			{@const skip = Math.max(1, Math.ceil(candles.length / Math.max(1, Math.floor(cW / 56))))}
			{#if i % skip === 0 || i === candles.length - 1}
				<text x={cx2(i)} y={height - 10} text-anchor="middle"
					font-size="11" fill="var(--muted-foreground)">{c.date}</text>
			{/if}
		{/each}

		<!-- x axis -->
		<line x1={P.l} y1={P.t + priceH} x2={svgW - P.r} y2={P.t + priceH}
			stroke="var(--border)" stroke-width="1" />
	</svg>

{/if}
</div>

