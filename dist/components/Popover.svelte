<script lang="ts">
	import { onMount, tick } from 'svelte';
	import type { Snippet } from 'svelte';

	type Placement = 'top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end' | 'left' | 'right';
	type Anim = 'scale' | 'slide' | 'elastic' | 'flip' | 'bounce' | 'zoom';

	type Props = {
		open?: boolean;
		placement?: Placement;
		offset?: number;
		arrow?: boolean;
		animation?: Anim;
		trigger: Snippet<[{ toggle: () => void; open: boolean }]>;
		children: Snippet;
	};

	let {
		open      = $bindable(false),
		placement = 'bottom',
		offset    = 8,
		arrow     = true,
		animation = 'scale',
		trigger,
		children,
	}: Props = $props();

	let closing   = $state(false);
	let mounted   = $state(false);
	let wrapEl:   HTMLSpanElement | undefined = $state();
	let popEl:    HTMLDivElement  | undefined = $state();
	let portalEl: HTMLDivElement  | undefined = $state();

	type Pos = {
		top: number; left: number;
		transformOrigin: string;
		arrowLeft?: number; arrowTop?: number;
		side: 'top' | 'bottom' | 'left' | 'right';
	};
	let pos = $state<Pos>({ top: -9999, left: -9999, transformOrigin: 'top center', side: 'bottom' });

	onMount(() => { mounted = true; });

	$effect(() => {
		if (portalEl && mounted && portalEl.parentElement !== document.body)
			document.body.appendChild(portalEl);
	});
	$effect(() => () => {
		if (portalEl?.parentElement === document.body) document.body.removeChild(portalEl);
	});

	function calcPos() {
		if (!wrapEl || !popEl) return;

		const r  = wrapEl.getBoundingClientRect();
		const vw = window.innerWidth;
		const vh = window.innerHeight;
		const gap = offset + (arrow ? 8 : 0);
		const pw = popEl.offsetWidth  || 200;
		const ph = popEl.offsetHeight || 80;

		const midX = r.left + r.width  / 2;
		const midY = r.top  + r.height / 2;

		let side  = placement.split('-')[0] as 'top' | 'bottom' | 'left' | 'right';
		const align = placement.split('-')[1] as 'start' | 'end' | undefined;

		/* auto-flip */
		if (side === 'bottom' && r.bottom + gap + ph > vh && r.top - gap - ph > 0) side = 'top';
		else if (side === 'top' && r.top - gap - ph < 0 && r.bottom + gap + ph < vh) side = 'bottom';
		else if (side === 'right' && r.right + gap + pw > vw && r.left - gap - pw > 0) side = 'left';
		else if (side === 'left' && r.left - gap - pw < 0 && r.right + gap + pw < vw) side = 'right';

		let top = 0, left = 0;
		let arrowLeft: number | undefined, arrowTop: number | undefined;
		let transformOrigin = 'top center';

		if (side === 'bottom') {
			top  = r.bottom + gap;
			left = align === 'end' ? r.right - pw : align === 'start' ? r.left : midX - pw / 2;
			arrowLeft = midX - left - 6;
			transformOrigin = align === 'end' ? 'top right' : align === 'start' ? 'top left' : 'top center';
		} else if (side === 'top') {
			top  = r.top - gap - ph;
			left = align === 'end' ? r.right - pw : align === 'start' ? r.left : midX - pw / 2;
			arrowLeft = midX - left - 6;
			transformOrigin = align === 'end' ? 'bottom right' : align === 'start' ? 'bottom left' : 'bottom center';
		} else if (side === 'right') {
			top  = midY - ph / 2;
			left = r.right + gap;
			arrowTop = ph / 2 - 6;
			transformOrigin = 'left center';
		} else {
			top  = midY - ph / 2;
			left = r.left - gap - pw;
			arrowTop = ph / 2 - 6;
			transformOrigin = 'right center';
		}

		left = Math.max(8, Math.min(left, vw - pw - 8));
		top  = Math.max(8, Math.min(top,  vh - ph - 8));

		pos = { top, left, transformOrigin, arrowLeft, arrowTop, side };
	}

	async function openPop() {
		closing = false;
		pos = { top: -9999, left: -9999, transformOrigin: 'top center', side: 'bottom' };
		open = true;
		await tick();   /* wait for {#if open} to render popEl */
		calcPos();
	}

	function closePop() {
		closing = true;
		setTimeout(() => { open = false; closing = false; }, 180);
	}

	function toggle() { open ? closePop() : openPop(); }
</script>

<span bind:this={wrapEl} style="display:inline-block;">
	{@render trigger({ toggle, open })}
</span>

