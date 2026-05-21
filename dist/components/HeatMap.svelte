<script lang="ts">
	import { onMount } from 'svelte';

	type Props = {
		data?:     Record<string, number>;  // 'YYYY-MM-DD' → value
		label?:    string;                  // unit in tooltip e.g. '$'
		color?:    string;                  // explicit hex only, e.g. '#60a5fa'
		cellSize?: number;
		gap?:      number;
		class?:    string;
	};

	let {
		data     = {},
		label    = '',
		color    = '#60a5fa',
		cellSize = 12,
		gap      = 3,
		class: cls = '',
	}: Props = $props();

	const WEEKS = 53;
	const step  = $derived(cellSize + gap);

	/* ── 53-week grid (Sun=row 0 … Sat=row 6) ── */
	type Cell = { date: Date; key: string };

	const weeks = $derived.by((): Cell[][] => {
		const today = new Date();
		const sun   = new Date(today);
		sun.setDate(today.getDate() - today.getDay());      // this Sunday
		const start = new Date(sun);
		start.setDate(sun.getDate() - 52 * 7);              // 52 weeks back

		const grid: Cell[][] = [];
		const cur = new Date(start);
		for (let w = 0; w < WEEKS; w++) {
			const week: Cell[] = [];
			for (let d = 0; d < 7; d++) {
				const date = new Date(cur);
				const key  = `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
				week.push({ date, key });
				cur.setDate(cur.getDate() + 1);
			}
			grid.push(week);
		}
		return grid;
	});

	/* ── month labels ── */
	const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
	const monthLabels = $derived.by(() => {
		const out: { text: string; wi: number }[] = [];
		let last = -1;
		weeks.forEach((week, wi) => {
			const m = week[0].date.getMonth();
			if (m !== last) { out.push({ text: MONTHS[m], wi }); last = m; }
		});
		return out;
	});

	/* ── value → opacity (0.07 empty, 0.25–1.0 for data) ── */
	const allVals = $derived(Object.values(data).filter(v => isFinite(v) && v > 0));
	const dMax    = $derived(allVals.length ? Math.max(...allVals) : 1);

	function cellOpacity(key: string): number {
		const val = data[key];
		if (!val || val <= 0) return 0.07;            // clearly empty
		const t = Math.min(1, val / dMax);
		return 0.25 + t * 0.75;                       // 0.25 → 1.0
	}

	/* ── mount animation ── */
	let mounted = $state(false);
	onMount(() => requestAnimationFrame(() => { mounted = true; }));

	/* ── layout ── */
	const DAY_LABEL_W = 30;
	const MONTH_H     = 20;
	const DAY_LABELS: Record<number, string> = { 1:'Mon', 3:'Wed', 5:'Fri' };
	const svgW = $derived(DAY_LABEL_W + WEEKS * step);
	const svgH = $derived(MONTH_H + 7 * step);

	/* ── hover ── */
	let hoverKey  = $state<string | null>(null);
	let hoverCell = $state<Cell | null>(null);
	let tipX = $state(0), tipY = $state(0);
	let wrapEl: HTMLDivElement | undefined = $state();

	function onEnter(cell: Cell, e: MouseEvent) {
		hoverKey = cell.key; hoverCell = cell; updateTip(e);
	}
	function onMove(e: MouseEvent) { updateTip(e); }
	function onLeave() { hoverKey = null; hoverCell = null; }
	function updateTip(e: MouseEvent) {
		if (!wrapEl) return;
		const r = wrapEl.getBoundingClientRect();
		tipX = e.clientX - r.left; tipY = e.clientY - r.top;
	}

	function fmt(v: number) {
		if (v >= 1e6) return `${+(v/1e6).toFixed(1)}M`;
		if (v >= 1e3) return `${+(v/1e3).toFixed(1)}K`;
		return Number.isInteger(v) ? String(v) : v.toFixed(1);
	}
	function fmtDate(d: Date) {
		return d.toLocaleDateString('en', { weekday:'short', month:'short', day:'numeric', year:'numeric' });
	}

	/* ── legend ── */
	const legendSteps = [0, 0.3, 0.55, 0.75, 1];
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div bind:this={wrapEl} class="relative inline-block select-none {cls}" onmouseleave={onLeave}>
	<svg width={svgW} height={svgH} class="overflow-visible block">

		<!-- month labels -->
		{#each monthLabels as { text, wi }}
			<text
				x={DAY_LABEL_W + wi * step}
				y={MONTH_H - 6}
				font-size="11"
				fill="currentColor"
				opacity="0.5"
			>{text}</text>
		{/each}

		<!-- day labels -->
		{#each Object.entries(DAY_LABELS) as [di, name]}
			<text
				x={DAY_LABEL_W - 6}
				y={MONTH_H + (+di) * step + cellSize / 2 + 3.5}
				text-anchor="end"
				font-size="10"
				fill="currentColor"
				opacity="0.45"
			>{name}</text>
		{/each}

		<!-- cells -->
		{#each weeks as week, wi}
			{#each week as cell, di}
				{@const today    = new Date()}
				{@const isFuture = cell.date > today}
				{@const op       = isFuture ? 0 : cellOpacity(cell.key)}
				{@const isHov    = hoverKey === cell.key}
				<rect
					x={DAY_LABEL_W + wi * step}
					y={MONTH_H + di * step}
					width={cellSize}
					height={cellSize}
					rx={Math.round(cellSize * 0.25)}
					fill={color}
					opacity={mounted ? (isHov ? Math.min(1, op + 0.15) : op) : 0}
					stroke={isHov && op > 0.1 ? color : 'none'}
					stroke-width={isHov ? 1.5 : 0}
					stroke-opacity="0.6"
					style:transition="opacity 0.3s ease {wi * 16}ms"
					style:cursor="default"
					onmouseenter={(e) => onEnter(cell, e)}
					onmousemove={onMove}
				/>
			{/each}
		{/each}

	</svg>

	<!-- legend -->
	<div class="mt-2 flex items-center justify-end gap-1.5 text-[10px] text-muted-foreground opacity-55 select-none">
		<span>Less</span>
		{#each legendSteps as t}
			<span
				class="inline-block rounded-sm"
				style:width="{cellSize}px"
				style:height="{cellSize}px"
				style:background={color}
				style:opacity={t === 0 ? 0.07 : 0.25 + t * 0.75}
			></span>
		{/each}
		<span>More</span>
	</div>

	<!-- tooltip -->
	{#if hoverCell !== null}
		{@const val  = data[hoverCell.key]}
		{@const flip = tipX > svgW * 0.6}
		<div
			class="pointer-events-none absolute z-10 rounded-xl bg-card border border-border shadow-xl px-3 py-2 text-xs whitespace-nowrap"
			style:left="{tipX + (flip ? -12 : 12)}px"
			style:top="{Math.max(4, tipY - 48)}px"
			style:transform={flip ? 'translateX(-100%)' : undefined}
		>
			<p class="font-semibold text-foreground">{fmtDate(hoverCell.date)}</p>
			{#if val !== undefined && val > 0}
				<p class="mt-0.5 text-muted-foreground">{label}{fmt(val)}</p>
			{:else}
				<p class="mt-0.5 italic text-muted-foreground">No activity</p>
			{/if}
		</div>
	{/if}
</div>
