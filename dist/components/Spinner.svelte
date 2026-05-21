<script lang="ts">
	type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
	type Variant =
		| 'ring' | 'ring-dual' | 'ring-split' | 'ring-track'
		| 'dots' | 'bounce' | 'pulse' | 'bars' | 'wave' | 'ripple' | 'orbit';

	type Props = {
		size?: Size;
		variant?: Variant;
		color?: string;
	};

	let { size = 'md', variant = 'ring', color }: Props = $props();

	const sizes: Record<Size, string> = {
		xs: '16px', sm: '20px', md: '28px', lg: '40px', xl: '56px',
	};

	const px = $derived(sizes[size]);
	const c  = $derived(color ?? 'var(--accent)');
</script>

{#if variant === 'ring'}
	<span class="sp-ring" style:width={px} style:height={px} style:--c={c}></span>

{:else if variant === 'ring-dual'}
	<span class="sp-ring-dual" style:width={px} style:height={px} style:--c={c}>
		<span></span><span></span>
	</span>

{:else if variant === 'ring-split'}
	<span class="sp-ring-split" style:width={px} style:height={px} style:--c={c}></span>

{:else if variant === 'ring-track'}
	<span class="sp-ring-track" style:width={px} style:height={px} style:--c={c}></span>

{:else if variant === 'dots'}
	<span class="sp-dots" style:--c={c} style:--s="calc({px} / 4)">
		<span></span><span></span><span></span>
	</span>

{:else if variant === 'bounce'}
	<span class="sp-bounce" style:--c={c} style:--s="calc({px} / 3.2)">
		<span></span><span></span><span></span>
	</span>

{:else if variant === 'pulse'}
	<span class="sp-pulse" style:width={px} style:height={px} style:--c={c}></span>

{:else if variant === 'bars'}
	<span class="sp-bars" style:--c={c} style:height={px}>
		<span></span><span></span><span></span><span></span>
	</span>

{:else if variant === 'wave'}
	<span class="sp-wave" style:--c={c} style:height={px}>
		<span></span><span></span><span></span><span></span><span></span>
	</span>

{:else if variant === 'ripple'}
	<span class="sp-ripple" style:width={px} style:height={px} style:--c={c}>
		<span></span><span></span>
	</span>

{:else if variant === 'orbit'}
	<span class="sp-orbit" style:width={px} style:height={px} style:--c={c}>
		<span></span>
	</span>
{/if}

<style>
	/* ── RING ── */
	.sp-ring {
		display: inline-block; border-radius: 50%;
		border: 2.5px solid color-mix(in srgb, var(--c) 20%, transparent);
		border-top-color: var(--c);
		animation: sp-spin 0.65s linear infinite;
	}

	/* ── RING DUAL ── */
	.sp-ring-dual {
		display: inline-block; position: relative;
	}
	.sp-ring-dual span {
		position: absolute; inset: 0; border-radius: 50%;
	}
	.sp-ring-dual span:nth-child(1) {
		border: 2.5px solid color-mix(in srgb, var(--c) 20%, transparent);
		border-top-color: var(--c);
		animation: sp-spin 0.65s linear infinite;
	}
	.sp-ring-dual span:nth-child(2) {
		inset: 25%;
		border: 2px solid color-mix(in srgb, var(--c) 20%, transparent);
		border-bottom-color: var(--c);
		animation: sp-spin 0.5s linear infinite reverse;
	}

	/* ── RING SPLIT ── */
	.sp-ring-split {
		display: inline-block; border-radius: 50%;
		border: 2.5px solid transparent;
		border-top-color: var(--c);
		border-bottom-color: var(--c);
		animation: sp-spin 0.8s ease-in-out infinite;
	}

	/* ── RING TRACK ── */
	.sp-ring-track {
		display: inline-block; border-radius: 50%;
		border: 2.5px solid color-mix(in srgb, var(--c) 15%, transparent);
		border-top-color: var(--c);
		border-right-color: color-mix(in srgb, var(--c) 60%, transparent);
		animation: sp-spin 0.7s linear infinite;
	}

	/* ── DOTS ── */
	.sp-dots { display: inline-flex; align-items: center; gap: 5px; }
	.sp-dots span {
		display: inline-block; border-radius: 50%;
		width: var(--s); height: var(--s);
		background: var(--c);
		animation: sp-dots 1.2s ease-in-out infinite;
	}
	.sp-dots span:nth-child(2) { animation-delay: 0.2s; }
	.sp-dots span:nth-child(3) { animation-delay: 0.4s; }

	/* ── BOUNCE ── */
	.sp-bounce { display: inline-flex; align-items: flex-end; gap: 5px; }
	.sp-bounce span {
		display: inline-block; border-radius: 50%;
		width: var(--s); height: var(--s);
		background: var(--c);
		animation: sp-bounce 0.8s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite alternate;
	}
	.sp-bounce span:nth-child(2) { animation-delay: 0.16s; }
	.sp-bounce span:nth-child(3) { animation-delay: 0.32s; }

	/* ── PULSE ── */
	.sp-pulse {
		display: inline-block; border-radius: 50%;
		background: var(--c);
		animation: sp-pulse 1s ease-in-out infinite;
	}

	/* ── BARS ── */
	.sp-bars { display: inline-flex; align-items: flex-end; gap: 3px; }
	.sp-bars span {
		display: inline-block; width: 3px; border-radius: 2px;
		background: var(--c);
		animation: sp-bars 1s ease-in-out infinite;
	}
	.sp-bars span:nth-child(2) { animation-delay: 0.15s; }
	.sp-bars span:nth-child(3) { animation-delay: 0.3s; }
	.sp-bars span:nth-child(4) { animation-delay: 0.45s; }

	/* ── WAVE ── */
	.sp-wave { display: inline-flex; align-items: center; gap: 3px; }
	.sp-wave span {
		display: inline-block; width: 3px; border-radius: 2px;
		background: var(--c);
		animation: sp-wave 1.1s ease-in-out infinite;
	}
	.sp-wave span:nth-child(1) { animation-delay: 0s;    height: 40%; }
	.sp-wave span:nth-child(2) { animation-delay: 0.12s; height: 60%; }
	.sp-wave span:nth-child(3) { animation-delay: 0.24s; height: 100%; }
	.sp-wave span:nth-child(4) { animation-delay: 0.36s; height: 60%; }
	.sp-wave span:nth-child(5) { animation-delay: 0.48s; height: 40%; }

	/* ── RIPPLE ── */
	.sp-ripple { display: inline-block; position: relative; }
	.sp-ripple span {
		position: absolute; inset: 0; border-radius: 50%;
		border: 2px solid var(--c);
		animation: sp-ripple 1.4s ease-out infinite;
	}
	.sp-ripple span:nth-child(2) { animation-delay: 0.6s; }

	/* ── ORBIT ── */
	.sp-orbit { display: inline-block; position: relative; animation: sp-spin 1.2s linear infinite; }
	.sp-orbit span {
		position: absolute;
		top: 0; left: 50%;
		width: 22%; height: 22%;
		margin-left: -11%;
		border-radius: 50%;
		background: var(--c);
	}

	@keyframes sp-spin   { to { transform: rotate(360deg); } }
	@keyframes sp-dots   { 0%, 80%, 100% { opacity: 0.2; transform: scale(0.6); } 40% { opacity: 1; transform: scale(1); } }
	@keyframes sp-bounce { from { transform: translateY(0); } to { transform: translateY(-70%); } }
	@keyframes sp-pulse  { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.35; transform: scale(0.72); } }
	@keyframes sp-bars   { 0%, 100% { height: 25%; } 50% { height: 100%; } }
	@keyframes sp-wave   { 0%, 100% { transform: scaleY(0.5); opacity: 0.5; } 50% { transform: scaleY(1); opacity: 1; } }
	@keyframes sp-ripple { 0% { transform: scale(0); opacity: 1; } 100% { transform: scale(1); opacity: 0; } }
</style>
