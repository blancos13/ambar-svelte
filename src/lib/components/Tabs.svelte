<script lang="ts">
	import { tick } from 'svelte';

	type Tab     = { value: string; label: string; icon?: string; disabled?: boolean; };
	type Variant = 'line' | 'pill' | 'card';
	type Anim    = 'spring' | 'smooth' | 'snappy' | 'elastic' | 'bounce';

	type Props = {
		value?: string;
		tabs: Tab[];
		variant?: Variant;
		animation?: Anim;
		fullWidth?: boolean;
		vertical?: boolean;
		onchange?: (v: string) => void;
	};

	let {
		value     = $bindable(''),
		tabs,
		variant   = 'line',
		animation = 'smooth',
		fullWidth = false,
		vertical  = false,
		onchange,
	}: Props = $props();

	const easings: Record<Anim, string> = {
		spring:  'cubic-bezier(0.34, 1.56, 0.64, 1)',
		smooth:  'cubic-bezier(0.16, 1, 0.3, 1)',
		snappy:  'cubic-bezier(0.4, 0, 0.2, 1)',
		elastic: 'cubic-bezier(0.68, -0.55, 0.27, 1.55)',
		bounce:  'cubic-bezier(0.34, 1.9, 0.64, 1)',
	};
	const durations: Record<Anim, string> = {
		spring: '0.3s', smooth: '0.25s', snappy: '0.15s', elastic: '0.4s', bounce: '0.35s',
	};

	let listEl: HTMLDivElement | undefined = $state();
	let indicatorStyle = $state('');

	async function moveIndicator(target?: HTMLButtonElement) {
		if (!listEl) return;
		const btn = target ?? listEl.querySelector<HTMLButtonElement>(`[data-value="${value}"]`);
		if (!btn) return;
		const lr   = listEl.getBoundingClientRect();
		const br   = btn.getBoundingClientRect();
		const ease = easings[animation];
		const dur  = durations[animation];

		if (vertical) {
			indicatorStyle = [
				`height:${br.height}px`,
				`transform:translateY(${br.top - lr.top}px)`,
				`transition:transform ${dur} ${ease},height ${dur} ${ease}`,
			].join(';');
		} else {
			indicatorStyle = [
				`width:${br.width}px`,
				`transform:translateX(${br.left - lr.left}px)`,
				`transition:transform ${dur} ${ease},width ${dur} ${ease}`,
			].join(';');
		}
	}

	$effect(() => { if (value && listEl) tick().then(() => moveIndicator()); });
	$effect(() => { if (listEl) tick().then(() => moveIndicator()); });

	function select(tab: Tab, btn: HTMLButtonElement) {
		if (tab.disabled || tab.value === value) return;
		value = tab.value;
		onchange?.(tab.value);
		moveIndicator(btn);
	}
</script>

<div
	class="tabs-root tabs-{variant} {vertical ? 'tabs-vertical' : ''} {fullWidth ? (vertical ? 'h-full' : 'w-full') : (vertical ? 'h-fit' : 'w-fit')}"
	bind:this={listEl}
	role="tablist"
	aria-orientation={vertical ? 'vertical' : 'horizontal'}
