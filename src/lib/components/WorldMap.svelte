<script lang="ts">
	import { onMount } from 'svelte';
	import { COUNTRY_NAMES, ALPHA2_TO_NUMERIC } from '$lib/data/worldCountries';

	export type MapData = Record<string, number>;  // ISO alpha-2 → value

	type Props = {
		data?:        MapData;
		mode?:        'pulse' | 'choropleth';
		pulseColor?:  string;
		colorFrom?:   string;
		colorTo?:     string;
		label?:       string;
		height?:      number;
		class?:       string;
	};

	let {
		data       = {},
		mode       = 'pulse',
		pulseColor = '#60a5fa',
		colorFrom  = '#1e3a8a',
		colorTo    = '#60a5fa',
		label,
		height     = 420,
		class: cls = '',
	}: Props = $props();

	/* ── layout ── */
	let wrapEl: HTMLDivElement | undefined = $state();
	let svgW   = $state(0);
	let svgH   = $derived(height);

	$effect(() => {
		if (!wrapEl) return;
		svgW = wrapEl.clientWidth;
		const ro = new ResizeObserver(() => { svgW = wrapEl!.clientWidth; });
		ro.observe(wrapEl);
		return () => ro.disconnect();
	});

	/* ── topojson ── */
	type TopoJSON = {
		arcs:       number[][][];
		transform?: { scale: [number,number]; translate: [number,number] };
		objects:    { countries: { geometries: { id: any; type: string; arcs: any }[] } };
	};

	let topo    = $state<TopoJSON | null>(null);
	let loading = $state(true);
	let error   = $state('');

	onMount(async () => {
		try {
			const res = await fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json');
			topo    = await res.json();
			loading = false;
		} catch {
			error   = 'Failed to load map data';
			loading = false;
		}
	});

	/* ── projection: Mercator ── */
	const TOPO_W = 960, TOPO_H = 500;

	function project(lon: number, lat: number, w: number, h: number): [number, number] {
		const x = ((lon + 180) / 360) * TOPO_W;
		const latClamped = Math.max(-85, Math.min(85, lat));
		const latRad = latClamped * Math.PI / 180;
		const mercN  = Math.log(Math.tan(Math.PI / 4 + latRad / 2));
		const y = TOPO_H / 2 - (TOPO_W / (2 * Math.PI)) * mercN;
		return [x * (w / TOPO_W), y * (h / TOPO_H)];
	}

	/* ── arc decoding → path + centroid ── */
	function decodeRing(
		topo: TopoJSON, arcIndices: number[], w: number, h: number
	): { d: string; cx: number; cy: number } {
		const sc     = topo.transform?.scale     ?? [1, 1];
		const tr     = topo.transform?.translate ?? [0, 0];
		const HALF_W = w / 2;
		const pts: [number, number][] = [];

		for (const arcIdx of arcIndices) {
			const rev = arcIdx < 0;
			const raw = topo.arcs[rev ? ~arcIdx : arcIdx];
			let ax = 0, ay = 0;
			const decoded: [number, number][] = raw.map(([dx, dy]) => {
				ax += dx; ay += dy;
				return project(ax * sc[0] + tr[0], ay * sc[1] + tr[1], w, h);
			});
			pts.push(...(rev ? decoded.reverse() : decoded));
		}

		if (pts.length === 0) return { d: '', cx: 0, cy: 0 };

		let d = `M${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`;
		let sumX = pts[0][0], sumY = pts[0][1], n = 1;
		for (let i = 1; i < pts.length; i++) {
			const [px, py] = pts[i];
			if (Math.abs(px - pts[i - 1][0]) > HALF_W) {
				d += `M${px.toFixed(1)},${py.toFixed(1)}`;
			} else {
				d += `L${px.toFixed(1)},${py.toFixed(1)}`;
				sumX += px; sumY += py; n++;
			}
		}
		return { d: d + 'Z', cx: sumX / n, cy: sumY / n };
	}

	function geomToPathCentroid(
		topo: TopoJSON, geom: { type: string; arcs: any }, w: number, h: number
	): { d: string; cx: number; cy: number } {
		if (geom.type === 'Polygon') {
			const rings = (geom.arcs as number[][]).map(r => decodeRing(topo, r, w, h));
			return { d: rings.map(r => r.d).join(' '), cx: rings[0]?.cx ?? 0, cy: rings[0]?.cy ?? 0 };
		}
		if (geom.type === 'MultiPolygon') {
			const polys  = geom.arcs as number[][][];
			const outers = polys.map(p => decodeRing(topo, p[0], w, h));
			const inner  = polys.flatMap(p => p.map(r => decodeRing(topo, r, w, h)));
			const cx = outers.reduce((s, r) => s + r.cx, 0) / outers.length;
			const cy = outers.reduce((s, r) => s + r.cy, 0) / outers.length;
			return { d: inner.map(r => r.d).join(' '), cx, cy };
		}
		return { d: '', cx: 0, cy: 0 };
	}

	/* ── data → numeric map ── */
	const numericData = $derived.by<Record<number, number>>(() => {
		const out: Record<number, number> = {};
		for (const [code, val] of Object.entries(data)) {
			const num = ALPHA2_TO_NUMERIC[code.toUpperCase()];
			if (num !== undefined) out[num] = val;
		}
		return out;
	});

	const dataValues = $derived(Object.values(numericData).filter(isFinite));
	const dataMin    = $derived(dataValues.length ? Math.min(...dataValues) : 0);
	const dataMax    = $derived(dataValues.length ? Math.max(...dataValues) : 1);

	/* ── color scale (choropleth) ── */
	function hexToRgb(hex: string): [number,number,number] {
		const c = hex.replace('#', '');
		const n = parseInt(c, 16);
		return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
	}
	function lerpColor(t: number): string {
		const a = hexToRgb(colorFrom), b = hexToRgb(colorTo);
		return `rgb(${Math.round(a[0]+(b[0]-a[0])*t)},${Math.round(a[1]+(b[1]-a[1])*t)},${Math.round(a[2]+(b[2]-a[2])*t)})`;
	}
	function choroplethColor(id: number): string {
		const val = numericData[id];
		if (val === undefined || dataValues.length === 0) return '#1e293b';
		const t = dataMax === dataMin ? 0.5 : (val - dataMin) / (dataMax - dataMin);
		return lerpColor(t);
	}

	/* ── computed paths ── */
	type CountryPath = { id: number; d: string; cx: number; cy: number };

	const paths = $derived.by<CountryPath[]>(() => {
		if (!topo || !svgW || svgH <= 0) return [];
		return topo.objects.countries.geometries
			.filter(g => g.type === 'Polygon' || g.type === 'MultiPolygon')
			.map(g => {
				const id = typeof g.id === 'string' ? parseInt(g.id, 10) : (g.id as number);
				const { d, cx, cy } = geomToPathCentroid(topo!, g, svgW, svgH);
				return { id, d, cx, cy };
			})
			.filter(p => p.d.length > 1 && !isNaN(p.id));
	});

	/* ── pulse circles ── */
	type PulseCircle = { id: number; cx: number; cy: number; baseR: number };

	const pulseCircles = $derived(
		mode === 'pulse'
			? paths
				.filter(p => numericData[p.id] !== undefined)
				.map((p): PulseCircle => {
					const val   = numericData[p.id];
					const t     = dataMax > dataMin ? (val - dataMin) / (dataMax - dataMin) : 0.5;
					const baseR = 3 + t * 11;
					return { id: p.id, cx: p.cx, cy: p.cy, baseR };
				})
			: []
	);

	/* ── fmt ── */
	function fmt(v: number) {
		if (v >= 1e9) return `${+(v/1e9).toFixed(1)}B`;
		if (v >= 1e6) return `${+(v/1e6).toFixed(1)}M`;
		if (v >= 1e3) return `${+(v/1e3).toFixed(1)}K`;
		return Number.isInteger(v) ? String(v) : v.toFixed(1);
	}

	/* ── zoom + pan ── */
	let zoom      = $state(1);
	let panX      = $state(0);
	let panY      = $state(0);
	let dragging  = $state(false);
	let dragStart = { x: 0, y: 0, px: 0, py: 0 };

	function onWheel(e: WheelEvent) {
		e.preventDefault();
		const factor = e.deltaY < 0 ? 1.15 : 1 / 1.15;
		const rect   = (e.currentTarget as SVGElement).getBoundingClientRect();
		const mx = e.clientX - rect.left, my = e.clientY - rect.top;
		panX = mx - (mx - panX) * factor;
		panY = my - (my - panY) * factor;
		zoom = Math.max(0.8, Math.min(8, zoom * factor));
	}
	function onMouseDown(e: MouseEvent) {
		dragging  = true;
		dragStart = { x: e.clientX, y: e.clientY, px: panX, py: panY };
	}
	function onMouseMove(e: MouseEvent) {
		if (!dragging) return;
		panX = dragStart.px + (e.clientX - dragStart.x);
		panY = dragStart.py + (e.clientY - dragStart.y);
	}
	function onMouseUp()  { dragging = false; }
	function resetView()  { zoom = 1; panX = 0; panY = 0; }

	/* ── hover ── */
	let hoverId = $state<number | null>(null);
	let tipX    = $state(0);
	let tipY    = $state(0);

	function onCountryEnter(id: number, e: MouseEvent) {
		hoverId = id;
		const rect = wrapEl!.getBoundingClientRect();
		tipX = e.clientX - rect.left;
		tipY = e.clientY - rect.top;
	}
	function onCountryMove(e: MouseEvent) {
		if (hoverId === null) return;
		const rect = wrapEl!.getBoundingClientRect();
		tipX = e.clientX - rect.left;
		tipY = e.clientY - rect.top;
	}
	function onCountryLeave() { hoverId = null; }

	/* ── choropleth legend ── */
	const legendSteps = 5;
	const legendItems = $derived(
		mode === 'choropleth' && dataValues.length > 0
			? Array.from({ length: legendSteps }, (_, i) => {
				const t = i / (legendSteps - 1);
				return { color: lerpColor(t), value: dataMin + (dataMax - dataMin) * t };
			})
			: []
	);
