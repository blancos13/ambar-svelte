<script lang="ts">
	import { onMount } from 'svelte';
	import { COUNTRY_NAMES, ALPHA2_TO_NUMERIC } from '$lib/data/worldCountries';

	export type GlobeData = Record<string, number>;

	type Props = {
		data?:        GlobeData;
		colorFrom?:   string;
		colorTo?:     string;
		emptyColor?:  string;
		size?:        number;
		autoRotate?:  boolean;
		speed?:       number;    // degrees / second
		class?:       string;
	};

	let {
		data        = {},
		colorFrom   = '#1e40af',
		colorTo     = '#93c5fd',
		emptyColor  = '#334155',
		size        = 420,
		autoRotate  = true,
		speed       = 8,
		class: cls  = '',
	}: Props = $props();

	const D2R = Math.PI / 180;

	/* ── canvas ── */
	let canvas:  HTMLCanvasElement | undefined = $state();
	let wrapEl:  HTMLDivElement    | undefined = $state();
	let ctx:     CanvasRenderingContext2D | null = null;

	/* ── globe state ── */
	let lambda = 0;   // rotation longitude
	let phi    = 20;  // tilt latitude
	let dragging   = false;
	let hovering   = false;
	let lastTime   = 0;
	let dragStart  = { x: 0, y: 0, lambda: 0, phi: 0 };

	/* ── geo data ── */
	type Ring       = [number, number][];
	type CountryGeo = { id: number; rings: Ring[] };
	type TopoJSON   = {
		arcs:      number[][][];
		transform?: { scale: [number,number]; translate: [number,number] };
		objects:   { countries: { geometries: { id: any; type: string; arcs: any }[] } };
	};

	let countries: CountryGeo[] = [];
	let loading = $state(true);

	function decodeToLonLat(topo: TopoJSON): CountryGeo[] {
		const sc = topo.transform?.scale     ?? [1, 1];
		const tr = topo.transform?.translate ?? [0, 0];

		function decodeArc(i: number): Ring {
			const rev = i < 0;
			const raw = topo.arcs[rev ? ~i : i];
			let ax = 0, ay = 0;
			const pts = raw.map(([dx, dy]): [number, number] => {
				ax += dx; ay += dy;
				return [ax * sc[0] + tr[0], ay * sc[1] + tr[1]];
			});
			return rev ? pts.reverse() : pts;
		}

		function geomRings(g: any): Ring[] {
			const decRing = (r: number[]): Ring => r.flatMap(i => decodeArc(i));
			if (g.type === 'Polygon')      return (g.arcs as number[][]).map(decRing);
			if (g.type === 'MultiPolygon') return (g.arcs as number[][][]).flatMap(p => p.map(decRing));
			return [];
		}

		return topo.objects.countries.geometries
			.filter(g => g.type === 'Polygon' || g.type === 'MultiPolygon')
			.map(g => ({
				id:    typeof g.id === 'string' ? parseInt(g.id, 10) : (g.id as number),
				rings: geomRings(g),
			}))
			.filter(c => !isNaN(c.id));
	}

	/* ── orthographic projection ── */
	function ortho(lon: number, lat: number, lam: number, ph: number) {
		const lR = lon * D2R, pR = lat * D2R;
		const l0 = lam * D2R, p0 = ph  * D2R;
		const cosc = Math.sin(p0)*Math.sin(pR) + Math.cos(p0)*Math.cos(pR)*Math.cos(lR - l0);
		return {
			x:       Math.cos(pR) * Math.sin(lR - l0),
			y:       Math.cos(p0)*Math.sin(pR) - Math.sin(p0)*Math.cos(pR)*Math.cos(lR - l0),
			visible: cosc >= 0,
		};
	}

	/* ── data → numeric id ── */
	function buildNumericData(): Record<number, number> {
		const out: Record<number, number> = {};
		for (const [code, val] of Object.entries(data)) {
			const num = ALPHA2_TO_NUMERIC[code.toUpperCase()];
			if (num !== undefined) out[num] = val;
		}
		return out;
	}

	function lerpColor(t: number): string {
		const parse = (hex: string): [number,number,number] => {
			const c = hex.replace('#', '');
			const n = parseInt(c, 16);
			return [(n>>16)&255, (n>>8)&255, n&255];
		};
		const a = parse(colorFrom), b = parse(colorTo);
		return `rgb(${Math.round(a[0]+(b[0]-a[0])*t)},${Math.round(a[1]+(b[1]-a[1])*t)},${Math.round(a[2]+(b[2]-a[2])*t)})`;
	}

	/* ── hover state ── */
	let hoverId = $state<number | null>(null);
	let tipX    = $state(0);
	let tipY    = $state(0);
	let storedPaths: { id: number; path: Path2D }[] = [];

	/* ── draw ── */
	function draw() {
		if (!ctx || !canvas || countries.length === 0) return;

		const r  = size / 2 - 3;
		const cx = size / 2;
		const cy = size / 2;
		const nd = buildNumericData();
		const vals = Object.values(nd).filter(isFinite);
		const dMin = vals.length ? Math.min(...vals) : 0;
		const dMax = vals.length ? Math.max(...vals) : 1;

		ctx.clearRect(0, 0, size, size);

		/* ocean */
		ctx.save();
		ctx.beginPath();
		ctx.arc(cx, cy, r, 0, Math.PI * 2);
		ctx.fillStyle = '#0c1929';
		ctx.fill();
		ctx.restore();

		/* clip to globe */
		ctx.save();
		ctx.beginPath();
		ctx.arc(cx, cy, r, 0, Math.PI * 2);
		ctx.clip();

		/* graticule */
		ctx.strokeStyle = 'rgba(255,255,255,0.06)';
		ctx.lineWidth   = 0.6;
		for (let lat = -60; lat <= 60; lat += 30) {
			ctx.beginPath();
			let pen = false;
			for (let lo = -180; lo <= 180; lo += 2) {
				const { x, y, visible } = ortho(lo, lat, lambda, phi);
				if (!visible) { pen = false; continue; }
				if (!pen) { ctx.moveTo(cx + x*r, cy - y*r); pen = true; }
				else ctx.lineTo(cx + x*r, cy - y*r);
			}
			ctx.stroke();
		}
		for (let lo = -180; lo < 180; lo += 30) {
			ctx.beginPath();
			let pen = false;
			for (let lat = -90; lat <= 90; lat += 2) {
				const { x, y, visible } = ortho(lo, lat, lambda, phi);
				if (!visible) { pen = false; continue; }
				if (!pen) { ctx.moveTo(cx + x*r, cy - y*r); pen = true; }
				else ctx.lineTo(cx + x*r, cy - y*r);
			}
			ctx.stroke();
		}

		/* countries */
		storedPaths = [];
		for (const country of countries) {
			const path = new Path2D();

			for (const ring of country.rings) {
				let pen = false;
				for (const [lon, lat] of ring) {
					const { x, y, visible } = ortho(lon, lat, lambda, phi);
					if (!visible) { pen = false; continue; }
					const px = cx + x * r, py = cy - y * r;
					if (!pen) { path.moveTo(px, py); pen = true; }
					else path.lineTo(px, py);
				}
				if (pen) path.closePath();
			}

			const isHov = country.id === hoverId;
			const val   = nd[country.id];

			if (val !== undefined && vals.length > 0) {
				const t = dMax === dMin ? 0.5 : (val - dMin) / (dMax - dMin);
				ctx.fillStyle = isHov ? '#ffffff' : lerpColor(t);
			} else {
				ctx.fillStyle = isHov ? '#94a3b8' : emptyColor;
			}

			ctx.fill(path);
			ctx.strokeStyle = '#071322';
			ctx.lineWidth   = 0.4;
			ctx.stroke(path);

			storedPaths.push({ id: country.id, path });
		}

		ctx.restore();

		/* atmospheric rim */
		const atm = ctx.createRadialGradient(cx, cy, r * 0.82, cx, cy, r * 1.04);
		atm.addColorStop(0,   'rgba(0,40,120,0)');
		atm.addColorStop(0.7, 'rgba(0,40,120,0.2)');
		atm.addColorStop(1,   'rgba(0,80,200,0.45)');
		ctx.save();
		ctx.beginPath();
		ctx.arc(cx, cy, r * 1.04, 0, Math.PI * 2);
		ctx.fillStyle = atm;
		ctx.fill();
		ctx.restore();

		/* outer border */
		ctx.beginPath();
		ctx.arc(cx, cy, r, 0, Math.PI * 2);
		ctx.strokeStyle = 'rgba(100,160,255,0.2)';
		ctx.lineWidth   = 1.5;
		ctx.stroke();
	}

	/* ── RAF loop ── */
	let raf = 0;

	function loop(ts: number) {
		if (lastTime === 0) lastTime = ts;
		const dt = Math.min(ts - lastTime, 50);
		lastTime = ts;
		if (autoRotate && !dragging && !hovering) {
			lambda = ((lambda - speed * dt / 1000) + 360) % 360;
		}
		draw();
		raf = requestAnimationFrame(loop);
	}

	/* ── mouse ── */
	function onMouseDown(e: MouseEvent) {
		dragging  = true;
		dragStart = { x: e.clientX, y: e.clientY, lambda, phi };
	}

	function onMouseMove(e: MouseEvent) {
		if (!wrapEl || !ctx) return;
		const rect = wrapEl.getBoundingClientRect();
		const mx   = e.clientX - rect.left;
		const my   = e.clientY - rect.top;

		if (dragging) {
			lambda = ((dragStart.lambda - (e.clientX - dragStart.x) * 0.4) % 360 + 360) % 360;
			phi    = Math.max(-80, Math.min(80, dragStart.phi - (e.clientY - dragStart.y) * 0.3));
		} else {
			hovering = false;
			hoverId  = null;
			for (let i = storedPaths.length - 1; i >= 0; i--) {
				if (ctx.isPointInPath(storedPaths[i].path, mx, my)) {
					hoverId  = storedPaths[i].id;
					tipX     = mx;
					tipY     = my;
					hovering = true;
					break;
				}
			}
		}
	}

	function onMouseUp()    { dragging = false; }
	function onMouseLeave() { dragging = false; hovering = false; hoverId = null; }

	function fmt(v: number) {
		if (v >= 1e9) return `${+(v/1e9).toFixed(1)}B`;
		if (v >= 1e6) return `${+(v/1e6).toFixed(1)}M`;
		if (v >= 1e3) return `${+(v/1e3).toFixed(1)}K`;
		return Number.isInteger(v) ? String(v) : v.toFixed(1);
	}

	onMount(() => {
		ctx = canvas!.getContext('2d');
		fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')
			.then(r => r.json())
			.then(topo => { countries = decodeToLonLat(topo); loading = false; })
			.catch(() => { loading = false; });
		raf = requestAnimationFrame(loop);
		return () => cancelAnimationFrame(raf);
	});
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	bind:this={wrapEl}
	class="relative inline-block {cls}"
	style:width="{size}px"
	style:height="{size}px"
	onmousedown={onMouseDown}
	onmousemove={onMouseMove}
	onmouseup={onMouseUp}
	onmouseleave={onMouseLeave}
