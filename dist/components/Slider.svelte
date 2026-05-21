<script lang="ts">
	type Anim = 'none' | 'smooth' | 'spring' | 'elastic' | 'bounce' | 'snappy';

	type Props = {
		value?: number;
		min?: number;
		max?: number;
		step?: number;
		label?: string;
		hint?: string;
		showValue?: boolean;
		disabled?: boolean;
		animation?: Anim;
		onchange?: (v: number) => void;
	};

	let {
		value     = $bindable(0),
		min       = 0,
		max       = 100,
		step      = 1,
		label,
		hint,
		showValue = true,
		disabled  = false,
		animation = 'none',
		onchange,
	}: Props = $props();

	const trackEase: Record<Anim, string> = {
		none:    'none',
		smooth:  'width 0.12s cubic-bezier(0.16,1,0.3,1)',
		spring:  'width 0.35s cubic-bezier(0.34,1.56,0.64,1)',
		elastic: 'width 0.45s cubic-bezier(0.68,-0.55,0.27,1.55)',
		bounce:  'width 0.4s cubic-bezier(0.34,1.9,0.64,1)',
		snappy:  'width 0.08s cubic-bezier(0.4,0,0.2,1)',
	};
	const thumbEase: Record<Anim, string> = {
		none:    'none',
		smooth:  'left 0.12s cubic-bezier(0.16,1,0.3,1)',
		spring:  'left 0.35s cubic-bezier(0.34,1.56,0.64,1)',
		elastic: 'left 0.45s cubic-bezier(0.68,-0.55,0.27,1.55)',
		bounce:  'left 0.4s cubic-bezier(0.34,1.9,0.64,1)',
		snappy:  'left 0.08s cubic-bezier(0.4,0,0.2,1)',
	};

	let dragging  = $state(false);
	let trackEl:  HTMLDivElement | undefined = $state();
	let thumbEl:  HTMLDivElement | undefined = $state();

	const pct             = $derived(((value - min) / (max - min)) * 100);
	const display         = $derived(Number.isInteger(step) ? value.toFixed(0) : value.toFixed(1));
	const fillTransition  = $derived(dragging ? 'none' : trackEase[animation]);
	const thumbTransition = $derived(dragging ? 'none' : thumbEase[animation]);

	function clamp(v: number) {
		const stepped = Math.round((v - min) / step) * step + min;
		return Math.min(max, Math.max(min, stepped));
	}

	function posToValue(clientX: number) {
		if (!trackEl) return value;
		const r = trackEl.getBoundingClientRect();
		const ratio = Math.min(1, Math.max(0, (clientX - r.left) / r.width));
		return clamp(min + ratio * (max - min));
	}

	function onTrackDown(e: MouseEvent | TouchEvent) {
		if (disabled) return;
		e.preventDefault();
		dragging = true;
		const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
		value = posToValue(clientX);
		onchange?.(value);
	}

	function onMove(e: MouseEvent | TouchEvent) {
		if (!dragging) return;
		const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
		value = posToValue(clientX);
		onchange?.(value);
	}

	function onUp() { dragging = false; }

	function onKeyDown(e: KeyboardEvent) {
		if (disabled) return;
		const big = (max - min) / 10;
		if      (e.key === 'ArrowRight' || e.key === 'ArrowUp')   { e.preventDefault(); value = clamp(value + step); }
		else if (e.key === 'ArrowLeft'  || e.key === 'ArrowDown')  { e.preventDefault(); value = clamp(value - step); }
		else if (e.key === 'PageUp')    { e.preventDefault(); value = clamp(value + big); }
		else if (e.key === 'PageDown')  { e.preventDefault(); value = clamp(value - big); }
		else if (e.key === 'Home')      { e.preventDefault(); value = min; }
		else if (e.key === 'End')       { e.preventDefault(); value = max; }
		onchange?.(value);
	}
</script>

<svelte:window
	onmousemove={onMove}
	onmouseup={onUp}
	ontouchmove={onMove}
	ontouchend={onUp}
/>

<div class="flex w-full flex-col gap-2 {disabled ? 'pointer-events-none opacity-50' : ''}">
	{#if label || showValue}
		<div class="flex items-center justify-between px-0.5">
			{#if label}
				<span class="text-sm font-medium text-muted-foreground">{label}</span>
			{/if}
			{#if showValue}
				<span class="text-sm font-semibold tabular-nums text-foreground {dragging ? 'text-accent' : ''}"
					style="transition: color 0.15s">{display}</span>
			{/if}
		</div>
	{/if}

	<!-- Track -->
	<div
		bind:this={trackEl}
		class="relative flex h-10 cursor-pointer items-center"
		role="slider"
		aria-valuemin={min}
		aria-valuemax={max}
		aria-valuenow={value}
		aria-disabled={disabled}
		tabindex={disabled ? -1 : 0}
		onmousedown={onTrackDown}
		ontouchstart={onTrackDown}
		onkeydown={onKeyDown}
	>
		<!-- Rail -->
		<div class="relative h-1.5 w-full overflow-hidden rounded-full bg-muted">
			<!-- Fill -->
			<div
				class="absolute inset-y-0 left-0 rounded-full bg-accent"
				style:width="{pct}%"
				style:transition={fillTransition}
			></div>
		</div>

		<!-- Thumb -->
		<div
			bind:this={thumbEl}
			class="thumb absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
			style:left="{pct}%"
			style:transition={thumbTransition}
		>
			<div class="thumb-inner {dragging ? 'dragging' : ''}"></div>
			<!-- Tooltip -->
			{#if dragging}
				<div class="tooltip">{display}</div>
			{/if}
		</div>
	</div>

	{#if hint}
		<p class="px-0.5 text-xs text-muted-foreground">{hint}</p>
	{/if}
</div>

<style>
	.thumb-inner {
		width: 20px; height: 20px;
		background: var(--accent);
		border-radius: 50%;
		border: 2.5px solid var(--background);
		box-shadow: 0 1px 6px rgba(0,0,0,0.2);
		transition: transform 0.15s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.15s;
		cursor: grab;
	}
	.thumb-inner:hover   { transform: scale(1.15); box-shadow: 0 2px 10px rgba(0,0,0,0.25); }
	.thumb-inner.dragging {
		transform: scale(1.25);
		cursor: grabbing;
		box-shadow: 0 0 0 6px color-mix(in srgb, var(--accent) 20%, transparent);
	}

	.tooltip {
		position: absolute;
		bottom: calc(100% + 6px);
		left: 50%;
		transform: translateX(-50%);
		background: var(--foreground);
		color: var(--background);
		font-size: 0.7rem;
		font-weight: 600;
		padding: 2px 7px;
		border-radius: 6px;
		white-space: nowrap;
		pointer-events: none;
		animation: tip-in 0.15s cubic-bezier(0.34,1.56,0.64,1) both;
	}
	.tooltip::after {
		content:'';
		position: absolute;
		top: 100%; left: 50%;
		transform: translateX(-50%);
		border: 4px solid transparent;
		border-top-color: var(--foreground);
	}

	@keyframes tip-in { from { opacity:0; transform:translateX(-50%) scale(0.7); } to { opacity:1; transform:translateX(-50%) scale(1); } }
</style>
