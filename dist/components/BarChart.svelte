<script lang="ts">
	export type BarSeries = {
		label:  string;
		data:   number[];
		color?: string;
	};

	type Props = {
		labels:   string[];
		series:   BarSeries[];
		height?:  number;
		grid?:    boolean;
		stacked?: boolean;
		class?:   string;
	};

	let {
		labels,
		series,
		height  = 260,
		grid    = true,
		stacked = false,
		class: cls = '',
	}: Props = $props();

	const COLORS = ['var(--accent)', '#60a5fa', '#34d399', '#f472b6', '#fb923c', '#a78bfa'];
	const P = { t: 16, r: 16, b: 40, l: 48 };

	let wrapEl: HTMLDivElement | undefined = $state();
	let svgW = $state(0);

	$effect(() => {
		if (!wrapEl) return;
		svgW = wrapEl.clientWidth;
		const ro = new ResizeObserver(() => { svgW = wrapEl!.clientWidth; });
		ro.observe(wrapEl);
		return () => ro.disconnect();
	});

	const cW = $derived(Math.max(0, svgW - P.l - P.r));
	const cH = $derived(Math.max(0, height - P.t - P.b));

	/* ── y scale ── */
	function niceRange(lo: number, hi: number) {
		if (lo === hi) { lo = 0; hi = hi || 1; }
		lo = Math.min(0, lo);
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
		if (a >= 1e6) return `${+(v / 1e6).toFixed(1)}M`;
		if (a >= 1e3) return `${+(v / 1e3).toFixed(1)}K`;
		return Number.isInteger(v) ? String(v) : v.toFixed(1);
	}

	const stackedMaxes = $derived(
		stacked
			? labels.map((_, gi) => series.reduce((s, sr) => s + (sr.data[gi] ?? 0), 0))
			: []
	);

	const allVals = $derived(
		stacked
			? stackedMaxes
			: series.flatMap(s => s.data).filter(isFinite)
	);
	const yTicks = $derived(allVals.length ? niceRange(0, Math.max(...allVals)) : [0, 50, 100]);
	const yMin   = $derived(yTicks[0]);
	const yMax   = $derived(yTicks[yTicks.length - 1]);

	function sy(v: number) {
		if (yMax === yMin) return P.t + cH / 2;
		return P.t + cH - ((v - yMin) / (yMax - yMin)) * cH;
	}

	/* ── bar geometry ── */
	const groupW   = $derived(labels.length ? cW / labels.length : 0);
	const barCount = $derived(stacked ? 1 : series.length);
	const barPad   = $derived(Math.max(4, groupW * 0.12));
	const barW     = $derived(Math.max(2, (groupW - barPad * 2) / barCount - (stacked ? 0 : 2)));

	function barX(groupIdx: number, barIdx: number) {
		const groupLeft = P.l + groupIdx * groupW + barPad;
		if (stacked) return groupLeft + (groupW - barPad * 2 - barW) / 2;
		return groupLeft + barIdx * (barW + 2);
	}

	/* ── animation ── */
	let animated = $state(false);
	$effect(() => {
		void svgW; void series; void labels;
		animated = false;
		requestAnimationFrame(() => requestAnimationFrame(() => { animated = true; }));
	});

	/* ── hover ── */
	let hoverIdx = $state<number | null>(null);
	let tip = $state({ x: 0, y: 0 });

	function onMove(e: MouseEvent) {
		if (!wrapEl || !svgW) return;
		const r = wrapEl.getBoundingClientRect();
		const mx = e.clientX - r.left - P.l;
		if (mx < 0 || mx > cW) { hoverIdx = null; return; }
		hoverIdx = Math.min(labels.length - 1, Math.floor(mx / groupW));
		tip = { x: e.clientX - r.left, y: e.clientY - r.top };
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

		<!-- grid -->
		{#if grid}
			{#each yTicks as t}
				<line x1={P.l} y1={sy(t)} x2={svgW - P.r} y2={sy(t)}
					stroke="var(--border)" stroke-width="1" />
			{/each}
		{/if}

		<!-- hover bg -->
		{#if hoverIdx !== null}
			<rect
				x={P.l + hoverIdx * groupW} y={P.t}
				width={groupW} height={cH}
				fill="var(--muted)" opacity="0.5" rx="4"
			/>
		{/if}

		<!-- bars -->
		{#if stacked}
			{#each labels as _lbl, gi}
				{@const totalH = stackedMaxes[gi] ?? 0}
				{@const bx = barX(gi, 0)}
				{@const totalPx = ((totalH - yMin) / (yMax - yMin)) * cH}
				{@const animH = animated ? totalPx : 0}
				{@const animY = P.t + cH - animH}

				{#each series as s, si}
					{@const val = s.data[gi] ?? 0}
					{@const c   = s.color ?? COLORS[si % COLORS.length]}
					{@const segH = ((val - yMin) / (yMax - yMin)) * cH}
					{@const prevH = series.slice(0, si).reduce((acc, sr) => acc + ((sr.data[gi] ?? 0) / (yMax - yMin)) * cH, 0)}
					{@const realY = P.t + cH - prevH - segH}
					{@const dispH = animated ? segH : 0}
					{@const dispY = animated ? realY : P.t + cH}
					<rect
						x={bx} y={dispY}
						width={barW} height={Math.max(0, dispH)}
						fill={c} rx={si === series.length - 1 ? 4 : 0}
						style="transition: y 0.7s cubic-bezier(.16,1,.3,1) {gi * 30}ms, height 0.7s cubic-bezier(.16,1,.3,1) {gi * 30}ms"
					/>
				{/each}
			{/each}
		{:else}
			{#each series as s, si}
				{@const c = s.color ?? COLORS[si % COLORS.length]}
				{#each labels as _lbl, gi}
					{@const val  = s.data[gi] ?? 0}
					{@const bx   = barX(gi, si)}
					{@const fullH = Math.max(0, ((val - yMin) / (yMax - yMin)) * cH)}
					{@const dispH = animated ? fullH : 0}
					{@const dispY = animated ? sy(val) : P.t + cH}
					<rect
						x={bx} y={dispY}
						width={barW} height={dispH}
						fill={c} rx={Math.min(4, barW / 2)}
						style="transition: y 0.65s cubic-bezier(.16,1,.3,1) {(gi * series.length + si) * 20}ms, height 0.65s cubic-bezier(.16,1,.3,1) {(gi * series.length + si) * 20}ms"
					/>
				{/each}
			{/each}
		{/if}

		<!-- y labels -->
		{#each yTicks as t}
			<text x={P.l - 8} y={sy(t)} text-anchor="end" dominant-baseline="middle"
				font-size="11" fill="var(--muted-foreground)">{fmt(t)}</text>
		{/each}

		<!-- x labels -->
		{#each labels as lbl, i}
			{@const skip = Math.max(1, Math.ceil(labels.length / Math.max(1, Math.floor(cW / 52))))}
			{#if i % skip === 0 || i === labels.length - 1}
				<text x={P.l + i * groupW + groupW / 2} y={P.t + cH + 20} text-anchor="middle"
					font-size="11" fill="var(--muted-foreground)">{lbl}</text>
			{/if}
		{/each}

		<!-- x axis -->
		<line x1={P.l} y1={P.t + cH} x2={svgW - P.r} y2={P.t + cH}
			stroke="var(--border)" stroke-width="1" />
	</svg>

	<!-- tooltip -->
	{#if hoverIdx !== null}
		{@const flip = tip.x > svgW * 0.6}
		<div class="pointer-events-none absolute z-10 rounded-xl bg-card border border-border shadow-xl px-3 py-2 text-xs whitespace-nowrap"
			style:left="{tip.x + (flip ? -12 : 12)}px"
			style:top="{Math.max(8, tip.y - 16)}px"
			style:transform={flip ? 'translateX(-100%)' : undefined}
		>
			<p class="font-semibold text-foreground mb-1.5">{labels[hoverIdx]}</p>
			{#if stacked}
				{@const total = stackedMaxes[hoverIdx] ?? 0}
				{#each series as s, i}
					{@const c = s.color ?? COLORS[i % COLORS.length]}
					<div class="flex items-center gap-2 text-muted-foreground">
						<span class="size-2 rounded-sm shrink-0" style:background={c}></span>
						<span class="flex-1">{s.label}</span>
						<span class="font-semibold text-foreground ml-3">{fmt(s.data[hoverIdx] ?? 0)}</span>
					</div>
				{/each}
				<div class="mt-1.5 pt-1.5 border-t border-border flex items-center gap-2 text-muted-foreground">
					<span class="size-2 shrink-0"></span>
					<span class="flex-1">Total</span>
					<span class="font-semibold text-foreground ml-3">{fmt(total)}</span>
				</div>
			{:else}
				{#each series as s, i}
					{@const c = s.color ?? COLORS[i % COLORS.length]}
					<div class="flex items-center gap-2 text-muted-foreground">
						<span class="size-2 rounded-sm shrink-0" style:background={c}></span>
						<span class="flex-1">{s.label}</span>
						<span class="font-semibold text-foreground ml-3">{fmt(s.data[hoverIdx] ?? 0)}</span>
					</div>
				{/each}
			{/if}
		</div>
	{/if}

	<!-- legend -->
	{#if series.length > 1}
		<div class="mt-3 flex flex-wrap gap-4 justify-center">
			{#each series as s, i}
				{@const c = s.color ?? COLORS[i % COLORS.length]}
				<div class="flex items-center gap-1.5 text-xs text-muted-foreground">
					<span class="inline-block size-2.5 rounded-sm shrink-0" style:background={c}></span>
					{s.label}
				</div>
			{/each}
		</div>
	{/if}
{/if}
</div>