<div bind:this={portalEl} style="display:contents;">
{#if open}
	<div
		role="presentation"
		class="fixed inset-0 z-[9998]"
		onmousedown={(e) => { if (e.target === e.currentTarget) closePop(); }}
	></div>

	<div
		bind:this={popEl}
		role="dialog"
		class="pop-box pop-anim-{animation} {closing ? 'pop-closing' : ''}"
		style:position="fixed"
		style:z-index="9999"
		style:top="{pos.top}px"
		style:left="{pos.left}px"
		style:transform-origin={pos.transformOrigin}
		onmousedown={(e) => e.stopPropagation()}
		onkeydown={(e) => { if (e.key === 'Escape') { e.preventDefault(); closePop(); } }}
	>
		{#if arrow}
			{#if pos.side === 'bottom'}
				<span class="arrow arrow-top"   style:left="{pos.arrowLeft ?? 14}px"></span>
			{:else if pos.side === 'top'}
				<span class="arrow arrow-bottom" style:left="{pos.arrowLeft ?? 14}px"></span>
			{:else if pos.side === 'right'}
				<span class="arrow arrow-left"  style:top="{pos.arrowTop ?? 14}px"></span>
			{:else}
				<span class="arrow arrow-right" style:top="{pos.arrowTop ?? 14}px"></span>
			{/if}
		{/if}

		{@render children()}
	</div>
{/if}
</div>

<style>
	.pop-box {
		background: var(--card);
		border: 1px solid var(--border);
		border-radius: 1rem;
		box-shadow: 0 12px 40px -8px rgba(0,0,0,0.22), 0 2px 8px -2px rgba(0,0,0,0.1);
		min-width: 160px;
	}

	/* ── SCALE ── */
	.pop-anim-scale                  { animation: pop-scale-in   0.2s  cubic-bezier(0.34,1.56,0.64,1) both; }
	.pop-anim-scale.pop-closing      { animation: pop-scale-out  0.15s ease-in both; }

	/* ── SLIDE ── */
	.pop-anim-slide                  { animation: pop-slide-in   0.22s cubic-bezier(0.16,1,0.3,1) both; }
	.pop-anim-slide.pop-closing      { animation: pop-slide-out  0.15s ease-in both; }

	/* ── ELASTIC ── */
	.pop-anim-elastic                { animation: pop-elastic-in 0.5s  ease-out both; }
	.pop-anim-elastic.pop-closing    { animation: pop-scale-out  0.15s ease-in both; }

	/* ── FLIP ── */
	.pop-anim-flip                   { animation: pop-flip-in    0.28s cubic-bezier(0.16,1,0.3,1) both; }
	.pop-anim-flip.pop-closing       { animation: pop-flip-out   0.18s ease-in both; }

	/* ── BOUNCE ── */
	.pop-anim-bounce                 { animation: pop-bounce-in  0.5s  cubic-bezier(0.34,1.56,0.64,1) both; }
	.pop-anim-bounce.pop-closing     { animation: pop-scale-out  0.15s ease-in both; }

	/* ── ZOOM ── */
	.pop-anim-zoom                   { animation: pop-zoom-in    0.24s cubic-bezier(0.16,1,0.3,1) both; }
	.pop-anim-zoom.pop-closing       { animation: pop-zoom-out   0.15s ease-in both; }


	@keyframes pop-scale-in   { from { opacity:0; transform:scale(0.85); } to { opacity:1; transform:scale(1); } }
	@keyframes pop-scale-out  { from { opacity:1; transform:scale(1); }    to { opacity:0; transform:scale(0.85); } }

	@keyframes pop-slide-in   { from { opacity:0; transform:translateY(-10px) scale(0.96); } to { opacity:1; transform:translateY(0) scale(1); } }
	@keyframes pop-slide-out  { from { opacity:1; transform:translateY(0); }                 to { opacity:0; transform:translateY(-8px); } }

	@keyframes pop-elastic-in {
		0%   { opacity:0; transform:scale(0.4); }
		55%  { opacity:1; transform:scale(1.08); }
		75%  { transform:scale(0.96); }
		100% { transform:scale(1); }
	}

	@keyframes pop-flip-in  { from { opacity:0; transform:perspective(500px) rotateX(-15deg) scale(0.95); } to { opacity:1; transform:perspective(500px) rotateX(0) scale(1); } }
	@keyframes pop-flip-out { from { opacity:1; transform:perspective(500px) rotateX(0); } to { opacity:0; transform:perspective(500px) rotateX(-12deg) scale(0.92); } }

	@keyframes pop-bounce-in {
		0%   { opacity:0; transform:scale(0.3) translateY(-20px); }
		50%  { opacity:1; transform:scale(1.1) translateY(4px); }
		75%  { transform:scale(0.95) translateY(-2px); }
		100% { transform:scale(1) translateY(0); }
	}

	@keyframes pop-zoom-in  { from { opacity:0; transform:scale(0.6); }  to { opacity:1; transform:scale(1); } }
	@keyframes pop-zoom-out { from { opacity:1; transform:scale(1); }    to { opacity:0; transform:scale(0.6); } }


	.arrow {
		position: absolute;
		width: 12px; height: 12px;
		background: var(--card);
		border: 1px solid var(--border);
	}
	.arrow-top    { top: -7px;    transform: rotate(45deg); border-bottom: none; border-right: none; }
	.arrow-bottom { bottom: -7px; transform: rotate(45deg); border-top: none;    border-left: none;  }
	.arrow-left   { left: -7px;   transform: rotate(45deg); border-right: none;  border-bottom: none;}
	.arrow-right  { right: -7px;  transform: rotate(45deg); border-left: none;   border-top: none;   }
</style>