>
	{#if loading}
		<div class="absolute inset-0 flex items-center justify-center rounded-full bg-[#0c1929]">
			<span class="text-sm text-slate-400 animate-pulse">Loading…</span>
		</div>
	{/if}

	<canvas
		bind:this={canvas}
		width={size}
		height={size}
		class="block rounded-full"
		style:cursor={dragging ? 'grabbing' : 'grab'}
	></canvas>

	<!-- hint -->
	<div class="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2
		text-[10px] text-slate-500 whitespace-nowrap">
		Drag to rotate
	</div>

	<!-- tooltip -->
	{#if hoverId !== null}
		{@const name = COUNTRY_NAMES[hoverId] ?? 'Unknown'}
		{@const nd   = buildNumericData()}
		{@const val  = nd[hoverId]}
		{@const flip = tipX > size * 0.6}
		<div class="pointer-events-none absolute z-10 rounded-xl bg-card border border-border shadow-xl px-3 py-2 text-xs whitespace-nowrap"
			style:left="{tipX + (flip ? -12 : 12)}px"
			style:top="{Math.max(8, tipY - 16)}px"
			style:transform={flip ? 'translateX(-100%)' : undefined}
		>
			<p class="font-semibold text-foreground">{name}</p>
			{#if val !== undefined}
				<p class="mt-0.5 text-muted-foreground">{fmt(val)}</p>
			{:else}
				<p class="mt-0.5 italic text-muted-foreground">No data</p>
			{/if}
		</div>
	{/if}
</div>
