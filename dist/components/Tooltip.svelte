<script lang="ts">
	import { onMount, tick } from 'svelte';
	import type { Snippet } from 'svelte';

	type Placement = 'top' | 'bottom' | 'left' | 'right' | 'top-start' | 'top-end' | 'bottom-start' | 'bottom-end';

	type Props = {
		content:    string | Snippet;
		placement?: Placement;
		delay?:     number;
		offset?:    number;
		disabled?:  boolean;
		children:   Snippet;
	};

	let {
		content,
		placement = 'top',
		delay     = 300,
		offset    = 8,
		disabled  = false,
		children,
	}: Props = $props();

	/* ── STATE ── */
	let visible  = $state(false);
	let closing  = $state(false);
	let mounted  = $state(false);
	let side     = $state<'top' | 'bottom' | 'left' | 'right'>('top');

	let wrapEl:  HTMLSpanElement | undefined = $state();
	let tipEl:   HTMLDivElement  | undefined = $state();
	let portalEl:HTMLDivElement  | undefined = $state();

	let showTimer: ReturnType<typeof setTimeout>;
	let hideTimer: ReturnType<typeof setTimeout>;

	type Pos = { top: number; left: number };
	let pos     = $state<Pos>({ top: -9999, left: -9999 });
	let arrowX  = $state<number | undefined>();
	let arrowY  = $state<number | undefined>();

	/* ── PORTAL ── */
	onMount(() => { mounted = true; });
	$effect(() => {
		if (portalEl && mounted && portalEl.parentElement !== document.body)
			document.body.appendChild(portalEl);
	});
	$effect(() => () => {
		if (portalEl?.parentElement === document.body) document.body.removeChild(portalEl);
	});

	/* ── POSITION ── */
	async function calcPos() {
		await tick();
		if (!wrapEl || !tipEl) return;

		const r   = wrapEl.getBoundingClientRect();
		const tw  = tipEl.offsetWidth  || 120;
		const th  = tipEl.offsetHeight || 32;
		const vw  = window.innerWidth;
		const vh  = window.innerHeight;
		const gap = offset;

		const baseSide  = placement.split('-')[0] as 'top' | 'bottom' | 'left' | 'right';
		const align     = placement.split('-')[1] as 'start' | 'end' | undefined;

		// auto-flip
		let s = baseSide;
		if      (s === 'top'    && r.top    - gap - th < 0)        s = 'bottom';
		else if (s === 'bottom' && r.bottom + gap + th > vh)        s = 'top';
		else if (s === 'left'   && r.left   - gap - tw < 0)        s = 'right';
		else if (s === 'right'  && r.right  + gap + tw > vw)       s = 'left';
		side = s;

		let top: number, left: number;

		if (s === 'top' || s === 'bottom') {
			top  = s === 'top' ? r.top - gap - th : r.bottom + gap;
			if      (align === 'start') left = r.left;
			else if (align === 'end')   left = r.right - tw;
			else                        left = r.left + r.width / 2 - tw / 2;
		} else {
			left = s === 'left' ? r.left - gap - tw : r.right + gap;
			if      (align === 'start') top = r.top;
			else if (align === 'end')   top = r.bottom - th;
			else                        top = r.top + r.height / 2 - th / 2;
		}

		left = Math.max(8, Math.min(left, vw - tw - 8));
		top  = Math.max(8, Math.min(top,  vh - th - 8));
		pos  = { top, left };

		// arrow points to trigger center
		const cx = r.left + r.width  / 2;
		const cy = r.top  + r.height / 2;
		if (s === 'top' || s === 'bottom') {
			arrowX = Math.max(10, Math.min(cx - left, tw - 10));
			arrowY = undefined;
		} else {
			arrowY = Math.max(10, Math.min(cy - top, th - 10));
			arrowX = undefined;
		}
	}

	/* ── SHOW / HIDE ── */
	function show() {
		if (disabled) return;
		clearTimeout(hideTimer);
		showTimer = setTimeout(async () => {
			closing = false;
			visible = true;
			await calcPos();
		}, delay);
	}

	function hide() {
		clearTimeout(showTimer);
		closing = true;
		hideTimer = setTimeout(() => { visible = false; closing = false; }, 130);
	}
</script>

<span
	bind:this={wrapEl}
	style="display:inline-block;"
	onmouseenter={show}
	onmouseleave={hide}
	onfocusin={show}
	onfocusout={hide}
>
	{@render children()}
</span>

<div bind:this={portalEl} style="display:contents;">
{#if visible}
	<div
		bind:this={tipEl}
		role="tooltip"
		class="tt-tip tt-{side} {closing ? 'tt-out' : 'tt-in'}"
		style:position="fixed"
		style:z-index="10001"
		style:top="{pos.top}px"
		style:left="{pos.left}px"
	>
		{#if typeof content === 'function'}
			{@render (content as Snippet)()}
		{:else}
			{content}
		{/if}

		<span
			class="tt-arrow"
			style:left={arrowX !== undefined ? `${arrowX}px` : undefined}
			style:top={arrowY !== undefined ? `${arrowY}px` : undefined}
		></span>
	</div>
{/if}
</div>

<style>
	.tt-tip {
		background: var(--foreground);
		color: var(--background);
		font-size: 0.75rem;
		font-weight: 500;
		line-height: 1.45;
		padding: 0.35rem 0.6rem;
		border-radius: 0.5rem;
		max-width: 220px;
		white-space: normal;
		word-break: break-word;
		pointer-events: none;
		position: fixed;
	}

	/* ── enter animations ── */
	.tt-in.tt-top    { animation: tt-top-in    0.13s ease both; }
	.tt-in.tt-bottom { animation: tt-bottom-in 0.13s ease both; }
	.tt-in.tt-left   { animation: tt-left-in   0.13s ease both; }
	.tt-in.tt-right  { animation: tt-right-in  0.13s ease both; }
	.tt-out          { animation: tt-out        0.1s  ease-in both; }

	@keyframes tt-top-in    { from { opacity:0; transform:translateY( 5px); } to { opacity:1; transform:translateY(0); } }
	@keyframes tt-bottom-in { from { opacity:0; transform:translateY(-5px); } to { opacity:1; transform:translateY(0); } }
	@keyframes tt-left-in   { from { opacity:0; transform:translateX( 5px); } to { opacity:1; transform:translateX(0); } }
	@keyframes tt-right-in  { from { opacity:0; transform:translateX(-5px); } to { opacity:1; transform:translateX(0); } }
	@keyframes tt-out       { from { opacity:1; } to { opacity:0; } }

	/* ── arrow ── */
	.tt-arrow {
		position: absolute;
		width: 7px; height: 7px;
		background: var(--foreground);
	}

	.tt-top    .tt-arrow { bottom: -3px; transform: translateX(-50%) rotate(45deg); }
	.tt-bottom .tt-arrow { top:    -3px; transform: translateX(-50%) rotate(45deg); }
	.tt-left   .tt-arrow { right:  -3px; transform: translateY(-50%) rotate(45deg); }
	.tt-right  .tt-arrow { left:   -3px; transform: translateY(-50%) rotate(45deg); }
</style>
