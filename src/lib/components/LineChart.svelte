<script lang="ts">
	export type LineSeries = {
		label:  string;
		data:   number[];
		color?: string;
		area?:  boolean;
	};

	type Props = {
		labels:  string[];
		series:  LineSeries[];
		height?: number;
		smooth?: boolean;
		grid?:   boolean;
		class?:  string;
	};

	let {
		labels,
		series,
		height = 260,
		smooth = true,
		grid   = true,
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
		if (a >= 1e6) return `${+(v / 1e6).toFixed(1)}M`;
		if (a >= 1e3) return `${+(v / 1e3).toFixed(1)}K`;
		return Number.isInteger(v) ? String(v) : v.toFixed(1);
	}

	const allVals = $derived(series.flatMap(s => s.data).filter(isFinite));
	const yTicks  = $derived(allVals.length ? niceRange(Math.min(...allVals), Math.max(...allVals)) : [0, 50, 100]);
	const yMin    = $derived(yTicks[0]);
	const yMax    = $derived(yTicks[yTicks.length - 1]);

	function sx(i: number) {
		if (labels.length <= 1) return P.l + cW / 2;
		return P.l + (i / (labels.length - 1)) * cW;
	}
	function sy(v: number) {
		if (yMax === yMin) return P.t + cH / 2;
		return P.t + cH - ((v - yMin) / (yMax - yMin)) * cH;
	}

	function makePath(data: number[], area = false): string {
		const pts: [number, number][] = data.map((v, i) => [sx(i), sy(v)]);
		if (pts.length < 2) return '';
		let d = `M ${pts[0][0]} ${pts[0][1]}`;
		if (smooth) {
			for (let i = 1; i < pts.length; i++) {
				const [x0, y0] = pts[i - 1], [x1, y1] = pts[i];
				const cx = (x0 + x1) / 2;
				d += ` C ${cx} ${y0} ${cx} ${y1} ${x1} ${y1}`;
			}
		} else {
			pts.slice(1).forEach(([x, y]) => { d += ` L ${x} ${y}`; });
		}
		if (area) d += ` L ${pts.at(-1)![0]} ${P.t + cH} L ${pts[0][0]} ${P.t + cH} Z`;
		return d;
	}

	/* ── draw animation ── */
	let lineEls: (SVGPathElement | null)[]  = $state([]);
	let lengths  = $state<number[]>([]);
	let animated = $state(false);

	$effect(() => {
		void svgW; void series; void labels;
		lengths  = lineEls.map(el => el?.getTotalLength() ?? 0);
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
		if (mx < -12 || mx > cW + 12) { hoverIdx = null; return; }
		const step = labels.length <= 1 ? 0 : cW / (labels.length - 1);
		hoverIdx = step ? Math.max(0, Math.min(labels.length - 1, Math.round(mx / step))) : 0;
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
		<defs>
			{#each series as s, i}
				{#if s.area}
					{@const c = s.color ?? COLORS[i % COLORS.length]}
					<linearGradient id="lg-{i}" x1="0" y1="0" x2="0" y2="1">
						<stop offset="0%"   stop-color={c} stop-opacity=".2" />
						<stop offset="100%" stop-color={c} stop-opacity="0" />
					</linearGradient>
				{/if}
			{/each}
		</defs>

		<!-- grid -->
		{#if grid}
			{#each yTicks as t}
				<line x1={P.l} y1={sy(t)} x2={svgW - P.r} y2={sy(t)}
					stroke="var(--border)" stroke-width="1" />
			{/each}
		{/if}

		<!-- areas -->
		{#each series as s, i}
			{#if s.area}
				<path d={makePath(s.data, true)} fill="url(#lg-{i})" stroke="none" />
			{/if}
		{/each}

		<!-- lines -->
		{#each series as s, i}
			{@const c   = s.color ?? COLORS[i % COLORS.length]}
			{@const len = lengths[i] ?? 0}
			<path
				bind:this={lineEls[i]}
				d={makePath(s.data)}
				fill="none" stroke={c}
				stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"
				stroke-dasharray={len > 0 ? len : undefined}
				stroke-dashoffset={len > 0 ? (animated ? 0 : len) : undefined}
				style="transition:stroke-dashoffset 1.2s cubic-bezier(.16,1,.3,1) {i * 100}ms"
			/>
		{/each}

		<!-- hover -->
		{#if hoverIdx !== null}
			<line
				x1={sx(hoverIdx)} y1={P.t}
				x2={sx(hoverIdx)} y2={P.t + cH}
				stroke="var(--border)" stroke-width="1.5" stroke-dasharray="4 3"
			/>
			{#each series as s, i}
				{@const c = s.color ?? COLORS[i % COLORS.length]}
				<circle cx={sx(hoverIdx)} cy={sy(s.data[hoverIdx] ?? 0)}
					r="4.5" fill={c} stroke="var(--card)" stroke-width="2.5" />
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
				<text x={sx(i)} y={P.t + cH + 20} text-anchor="middle"
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
			{#each series as s, i}
				{@const c = s.color ?? COLORS[i % COLORS.length]}
				<div class="flex items-center gap-2 text-muted-foreground">
					<span class="size-2 rounded-full shrink-0" style:background={c}></span>
					<span class="flex-1">{s.label}</span>
					<span class="font-semibold text-foreground ml-3">{fmt(s.data[hoverIdx] ?? 0)}</span>
				</div>
			{/each}
		</div>
	{/if}

	<!-- legend -->
	{#if series.length > 1}
		<div class="mt-3 flex flex-wrap gap-4 justify-center">
			{#each series as s, i}
				{@const c = s.color ?? COLORS[i % COLORS.length]}
				<div class="flex items-center gap-1.5 text-xs text-muted-foreground">
					<span class="inline-block h-0.5 w-4 rounded-full shrink-0" style:background={c}></span>
					{s.label}
				</div>
			{/each}
		</div>
	{/if}
{/if}
</div>
