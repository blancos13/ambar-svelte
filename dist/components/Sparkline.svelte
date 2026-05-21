<script lang="ts">
	type Props = {
		data:     number[];
		width?:   number;
		height?:  number;
		color?:   string;
		area?:    boolean;
		value?:   boolean;   // show current value badge
		minmax?:  boolean;   // show min/max dots
		class?:   string;
	};

	let {
		data,
		width   = 80,
		height  = 32,
		color,
		area    = true,
		value   = false,
		minmax  = false,
		class: cls = '',
	}: Props = $props();

	const P = 2; // padding all sides

	const vals    = $derived(data.filter(isFinite));
	const yMin    = $derived(vals.length ? Math.min(...vals) : 0);
	const yMax    = $derived(vals.length ? Math.max(...vals) : 1);
	const current = $derived(vals[vals.length - 1] ?? 0);
	const first   = $derived(vals[0] ?? 0);
	const bull    = $derived(current >= first);

	const resolvedColor = $derived(color ?? (bull ? '#34d399' : '#f87171'));

	const cW = $derived(width  - P * 2);
	const cH = $derived(height - P * 2);

	function sx(i: number) {
		if (vals.length <= 1) return P + cW / 2;
		return P + (i / (vals.length - 1)) * cW;
	}
	function sy(v: number) {
		if (yMax === yMin) return P + cH / 2;
		return P + cH - ((v - yMin) / (yMax - yMin)) * cH;
	}

	function makePath(): string {
		if (vals.length < 2) return '';
		let d = `M ${sx(0)} ${sy(vals[0])}`;
		for (let i = 1; i < vals.length; i++) {
			const x0 = sx(i - 1), y0 = sy(vals[i - 1]);
			const x1 = sx(i),     y1 = sy(vals[i]);
			const cpx = (x0 + x1) / 2;
			d += ` C ${cpx} ${y0} ${cpx} ${y1} ${x1} ${y1}`;
		}
		return d;
	}

	function makeArea(): string {
		const path = makePath();
		if (!path) return '';
		return `${path} L ${sx(vals.length - 1)} ${P + cH} L ${sx(0)} ${P + cH} Z`;
	}

	const minIdx = $derived(vals.indexOf(yMin));
	const maxIdx = $derived(vals.indexOf(yMax));

	/* ── hover ── */
	let hoverIdx = $state<number | null>(null);
	let tipX     = $state(0);

	function onMove(e: MouseEvent) {
		const el   = e.currentTarget as SVGSVGElement;
		const rect = el.getBoundingClientRect();
		const mx   = e.clientX - rect.left - P;
		if (mx < 0 || mx > cW || vals.length < 2) { hoverIdx = null; return; }
		hoverIdx = Math.max(0, Math.min(vals.length - 1, Math.round((mx / cW) * (vals.length - 1))));
		tipX = e.clientX - rect.left;
	}

	const gradId = `sp-${Math.random().toString(36).slice(2, 7)}`;
</script>

<div class="relative inline-flex items-center gap-1.5 {cls}">
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<svg
		{width} {height}
		class="block shrink-0 overflow-visible"
		onmousemove={onMove}
		onmouseleave={() => (hoverIdx = null)}
	>
		<defs>
			<linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
				<stop offset="0%"   stop-color={resolvedColor} stop-opacity="0.25" />
				<stop offset="100%" stop-color={resolvedColor} stop-opacity="0" />
			</linearGradient>
		</defs>

		{#if area}
			<path d={makeArea()} fill="url(#{gradId})" stroke="none" />
		{/if}
		<path d={makePath()} fill="none" stroke={resolvedColor} stroke-width="1.5"
			stroke-linecap="round" stroke-linejoin="round" />

		<!-- min / max dots -->
		{#if minmax && vals.length > 1}
			<circle cx={sx(minIdx)} cy={sy(yMin)} r="2.5" fill="#f87171" />
			<circle cx={sx(maxIdx)} cy={sy(yMax)} r="2.5" fill="#34d399" />
		{/if}

		<!-- current dot -->
		<circle cx={sx(vals.length - 1)} cy={sy(current)} r="2.5"
			fill={resolvedColor} stroke="white" stroke-width="1.5" />

		<!-- hover crosshair -->
		{#if hoverIdx !== null}
			<line x1={sx(hoverIdx)} y1={P} x2={sx(hoverIdx)} y2={P + cH}
				stroke={resolvedColor} stroke-width="1" opacity="0.4" />
			<circle cx={sx(hoverIdx)} cy={sy(vals[hoverIdx])} r="3"
				fill={resolvedColor} stroke="white" stroke-width="1.5" />
		{/if}
	</svg>

	<!-- value badge -->
	{#if value}
		<span class="text-xs font-semibold tabular-nums leading-none" style:color={resolvedColor}>
			{current % 1 === 0 ? current : current.toFixed(2)}
		</span>
	{/if}

	<!-- hover tooltip (tiny) -->
	{#if hoverIdx !== null}
		<div class="pointer-events-none absolute bottom-full mb-1 z-10 rounded-md bg-card border border-border shadow-lg px-1.5 py-0.5 text-[10px] font-semibold tabular-nums text-foreground whitespace-nowrap"
			style:left="{Math.min(tipX, width - 32)}px"
			style:transform="translateX(-50%)"
		>
			{vals[hoverIdx] % 1 === 0 ? vals[hoverIdx] : vals[hoverIdx].toFixed(2)}
		</div>
	{/if}
</div>