</script>

<div bind:this={wrapEl} class="relative select-none overflow-hidden rounded-xl {cls}">
	{#if loading}
		<div class="flex items-center justify-center" style:height="{svgH}px">
			<span class="text-sm text-muted-foreground animate-pulse">Loading map…</span>
		</div>
	{:else if error}
		<div class="flex items-center justify-center" style:height="{svgH}px">
			<span class="text-sm text-destructive">{error}</span>
		</div>
	{:else if svgW > 0}
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<svg
			width={svgW} height={svgH}
			class="block"
			style:cursor={dragging ? 'grabbing' : 'grab'}
			onwheel={onWheel}
			onmousedown={onMouseDown}
			onmousemove={(e) => { onMouseMove(e); onCountryMove(e); }}
			onmouseup={onMouseUp}
			onmouseleave={() => { onMouseUp(); onCountryLeave(); }}
		>
			<!-- ocean -->
			<rect width={svgW} height={svgH} fill="var(--muted)" />

			<g transform="translate({panX},{panY}) scale({zoom})">
				<!-- country fills -->
				{#each paths as { id, d }}
					{@const isHov = hoverId === id}
					{@const fill = mode === 'choropleth'
						? (isHov ? colorTo : choroplethColor(id))
						: (isHov ? 'var(--accent)' : 'var(--card)')}
					<!-- svelte-ignore a11y_no_static_element_interactions -->
					<path
						{d}
						{fill}
						stroke="var(--muted)"
						stroke-width={0.5 / zoom}
						stroke-linejoin="round"
						opacity={mode === 'choropleth' && isHov ? 1 : (mode === 'choropleth' ? 0.92 : 1)}
						style="transition: fill 0.12s ease"
						onmouseenter={(e) => onCountryEnter(id, e)}
						onmouseleave={onCountryLeave}
					/>
				{/each}

				<!-- pulse rings — SMIL animation, no CSS keyframes needed -->
				{#each pulseCircles as { id, cx, cy, baseR }}
					<g transform="translate({cx},{cy})" style="pointer-events:none">
						{#each [0, 0.8, 1.6] as delay}
							<circle r={baseR} fill={pulseColor} opacity="0.65">
								<animate
									attributeName="r"
									from={baseR}
									to={baseR * 6}
									dur="2.4s"
									begin="{delay}s"
									repeatCount="indefinite"
									calcMode="ease-out"
								/>
								<animate
									attributeName="opacity"
									from="0.65"
									to="0"
									dur="2.4s"
									begin="{delay}s"
									repeatCount="indefinite"
								/>
							</circle>
						{/each}
						<!-- solid core dot -->
						<circle r={Math.max(1.5, baseR * 0.38)} fill={pulseColor} opacity="0.95" />
					</g>
				{/each}
			</g>
		</svg>

		<!-- label -->
		{#if label}
			<div class="pointer-events-none absolute top-3 left-3">
				<span class="text-sm font-semibold text-foreground bg-card/80 backdrop-blur px-2 py-1 rounded-lg">{label}</span>
			</div>
		{/if}

		<!-- reset -->
		<button
			class="absolute top-3 right-3 text-xs text-muted-foreground bg-card/80 backdrop-blur border border-border px-2 py-1 rounded-lg hover:text-foreground transition-colors"
			onclick={resetView}
		>
			Reset
		</button>

		<!-- hint -->
		<div class="pointer-events-none absolute bottom-3 right-3 text-[10px] text-muted-foreground opacity-60">
			Scroll to zoom · Drag to pan
		</div>

		<!-- choropleth legend -->
		{#if legendItems.length}
			<div class="pointer-events-none absolute bottom-3 left-3 flex items-center gap-1.5">
				{#each legendItems as item, i}
					<span class="size-3 rounded-sm shrink-0" style:background={item.color}></span>
					{#if i === 0 || i === legendItems.length - 1}
						<span class="text-[10px] text-muted-foreground mr-1">{fmt(item.value)}</span>
					{/if}
				{/each}
			</div>
		{/if}

		<!-- tooltip -->
		{#if hoverId !== null}
			{@const name = COUNTRY_NAMES[hoverId] ?? 'Unknown'}
			{@const val  = numericData[hoverId]}
			{@const flip = tipX > svgW * 0.6}
			<div
				class="pointer-events-none absolute z-10 rounded-xl bg-card border border-border shadow-xl px-3 py-2 text-xs whitespace-nowrap"
				style:left="{tipX + (flip ? -12 : 12)}px"
				style:top="{Math.max(8, tipY - 16)}px"
				style:transform={flip ? 'translateX(-100%)' : undefined}
			>
				<p class="font-semibold text-foreground">{name}</p>
				{#if val !== undefined}
					<p class="mt-0.5 text-muted-foreground">{fmt(val)}</p>
				{/if}
			</div>
		{/if}
	{/if}
</div>
