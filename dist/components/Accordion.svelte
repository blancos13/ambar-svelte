<script lang="ts">
	import type { Snippet } from 'svelte';

	type Item = {
		value: string;
		title: string;
		hint?: string;
		icon?: Snippet;
		disabled?: boolean;
		children: Snippet;
	};

	type Variant = 'default' | 'card' | 'flush';
	type Anim    = 'smooth' | 'spring' | 'snappy' | 'elastic' | 'bounce';

	type Props = {
		items: Item[];
		multiple?: boolean;
		variant?: Variant;
		animation?: Anim;
		defaultOpen?: string[];
	};

	let {
		items,
		multiple    = false,
		variant     = 'default',
		animation   = 'smooth',
		defaultOpen = [],
	}: Props = $props();

	const easings: Record<Anim, string> = {
		smooth:  'cubic-bezier(0.16,1,0.3,1)',
		spring:  'cubic-bezier(0.34,1.56,0.64,1)',
		snappy:  'cubic-bezier(0.4,0,0.2,1)',
		elastic: 'cubic-bezier(0.68,-0.4,0.27,1.4)',
		bounce:  'cubic-bezier(0.34,1.8,0.64,1)',
	};
	const durations: Record<Anim, string> = {
		smooth: '0.28s', spring: '0.35s', snappy: '0.16s', elastic: '0.42s', bounce: '0.38s',
	};

	const bodyTransition = $derived(`grid-template-rows ${durations[animation]} ${easings[animation]}`);

	let open = $state<Set<string>>(new Set(defaultOpen));

	function toggle(value: string) {
		const next = new Set(open);
		if (next.has(value)) {
			next.delete(value);
		} else {
			if (!multiple) next.clear();
			next.add(value);
		}
		open = next;
	}
</script>

<div class="accordion accordion-{variant}">
	{#each items as item, i}
		{@const isOpen = open.has(item.value)}
		<div class="accordion-item {isOpen ? 'open' : ''} {item.disabled ? 'disabled' : ''}">

			<!-- Trigger -->
			<button
				type="button"
				class="accordion-trigger"
				disabled={item.disabled}
				aria-expanded={isOpen}
				onclick={() => toggle(item.value)}
			>
				<span class="accordion-trigger-left">
					{#if item.icon}
						{@render item.icon()}
					{/if}
					<span class="flex flex-col gap-0.5 text-left">
						<span class="accordion-title">{item.title}</span>
						{#if item.hint}
							<span class="accordion-hint">{item.hint}</span>
						{/if}
					</span>
				</span>
				<svg
					class="accordion-chevron {isOpen ? 'rotate-180' : ''}"
					viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
				><path d="M6 9l6 6 6-6"/></svg>
			</button>

			<!-- Content — grid trick for smooth height animation -->
			<div class="accordion-body" style:grid-template-rows={isOpen ? '1fr' : '0fr'} style:transition={bodyTransition}>
				<div class="accordion-inner">
					{@render item.children()}
				</div>
			</div>

		</div>
	{/each}
</div>

<style>
	/* ── DEFAULT ── */
	.accordion-default {
		border: 1px solid var(--border);
		border-radius: 1rem;
		overflow: hidden;
	}
	.accordion-default .accordion-item + .accordion-item {
		border-top: 1px solid var(--border);
	}

	/* ── CARD ── */
	.accordion-card { display: flex; flex-direction: column; gap: 0.5rem; }
	.accordion-card .accordion-item {
		border: 1px solid var(--border);
		border-radius: 1rem;
		overflow: hidden;
		background: var(--card);
	}

	/* ── FLUSH ── */
	.accordion-flush .accordion-item + .accordion-item {
		border-top: 1px solid var(--border);
	}

	/* ── TRIGGER ── */
	.accordion-trigger {
		width: 100%;
		display: flex; align-items: center; justify-content: space-between; gap: 1rem;
		padding: 1rem 1.25rem;
		background: transparent; border: none; cursor: pointer;
		transition: background 0.15s;
	}
	.accordion-trigger:hover:not(:disabled) { background: color-mix(in srgb, var(--muted) 60%, transparent); }
	.accordion-trigger:disabled { opacity: 0.45; cursor: not-allowed; }
	.accordion-item.open .accordion-trigger { background: color-mix(in srgb, var(--muted) 40%, transparent); }

	.accordion-trigger-left { display: flex; align-items: center; gap: 0.75rem; flex: 1; min-width: 0; }

	.accordion-title { font-size: 0.875rem; font-weight: 600; color: var(--foreground); line-height: 1.3; }
	.accordion-hint  { font-size: 0.75rem;  color: var(--muted-foreground); }

	.accordion-chevron {
		width: 1rem; height: 1rem; shrink: 0;
		color: var(--muted-foreground);
		transition: transform 0.25s cubic-bezier(0.16,1,0.3,1), color 0.15s;
		flex-shrink: 0;
	}
	.accordion-item.open .accordion-chevron { color: var(--accent); }

	/* ── BODY — grid trick ── */
	.accordion-body {
		display: grid;
	}
	.accordion-inner {
		overflow: hidden;
		font-size: 0.875rem;
		color: var(--muted-foreground);
		line-height: 1.6;
	}
	.accordion-inner > :global(*) {
		padding: 0 1.25rem 1.125rem;
	}
</style>
