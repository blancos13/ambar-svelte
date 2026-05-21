<script lang="ts">
	import Avatar from './Avatar.svelte';

	type Size  = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
	type Shape = 'circle' | 'square';

	type AvatarItem = {
		src?:  string;
		name?: string;
	};

	type Props = {
		avatars:  AvatarItem[];
		max?:     number;
		size?:    Size;
		shape?:   Shape;
		overlap?: 'sm' | 'md' | 'lg';
	};

	let {
		avatars,
		max     = 5,
		size    = 'md',
		shape   = 'circle',
		overlap = 'md',
	}: Props = $props();

	const offsets: Record<string, string> = {
		sm: '6px',
		md: '10px',
		lg: '16px',
	};

	const countSizes: Record<Size, string> = {
		'xs':  'size-6  text-[0.5rem]',
		'sm':  'size-8  text-[0.6rem]',
		'md':  'size-10 text-xs',
		'lg':  'size-14 text-sm',
		'xl':  'size-20 text-base',
		'2xl': 'size-28 text-xl',
	};

	const radii: Record<Shape, string> = {
		circle: 'rounded-full',
		square: 'rounded-[22%]',
	};

	const visible  = $derived(avatars.slice(0, max));
	const overflow = $derived(avatars.length - max);
	const offset   = $derived(offsets[overlap]);
</script>

<div class="flex items-center" style="padding-left:{offset}">
	{#each visible as av, i}
		<span
			class="ag-item {radii[shape]}"
			style="margin-left:-{offset}; z-index:{visible.length - i}; animation-delay:{i * 40}ms"
		>
			<Avatar src={av.src} name={av.name ?? ''} {size} {shape} />
		</span>
	{/each}

	{#if overflow > 0}
		<span
			class="ag-item ag-overflow {countSizes[size]} {radii[shape]}"
			style="margin-left:-{offset}; z-index:0; animation-delay:{visible.length * 40}ms"
		>
			+{overflow}
		</span>
	{/if}
</div>

<style>
	.ag-item {
		position: relative;
		display: inline-flex;
		flex-shrink: 0;
		padding: 2px;
		background: var(--card);
		animation: ag-pop 0.35s cubic-bezier(0.34,1.56,0.64,1) both;
	}

	@keyframes ag-pop {
		from { opacity: 0; transform: scale(0.5) translateX(-6px); }
		to   { opacity: 1; transform: scale(1)   translateX(0);    }
	}

	.ag-overflow {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		background: var(--muted);
		color: var(--muted-foreground);
		font-weight: 700;
		user-select: none;
		padding: 0;
		outline: 2px solid var(--card);
	}
</style>
