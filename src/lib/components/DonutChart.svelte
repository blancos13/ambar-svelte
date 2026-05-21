<script lang="ts">
	export type DonutSlice = {
		label:  string;
		value:  number;
		color?: string;
	};

	type Props = {
		slices:       DonutSlice[];
		size?:        number;
		thickness?:   number;
		centerLabel?: string;
		centerValue?: string;
		class?:       string;
	};

	let {
		slices,
		size       = 220,
		thickness  = 44,
		centerLabel,
		centerValue,
		class: cls = '',
	}: Props = $props();

	const COLORS = ['var(--accent)', '#60a5fa', '#34d399', '#f472b6', '#fb923c', '#a78bfa'];

	function fmt(v: number) {
		const a = Math.abs(v);
		if (a >= 1e6) return `${+(v / 1e6).toFixed(1)}M`;
		if (a >= 1e3) return `${+(v / 1e3).toFixed(1)}K`;
		return Number.isInteger(v) ? String(v) : v.toFixed(1);
	}

	const cx   = $derived(size / 2);
	const cy   = $derived(size / 2);
	const r    = $derived((size - thickness) / 2);
	const circ = $derived(2 * Math.PI * r);

	const total = $derived(slices.reduce((s, x) => s + x.value, 0));

	type ComputedSlice = {
		color:      string;
		label:      string;
		value:      number;
		pct:        number;
		dashArr:    string;
		dashOffset: number;
		startDeg:   number;
		endDeg:     number;
	};

	const computed = $derived.by<ComputedSlice[]>(() => {
		let cumDeg = 0;
		return slices.map((sl, i) => {
			const pct    = total > 0 ? sl.value / total : 0;
			const arc    = pct * circ;
			const gap    = slices.length > 1 ? Math.min(4, arc * 0.08) : 0;
			const arcAdj = Math.max(0, arc - gap);
			const color  = sl.color ?? COLORS[i % COLORS.length];
			const start  = cumDeg;
			cumDeg += pct * 360;
			// positive dashoffset shifts segment CCW; +circ/4 moves 3-o'clock → 12-o'clock
			const dashOffset = circ / 4 - (start / 360) * circ;
			return { color, label: sl.label, value: sl.value, pct,
				dashArr: `${arcAdj} ${circ - arcAdj}`,
				dashOffset, startDeg: start, endDeg: cumDeg };
		});
	});

	/* ── animation ── */
	let animated = $state(false);
	$effect(() => {
		void slices; void circ;
		animated = false;
		requestAnimationFrame(() => requestAnimationFrame(() => { animated = true; }));
	});

	/* ── hover — angle-based, single handler on SVG ── */
	let hoverIdx = $state<number | null>(null);

	function onSvgMove(e: MouseEvent) {
		const el   = e.currentTarget as SVGSVGElement;
		const rect = el.getBoundingClientRect();
		const dx   = e.clientX - rect.left - cx;
		const dy   = e.clientY - rect.top  - cy;
		const dist = Math.sqrt(dx * dx + dy * dy);

		if (dist < r - thickness / 2 - 4 || dist > r + thickness / 2 + 4) {
			hoverIdx = null;
			return;
		}

		const angle = ((Math.atan2(dx, -dy) * 180 / Math.PI) + 360) % 360;

		for (let i = 0; i < computed.length; i++) {
			if (angle >= computed[i].startDeg && angle < computed[i].endDeg) {
				hoverIdx = i; return;
			}
		}
		hoverIdx = computed.length - 1;
	}
</script>

<div class="inline-flex flex-col items-center gap-4 {cls}">
	<div class="relative" style:width="{size}px" style:height="{size}px">
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<svg
			width={size} height={size}
			class="block"
			onmousemove={onSvgMove}
			onmouseleave={() => (hoverIdx = null)}
		>
			<!-- track -->
			<circle cx={cx} cy={cy} r={r} fill="none"
				stroke="var(--muted)" stroke-width={thickness} />

			<!-- slices -->
			{#each computed as sl, i}
				<circle
					cx={cx} cy={cy} r={r}
					fill="none"
					stroke={sl.color}
					stroke-width={thickness}
					stroke-dasharray={animated ? sl.dashArr : `0 ${circ}`}
					stroke-dashoffset={sl.dashOffset}
					opacity={hoverIdx !== null && hoverIdx !== i ? 0.3 : 1}
					style="pointer-events:none;
						transition: stroke-dasharray 0.7s cubic-bezier(.16,1,.3,1) {i * 70}ms,
						opacity 0.15s ease"
				/>
			{/each}
		</svg>

		<!-- center label -->
		<div class="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
			{#if hoverIdx !== null}
				{@const sl = computed[hoverIdx]}
				<span class="text-xl font-bold text-foreground leading-none">{fmt(sl.value)}</span>
				<span class="mt-1 text-xs text-muted-foreground max-w-[70%] leading-tight">{sl.label}</span>
				<span class="mt-0.5 text-xs font-semibold" style:color={sl.color}>{(sl.pct * 100).toFixed(1)}%</span>
			{:else if centerValue}
				<span class="text-2xl font-bold text-foreground leading-none">{centerValue}</span>
				{#if centerLabel}
					<span class="mt-1 text-xs text-muted-foreground">{centerLabel}</span>
				{/if}
			{:else if centerLabel}
				<span class="text-sm font-medium text-muted-foreground">{centerLabel}</span>
			{/if}
		</div>
	</div>

	<!-- legend -->
	<div class="flex flex-wrap gap-x-5 gap-y-2 justify-center">
		{#each computed as sl, i}
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div
				class="flex items-center gap-1.5 text-xs cursor-default transition-opacity duration-150"
				style:opacity={hoverIdx !== null && hoverIdx !== i ? '0.35' : '1'}
				onmouseenter={() => (hoverIdx = i)}
				onmouseleave={() => (hoverIdx = null)}
			>
				<span class="size-2.5 rounded-full shrink-0" style:background={sl.color}></span>
				<span class="text-muted-foreground">{sl.label}</span>
				<span class="font-semibold text-foreground">{fmt(sl.value)}</span>
			</div>
		{/each}
	</div>
</div>
