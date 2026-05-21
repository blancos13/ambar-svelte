<script lang="ts">
	export type BreadcrumbItem = {
		label:    string;
		href?:    string;
		icon?:    string;   // Heroicons SVG path, 24×24 viewBox
	};

	type Separator = 'slash' | 'chevron' | 'dot' | 'arrow';
	type Size      = 'sm' | 'md' | 'lg';
	type ItemStyle = 'plain' | 'soft' | 'pill';

	type Props = {
		items:       BreadcrumbItem[];
		separator?:  Separator;
		size?:       Size;
		itemStyle?:  ItemStyle;
		maxVisible?: number;         // collapse middle items beyond this count (0 = show all)
		class?:      string;
	};

	let {
		items,
		separator  = 'chevron',
		size       = 'md',
		itemStyle  = 'plain',
		maxVisible = 0,
		class: cls = '',
	}: Props = $props();

	/* ── collapse logic ── */
	let expanded = $state(false);

	const visible = $derived.by(() => {
		if (!maxVisible || expanded || items.length <= maxVisible) return items;
		// always show first and last, ellipsis in between
		const head = items.slice(0, 1);
		const tail = items.slice(-Math.max(1, maxVisible - 1));
		return [...head, null, ...tail] as (BreadcrumbItem | null)[];
	});

	/* ── size classes ── */
	const sizeMap: Record<Size, { text: string; icon: number; gap: string }> = {
		sm: { text: 'text-xs',   icon: 12, gap: 'gap-1'   },
		md: { text: 'text-sm',   icon: 14, gap: 'gap-1.5' },
		lg: { text: 'text-base', icon: 16, gap: 'gap-2'   },
	};
	const sz = $derived(sizeMap[size]);
</script>

<nav aria-label="breadcrumb" class="bc bc-style-{itemStyle} {sz.gap} {cls}">
	{#each visible as item, i}
		{@const isLast = i === visible.length - 1}

		<!-- separator (not before first) -->
		{#if i > 0}
			<span class="bc-sep" aria-hidden="true">
				{#if separator === 'chevron'}
					<svg width={sz.icon - 2} height={sz.icon - 2} viewBox="0 0 24 24" fill="none"
						stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
						<path d="M9 18l6-6-6-6"/>
					</svg>
				{:else if separator === 'slash'}
					<span class="bc-slash">/</span>
				{:else if separator === 'dot'}
					<span class="bc-dot"></span>
				{:else if separator === 'arrow'}
					<svg width={sz.icon - 2} height={sz.icon - 2} viewBox="0 0 24 24" fill="none"
						stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<path d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"/>
					</svg>
				{/if}
			</span>
		{/if}

		<!-- ellipsis button -->
		{#if item === null}
			<button
				type="button"
				class="bc-ellipsis {sz.text}"
				onclick={() => expanded = true}
				aria-label="Show all breadcrumbs"
			>
				<span>...</span>
			</button>

		<!-- breadcrumb item -->
		{:else}
			<span
				class="bc-item {sz.text}"
				class:bc-item-last={isLast}
				style="animation-delay: {i * 40}ms"
			>
				{#if item.icon}
					<svg width={sz.icon} height={sz.icon} viewBox="0 0 24 24" fill="none"
						stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"
						class="bc-icon" aria-hidden="true">
						<path d={item.icon}/>
					</svg>
				{/if}

				{#if item.href && !isLast}
					<a href={item.href} class="bc-link">{item.label}</a>
				{:else}
					<span class="bc-current" aria-current={isLast ? 'page' : undefined}>{item.label}</span>
				{/if}
			</span>
		{/if}
	{/each}
</nav>

<style>
	.bc {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
	}

	/* ── separator ── */
	.bc-sep {
		display: flex;
		align-items: center;
		color: var(--border);
		flex-shrink: 0;
		user-select: none;
	}
	.bc-slash {
		font-weight: 300;
		line-height: 1;
		opacity: 0.5;
	}
	.bc-dot {
		width: 3px;
		height: 3px;
		border-radius: 50%;
		background: var(--muted-foreground);
		opacity: 0.5;
	}

	/* ── item ── */
	.bc-item {
		display: inline-flex;
		align-items: center;
		gap: 5px;
		animation: bc-in 0.3s cubic-bezier(0.4, 0, 0.2, 1) both;
	}
	@keyframes bc-in {
		from { opacity: 0; transform: translateX(-4px); }
		to   { opacity: 1; transform: translateX(0); }
	}

	.bc-icon {
		flex-shrink: 0;
		opacity: 0.7;
	}

	/* link (non-current) */
	.bc-link {
		color: var(--muted-foreground);
		text-decoration: none;
		border-radius: 9999px;
		padding: 0.125rem 0.375rem;
		margin: -0.125rem -0.375rem;
		transition:
			color 0.12s,
			background 0.12s,
			box-shadow 0.12s,
			transform 0.1s var(--ease-out-expo);
		white-space: nowrap;
	}
	.bc-link:hover {
		color: var(--foreground);
		background: var(--muted);
	}
	.bc-link:active {
		transform: scale(0.94);
	}
	.bc-link:focus-visible,
	.bc-ellipsis:focus-visible {
		outline: none;
		box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 40%, transparent);
	}

	/* current (last) */
	.bc-current {
		color: var(--foreground);
		font-weight: 500;
		white-space: nowrap;
	}

	.bc-style-soft .bc-link,
	.bc-style-soft .bc-current {
		padding: 0.25rem 0.5rem;
		margin: -0.25rem -0.5rem;
		border-radius: 9999px;
	}

	.bc-style-soft .bc-link {
		background: color-mix(in srgb, var(--secondary) 65%, transparent);
	}

	.bc-style-soft .bc-current {
		background: var(--muted);
	}

	.bc-style-pill .bc-link,
	.bc-style-pill .bc-current {
		padding: 0.3125rem 0.625rem;
		margin: -0.3125rem -0.625rem;
		border-radius: 9999px;
	}

	.bc-style-pill .bc-link {
		background: var(--secondary);
		color: var(--secondary-foreground);
	}

	.bc-style-pill .bc-link:hover {
		background: var(--muted);
		color: var(--foreground);
	}

	.bc-style-pill .bc-current {
		background: var(--accent);
		color: var(--accent-foreground);
		font-weight: 700;
	}

	/* ── ellipsis ── */
	.bc-ellipsis {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		height: 20px;
		min-width: 28px;
		padding: 0 6px;
		border-radius: 5px;
		background: var(--muted);
		color: var(--muted-foreground);
		font-weight: 600;
		letter-spacing: 0.05em;
		line-height: 1;
		border: 0;
		transition: background 0.12s, color 0.12s, transform 0.12s, box-shadow 0.12s;
		cursor: pointer;
	}
	.bc-ellipsis:hover {
		background: color-mix(in srgb, var(--muted) 80%, var(--border));
		color: var(--foreground);
	}
	.bc-ellipsis:active { transform: scale(0.92); }
</style>