>
	{#if variant === 'line'}
		<div class="indicator-line" style={indicatorStyle}></div>
	{:else if variant === 'pill'}
		<div class="indicator-pill" style={indicatorStyle}></div>
	{/if}

	{#each tabs as tab}
		<button
			type="button"
			role="tab"
			data-value={tab.value}
			aria-selected={tab.value === value}
			aria-disabled={tab.disabled}
			disabled={tab.disabled}
			class="tab-btn tab-btn-{variant}
				{tab.value === value ? 'active' : ''}
				{tab.disabled ? 'disabled' : ''}
				{!vertical && fullWidth ? 'flex-1 justify-center' : ''}
				{vertical && fullWidth ? 'w-full' : ''}"
			onclick={(e) => select(tab, e.currentTarget)}
		>
			{#if tab.icon}{@html tab.icon}{/if}
			<span>{tab.label}</span>
			{#if tab.disabled}
				<svg class="size-3 opacity-50 ml-auto shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
				</svg>
			{/if}
		</button>
	{/each}
</div>

<style>
	.tabs-root {
		position: relative;
		display: inline-flex;
		align-items: center;
	}
	.tabs-vertical {
		flex-direction: column;
		align-items: stretch;
	}

	/* ── LINE ── */
	.tabs-line { border-bottom: 1.5px solid var(--border); gap: 0; }
	.tabs-line.tabs-vertical { border-bottom: none; border-right: 1.5px solid var(--border); }

	.tab-btn-line {
		position: relative; z-index: 1;
		padding: 0.625rem 1.25rem;
		font-size: 0.875rem; font-weight: 500;
		color: var(--muted-foreground);
		background: transparent; border: none; cursor: pointer;
		transition: color 0.15s; white-space: nowrap;
		display: inline-flex; align-items: center; gap: 0.375rem;
	}
	.tabs-vertical .tab-btn-line { padding: 0.625rem 1.5rem 0.625rem 1rem; }
	.tab-btn-line:hover:not(.disabled) { color: var(--foreground); }
	.tab-btn-line.active               { color: var(--foreground); font-weight: 600; }
	.tab-btn-line.disabled             { opacity: 0.4; cursor: not-allowed; }

	.indicator-line {
		position: absolute; left: 0; bottom: -1.5px;
		height: 2.5px; background: var(--accent); border-radius: 2px;
	}
	.tabs-vertical .indicator-line {
		bottom: auto; right: -1.5px; left: auto; top: 0;
		height: auto; width: 2.5px;
	}

	/* ── PILL ── */
	.tabs-pill { background: var(--muted); border-radius: 999px; padding: 3px; gap: 0; }
	.tabs-pill.tabs-vertical { border-radius: 1rem; }

	.tab-btn-pill {
		position: relative; z-index: 1;
		padding: 0.5rem 1.25rem;
		font-size: 0.875rem; font-weight: 500;
		color: var(--muted-foreground);
		background: transparent; border: none; border-radius: 999px; cursor: pointer;
		transition: color 0.2s; white-space: nowrap;
		display: inline-flex; align-items: center; gap: 0.375rem;
	}
	.tabs-vertical .tab-btn-pill { border-radius: 0.75rem; padding: 0.625rem 1.25rem; }
	.tab-btn-pill:hover:not(.disabled) { color: var(--foreground); }
	.tab-btn-pill.active               { color: var(--foreground); font-weight: 600; }
	.tab-btn-pill.disabled             { opacity: 0.4; cursor: not-allowed; }

	.indicator-pill {
		position: absolute; top: 3px; bottom: 3px; left: 0;
		background: var(--card); border-radius: 999px;
		box-shadow: 0 1px 4px rgba(0,0,0,0.12);
	}
	.tabs-vertical .indicator-pill {
		top: 0; bottom: auto; left: 3px; right: 3px;
		border-radius: 0.75rem;
	}

	/* ── CARD ── */
	.tabs-card { background: var(--muted); border-radius: 0.875rem; padding: 4px; gap: 2px; }

	.tab-btn-card {
		position: relative;
		padding: 0.5rem 1.125rem;
		font-size: 0.875rem; font-weight: 500;
		color: var(--muted-foreground);
		background: transparent; border: none; border-radius: 0.625rem; cursor: pointer;
		transition: color 0.15s, background 0.15s; white-space: nowrap;
		display: inline-flex; align-items: center; gap: 0.375rem;
	}
	.tab-btn-card:hover:not(.disabled) { background: color-mix(in srgb, var(--card) 60%, transparent); color: var(--foreground); }
	.tab-btn-card.active               { background: var(--card); color: var(--foreground); font-weight: 600; box-shadow: 0 1px 4px rgba(0,0,0,0.10); }
	.tab-btn-card.disabled             { opacity: 0.4; cursor: not-allowed; }

	.tab-btn:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; border-radius: 0.375rem; }
</style>
