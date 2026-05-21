<script lang="ts">
	import type { Snippet } from 'svelte';

	type Size   = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
	type Shape  = 'circle' | 'square';
	type Status = 'online' | 'away' | 'busy' | 'offline' | 'none';

	type Props = {
		src?:    string;
		name?:   string;
		size?:   Size;
		shape?:  Shape;
		status?: Status;
		class?:  string;
	};

	let {
		src,
		name   = '',
		size   = 'md',
		shape  = 'circle',
		status = 'none',
		class: cls = '',
	}: Props = $props();

	let imgError = $state(false);

	const sizes: Record<Size, { wrap: string; text: string; dot: string }> = {
		'xs':  { wrap: 'size-6',   text: 'text-[0.5rem]',  dot: 'size-1.5 bottom-0 right-0'       },
		'sm':  { wrap: 'size-8',   text: 'text-[0.65rem]', dot: 'size-2 bottom-0 right-0'         },
		'md':  { wrap: 'size-10',  text: 'text-sm',        dot: 'size-2.5 bottom-0.5 right-0.5'   },
		'lg':  { wrap: 'size-14',  text: 'text-base',      dot: 'size-3 bottom-0.5 right-0.5'     },
		'xl':  { wrap: 'size-20',  text: 'text-xl',        dot: 'size-3.5 bottom-1 right-1'       },
		'2xl': { wrap: 'size-28',  text: 'text-3xl',       dot: 'size-4 bottom-1 right-1'         },
	};

	const radii: Record<Shape, string> = {
		circle: 'rounded-full',
		square: 'rounded-[22%]',
	};

	const dotColors: Record<Status, string> = {
		online:  'bg-emerald-500',
		away:    'bg-amber-400',
		busy:    'bg-rose-500',
		offline: 'bg-muted-foreground/60',
		none:    '',
	};

	function initials(n: string) {
		const parts = n.trim().split(/\s+/);
		if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
		return n.slice(0, 2).toUpperCase();
	}

	function colorFromName(n: string) {
		const palette = [
			'bg-violet-500', 'bg-blue-500', 'bg-cyan-500', 'bg-teal-500',
			'bg-emerald-500', 'bg-amber-500', 'bg-orange-500', 'bg-rose-500',
			'bg-pink-500', 'bg-indigo-500',
		];
		let hash = 0;
		for (let i = 0; i < n.length; i++) hash = n.charCodeAt(i) + ((hash << 5) - hash);
		return palette[Math.abs(hash) % palette.length];
	}

	const showImg  = $derived(!!src && !imgError);
	const showInit = $derived(!showImg && !!name);
	const sz       = $derived(sizes[size]);
	const radius   = $derived(radii[shape]);
	const initColor = $derived(colorFromName(name));
</script>

<span class="av-wrap {sz.wrap} {cls}">

	{#if showImg}
		<img
			{src}
			alt={name || 'avatar'}
			class="av-img {radius}"
			onerror={() => (imgError = true)}
		/>
	{:else if showInit}
		<span class="av-initials {radius} {initColor} {sz.text}">
			{initials(name)}
		</span>
	{:else}
		<span class="av-icon {radius} {sz.text}">
			<svg viewBox="0 0 24 24" fill="currentColor" class="size-[55%] opacity-50">
				<path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
			</svg>
		</span>
	{/if}

	{#if status !== 'none'}
		<span class="av-dot {sz.dot} {dotColors[status]} {status === 'online' ? 'av-dot-pulse' : ''}"></span>
	{/if}

</span>

<style>
	.av-wrap {
		position: relative;
		display: inline-flex;
		flex-shrink: 0;
		animation: av-pop 0.3s cubic-bezier(0.34,1.56,0.64,1) both;
	}
	@keyframes av-pop {
		from { opacity: 0; transform: scale(0.6); }
		to   { opacity: 1; transform: scale(1); }
	}

	.av-wrap:hover .av-img,
	.av-wrap:hover .av-initials,
	.av-wrap:hover .av-icon {
		transform: scale(1.07);
	}

	.av-img {
		width: 100%; height: 100%;
		object-fit: cover;
		display: block;
		transition: transform 0.2s cubic-bezier(0.34,1.56,0.64,1);
	}

	.av-initials {
		width: 100%; height: 100%;
		display: flex; align-items: center; justify-content: center;
		font-weight: 700;
		color: #fff;
		letter-spacing: 0.03em;
		user-select: none;
		transition: transform 0.2s cubic-bezier(0.34,1.56,0.64,1);
	}

	.av-icon {
		width: 100%; height: 100%;
		display: flex; align-items: center; justify-content: center;
		background: var(--muted);
		color: var(--muted-foreground);
		transition: transform 0.2s cubic-bezier(0.34,1.56,0.64,1);
	}

	.av-dot {
		position: absolute;
		border-radius: 9999px;
		box-shadow: 0 0 0 2px var(--card);
	}

	.av-dot-pulse::after {
		content: '';
		position: absolute;
		inset: 0;
		border-radius: 9999px;
		background: inherit;
		animation: av-ping 1.8s ease-out infinite;
	}
	@keyframes av-ping {
		0%   { transform: scale(1);   opacity: 0.7; }
		70%  { transform: scale(2.2); opacity: 0;   }
		100% { transform: scale(2.2); opacity: 0;   }
	}
</style>
