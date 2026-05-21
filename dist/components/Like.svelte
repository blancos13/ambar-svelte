<script lang="ts">
	type Props = {
		liked?: boolean;
		count?: number;
		showCount?: boolean;
		size?: 'sm' | 'md' | 'lg';
		onchange?: (liked: boolean) => void;
	};

	let {
		liked    = $bindable(false),
		count    = $bindable(0),
		showCount = true,
		size     = 'md',
		onchange,
	}: Props = $props();

	let burst  = $state(false);
	let bounce = $state(false);

	const sizes = { sm: 'size-5', md: 'size-7', lg: 'size-9' };
	const textSizes = { sm: 'text-xs', md: 'text-sm', lg: 'text-base' };

	function toggle() {
		liked = !liked;
		count = liked ? count + 1 : count - 1;
		onchange?.(liked);

		if (liked) {
			burst  = false;
			bounce = false;
			requestAnimationFrame(() => {
				burst  = true;
				bounce = true;
			});
			setTimeout(() => { burst = false; }, 700);
			setTimeout(() => { bounce = false; }, 500);
		}
	}
</script>

<button
	type="button"
	class="group relative flex items-center gap-1.5 select-none outline-none"
	onclick={toggle}
	aria-label={liked ? 'Unlike' : 'Like'}
	aria-pressed={liked}
>
	<!-- Particles -->
	{#if burst}
		<span class="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" aria-hidden="true">
			{#each [0,1,2,3,4,5] as i}
				<span
					class="particle"
					style:--angle="{i * 60}deg"
					style:--c={['#ff4d6d','#ff6b6b','#ffd166','#ff9a3c','#ff6eb4','#c77dff'][i]}
				></span>
			{/each}
		</span>
	{/if}

	<!-- Heart -->
	<span class="relative flex items-center justify-center transition-transform duration-100 active:scale-90 {bounce ? 'heart-bounce' : ''}">
		<svg
			class="{sizes[size]} transition-all duration-200"
			viewBox="0 0 24 24"
			fill={liked ? 'currentColor' : 'none'}
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			style:color={liked ? '#ff4d6d' : 'var(--muted-foreground)'}
		>
			<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
		</svg>
	</span>

	<!-- Count -->
	{#if showCount}
		<span
			class="overflow-hidden {textSizes[size]} font-medium tabular-nums leading-none transition-colors duration-200"
			style:color={liked ? '#ff4d6d' : 'var(--muted-foreground)'}
		>
			{count.toLocaleString()}
		</span>
	{/if}
</button>

<style>
	.heart-bounce {
		animation: hb 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) both;
	}

	@keyframes hb {
		0%   { transform: scale(1); }
		30%  { transform: scale(1.5); }
		60%  { transform: scale(0.9); }
		100% { transform: scale(1); }
	}

	.particle {
		position: absolute;
		display: block;
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: var(--c);
		animation: particle-fly 0.6s ease-out both;
		transform-origin: center;
	}

	@keyframes particle-fly {
		0%   { transform: rotate(var(--angle)) translateY(0)   scale(1);   opacity: 1; }
		100% { transform: rotate(var(--angle)) translateY(-22px) scale(0); opacity: 0; }
	}
</style>
