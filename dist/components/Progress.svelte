<script lang="ts">
	type Size    = 'xs' | 'sm' | 'md' | 'lg';
	type Variant = 'accent' | 'success' | 'warning' | 'danger' | 'info';
	type Anim    = 'smooth' | 'spring' | 'bounce' | 'none';

	type Props = {
		value?:       number;
		max?:         number;
		size?:        Size;
		variant?:     Variant;
		animation?:   Anim;
		striped?:     boolean;
		indeterminate?: boolean;
		label?:       string;
		showValue?:   boolean;
		class?:       string;
	};

	let {
		value         = 0,
		max           = 100,
		size          = 'md',
		variant       = 'accent',
		animation     = 'smooth',
		striped       = false,
		indeterminate = false,
		label,
		showValue     = false,
		class: cls    = '',
	}: Props = $props();

	const heights: Record<Size, string> = {
		xs: '0.2rem',
		sm: '0.375rem',
		md: '0.625rem',
		lg: '1rem',
	};

	const colors: Record<Variant, string> = {
		accent:  'var(--accent)',
		success: '#22c55e',
		warning: '#f59e0b',
		danger:  '#ef4444',
		info:    '#3b82f6',
	};

	const easings: Record<Anim, string> = {
		smooth: 'cubic-bezier(0.16,1,0.3,1)',
		spring: 'cubic-bezier(0.34,1.56,0.64,1)',
		bounce: 'cubic-bezier(0.34,1.8,0.64,1)',
		none:   'linear',
	};
	const durations: Record<Anim, string> = {
		smooth: '0.5s', spring: '0.6s', bounce: '0.55s', none: '0s',
	};

	const pct      = $derived(Math.min(100, Math.max(0, (value / max) * 100)));
	const color    = $derived(colors[variant]);
	const height   = $derived(heights[size]);
	const ease     = $derived(easings[animation]);
	const duration = $derived(durations[animation]);
</script>

{#if label || showValue}
	<div class="pg-header">
		{#if label}<span class="pg-label">{label}</span>{/if}
		{#if showValue}<span class="pg-value">{Math.round(pct)}%</span>{/if}
	</div>
{/if}

<div
	class="pg-track {cls}"
	style="height:{height};"
	role="progressbar"
	aria-valuenow={indeterminate ? undefined : value}
	aria-valuemin={0}
	aria-valuemax={max}
>
	{#if indeterminate}
		<div class="pg-bar pg-indeterminate" style="background:{color}; height:{height};"></div>
	{:else}
		<div
			class="pg-bar {striped ? 'pg-striped' : ''}"
			style="
				width:{pct}%;
				background:{color};
				height:{height};
				border-radius:inherit;
				transition: width {duration} {ease};
			"
		></div>
	{/if}
</div>

<style>
	.pg-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 0.4rem;
	}
	.pg-label {
		font-size: 0.8rem;
		font-weight: 500;
		color: var(--foreground);
	}
	.pg-value {
		font-size: 0.75rem;
		font-weight: 600;
		color: var(--muted-foreground);
		font-variant-numeric: tabular-nums;
	}

	.pg-track {
		width: 100%;
		background: var(--muted);
		border-radius: 9999px;
		overflow: hidden;
		position: relative;
	}

	.pg-bar {
		height: 100%;
		border-radius: 9999px;
		position: relative;
		overflow: hidden;
	}

	/* ── STRIPED ── */
	.pg-striped {
		background-image: repeating-linear-gradient(
			45deg,
			transparent,
			transparent 6px,
			rgba(255,255,255,0.18) 6px,
			rgba(255,255,255,0.18) 12px
		) !important;
		animation: pg-stripe 1s linear infinite;
	}
	@keyframes pg-stripe {
		from { background-position: 0 0; }
		to   { background-position: 24px 0; }
	}

	/* ── INDETERMINATE ── */
	.pg-indeterminate {
		width: 40%;
		border-radius: 9999px;
		animation: pg-indeterminate 1.4s cubic-bezier(0.65,0,0.35,1) infinite;
	}
	@keyframes pg-indeterminate {
		0%   { transform: translateX(-100%); }
		100% { transform: translateX(350%);  }
	}

	/* ── SHIMMER on fill ── */
	.pg-bar::after {
		content: '';
		position: absolute;
		inset: 0;
		background: linear-gradient(
			90deg,
			transparent 0%,
			rgba(255,255,255,0.25) 50%,
			transparent 100%
		);
		animation: pg-shine 2.5s ease-in-out infinite;
		transform: translateX(-100%);
	}
	.pg-indeterminate::after { display: none; }

	@keyframes pg-shine {
		0%   { transform: translateX(-100%); }
		60%  { transform: translateX(200%);  }
		100% { transform: translateX(200%);  }
	}
</style>
