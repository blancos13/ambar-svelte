<script lang="ts">
	import { flip } from 'svelte/animate';
	import { scale } from 'svelte/transition';
	import type { Snippet } from 'svelte';
	import { expoOut, quintOut } from 'svelte/easing';

	export type ListItem = {
		id: string | number;
		label: string;
		description?: string;
		disabled?: boolean;
	};

	type Variant = 'default' | 'soft' | 'card';
	type Density = 'compact' | 'default' | 'roomy';
	type Columns = 1 | 2 | 3 | 4;

	type Props = {
		items: ListItem[];
		variant?: Variant;
		density?: Density;
		columns?: Columns;
		animated?: boolean;
		onselect?: (item: ListItem) => void;
		children?: Snippet<[ListItem]>;
		class?: string;
	};

	let {
		items,
		variant = 'soft',
		density = 'default',
		columns = 1,
		animated = true,
		onselect,
		children,
		class: cls = '',
	}: Props = $props();

	const gridClass: Record<Columns, string> = {
		1: 'list-cols-1',
		2: 'list-cols-2',
		3: 'list-cols-3',
		4: 'list-cols-4',
	};
</script>

<div class="ui-list {gridClass[columns]} {cls}">
	{#each items as item (item.id)}
		<button
			type="button"
			animate:flip={{ duration: animated ? 300 : 0, easing: quintOut }}
			in:scale={{ duration: animated ? 180 : 0, start: 0.9, easing: expoOut }}
			out:scale={{ duration: animated ? 130 : 0, start: 0.9 }}
			class="ui-list-item ui-list-{variant} ui-list-{density}"
			disabled={item.disabled}
			onclick={() => onselect?.(item)}
		>
			{#if children}
				{@render children(item)}
			{:else}
				<span class="ui-list-label">{item.label}</span>
				{#if item.description}
					<span class="ui-list-description">{item.description}</span>
				{/if}
			{/if}
		</button>
	{/each}
</div>

<style>
	.ui-list {
		display: grid;
		gap: 0.75rem;
	}

	.list-cols-1 { grid-template-columns: minmax(0, 1fr); }
	.list-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
	.list-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
	.list-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }

	.ui-list-item {
		display: flex;
		min-width: 0;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		border: 0;
		border-radius: 0.875rem;
		color: var(--foreground);
		text-align: center;
		cursor: pointer;
		transition:
			background-color 0.15s ease,
			border-color 0.15s ease,
			color 0.15s ease,
			transform 0.1s var(--ease-out-expo);
	}

	.ui-list-item:active:not(:disabled) {
		transform: scale(0.96);
	}

	.ui-list-item:disabled {
		opacity: 0.45;
		cursor: not-allowed;
	}

	.ui-list-compact { padding: 0.75rem; }
	.ui-list-default { padding: 1rem; }
	.ui-list-roomy { padding: 1.25rem; }

	.ui-list-default {
		background: var(--card);
		box-shadow: inset 0 0 0 1px var(--border);
	}

	.ui-list-default:hover:not(:disabled) {
		background: var(--muted);
	}

	.ui-list-soft {
		background: var(--muted);
	}

	.ui-list-soft:hover:not(:disabled) {
		background: var(--secondary);
	}

	.ui-list-card {
		background: var(--card);
		box-shadow:
			inset 0 0 0 1px var(--border),
			0 1px 2px color-mix(in srgb, var(--foreground) 8%, transparent);
	}

	.ui-list-card:hover:not(:disabled) {
		background: var(--secondary);
		box-shadow:
			inset 0 0 0 1px var(--border),
			0 8px 18px color-mix(in srgb, var(--foreground) 10%, transparent);
	}

	.ui-list-label {
		font-size: 0.875rem;
		font-weight: 650;
		line-height: 1.3;
	}

	.ui-list-description {
		margin-top: 0.25rem;
		font-size: 0.75rem;
		color: var(--muted-foreground);
	}

	@media (max-width: 640px) {
		.list-cols-3,
		.list-cols-4 {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}
</style>
