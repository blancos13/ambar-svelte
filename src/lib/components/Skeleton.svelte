<script lang="ts">
	type Shape     = 'rect' | 'circle' | 'text';
	type Animation = 'shimmer' | 'pulse' | 'wave' | 'blink' | 'glow' | 'none';

	type Props = {
		shape?:     Shape;
		animation?: Animation;
		width?:     string;
		height?:    string;
		radius?:    string;
		lines?:     number;
		delay?:     number;
		style?:     string;
		class?:     string;
	};

	let {
		shape     = 'rect',
		animation = 'shimmer',
		width     = '100%',
		height    = '1rem',
		radius    = '0.5rem',
		lines     = 3,
		delay     = 0,
		style:    extraStyle = '',
		class:    cls = '',
	}: Props = $props();

	const lineWidths = ['100%', '83%', '68%', '91%', '74%', '58%'];
</script>

{#if shape === 'text'}
	<div class="sk-text-block" style="width:{width}">
		{#each Array(lines) as _, i}
			<div
				class="sk-base sk-anim-{animation} {cls}"
				style="
					width:{lineWidths[i % lineWidths.length]};
					height:0.8rem;
					border-radius:0.35rem;
					animation-delay:{delay + i * 60}ms;
				"
			></div>
		{/each}
	</div>
{:else if shape === 'circle'}
	<div
		class="sk-base sk-anim-{animation} {cls}"
		style="
			width:{width};
			height:{width};
			border-radius:9999px;
			flex-shrink:0;
			animation-delay:{delay}ms;
		"
	></div>
{:else}
	<div
		class="sk-base sk-anim-{animation} {cls}"
		style="
			width:{width};
			height:{height};
			border-radius:{radius};
			animation-delay:{delay}ms;
			{extraStyle}
		"
	></div>
{/if}

<style>
	.sk-base {
		background: var(--muted);
		position: relative;
		overflow: hidden;
		flex-shrink: 0;
	}

	.sk-text-block {
		display: flex;
		flex-direction: column;
		gap: 0.45rem;
	}

	/* ── SHIMMER ── */
	.sk-anim-shimmer::after {
		content: '';
		position: absolute;
		inset: 0;
		background: linear-gradient(
			90deg,
			transparent 0%,
			color-mix(in srgb, var(--foreground) 5%, transparent) 35%,
			color-mix(in srgb, var(--foreground) 12%, transparent) 50%,
			color-mix(in srgb, var(--foreground) 5%, transparent) 65%,
			transparent 100%
		);
		animation: sk-shimmer 2s linear infinite;
		transform: translateX(-100%);
	}
	@keyframes sk-shimmer {
		to { transform: translateX(250%); }
	}

	/* ── PULSE ── */
	.sk-anim-pulse {
		animation: sk-pulse 1.8s ease-in-out infinite;
	}
	@keyframes sk-pulse {
		0%, 100% { opacity: 1; }
		50%       { opacity: 0.35; }
	}

	/* ── WAVE ── */
	.sk-anim-wave {
		animation: sk-wave 1.6s ease-in-out infinite;
	}
	@keyframes sk-wave {
		0%, 100% { opacity: 1;    transform: scaleX(1);    }
		50%       { opacity: 0.45; transform: scaleX(0.97); }
	}

	/* ── BLINK ── */
	.sk-anim-blink {
		animation: sk-blink 1.2s step-start infinite;
	}
	@keyframes sk-blink {
		0%, 100% { opacity: 1; }
		50%       { opacity: 0.2; }
	}

	/* ── GLOW ── */
	.sk-anim-glow {
		animation: sk-glow 2s ease-in-out infinite;
	}
	@keyframes sk-glow {
		0%, 100% {
			background: var(--muted);
			box-shadow: none;
		}
		50% {
			background: color-mix(in srgb, var(--accent) 15%, var(--muted));
			box-shadow: 0 0 12px 2px color-mix(in srgb, var(--accent) 20%, transparent);
		}
	}
</style>
