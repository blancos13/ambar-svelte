<script lang="ts">
	import { onMount, tick } from 'svelte';
	import type { Snippet } from 'svelte';

	type Placement = 'bottom' | 'bottom-start' | 'bottom-end' | 'top' | 'top-start' | 'top-end';
	type Anim      = 'scale' | 'slide' | 'elastic' | 'bounce' | 'zoom';

	export type DropdownItem = {
		type?:     'item' | 'divider' | 'label';
		label?:    string;
		icon?:     Snippet;
		shortcut?: string;
		hint?:     string;
		danger?:   boolean;
		disabled?: boolean;
		children?: DropdownItem[];
		onclick?:  () => void;
	};

	type Props = {
		items:      DropdownItem[];
		placement?: Placement;
		animation?: Anim;
		offset?:    number;
		trigger:    Snippet<[{ toggle: () => void; open: boolean }]>;
	};

	let {
		items,
		placement = 'bottom-start',
		animation = 'scale',
		offset    = 6,
		trigger,
	}: Props = $props();

	let open      = $state(false);
	let closing   = $state(false);
	let mounted   = $state(false);
	let focusIdx  = $state(-1);
	let subIdx    = $state(-1);   // which item's submenu is open
	let subClose  = $state(false);

	let wrapEl:   HTMLSpanElement | undefined = $state();
	let menuEl:   HTMLDivElement  | undefined = $state();
	let portalEl: HTMLDivElement  | undefined = $state();

	// submenu item els for positioning
	let itemEls: (HTMLButtonElement | undefined)[] = $state([]);
	let subEl:   HTMLDivElement | undefined = $state();

	type Pos = { top: number; left: number; transformOrigin: string };
	let pos    = $state<Pos>({ top: -9999, left: -9999, transformOrigin: 'top left' });
	let subPos = $state<Pos>({ top: -9999, left: -9999, transformOrigin: 'top left' });

	onMount(() => { mounted = true; });

	$effect(() => {
		if (portalEl && mounted && portalEl.parentElement !== document.body)
			document.body.appendChild(portalEl);
	});
	$effect(() => () => {
		if (portalEl?.parentElement === document.body) document.body.removeChild(portalEl);
	});

	function calcPos() {
		if (!wrapEl || !menuEl) return;
		const r   = wrapEl.getBoundingClientRect();
		const vw  = window.innerWidth;
		const vh  = window.innerHeight;
		const mw  = menuEl.offsetWidth  || 200;
		const mh  = menuEl.offsetHeight || 100;
		const gap = offset;

		let side  = placement.split('-')[0] as 'top' | 'bottom';
		const align = (placement.split('-')[1] ?? 'start') as 'start' | 'end' | undefined;

		if (side === 'bottom' && r.bottom + gap + mh > vh && r.top - gap - mh > 0) side = 'top';
		else if (side === 'top' && r.top - gap - mh < 0) side = 'bottom';

		let top  = side === 'bottom' ? r.bottom + gap : r.top - gap - mh;
		let left = align === 'end' ? r.right - mw : r.left;

		left = Math.max(8, Math.min(left, vw - mw - 8));
		top  = Math.max(8, Math.min(top,  vh - mh - 8));

		const transformOrigin = `${side === 'bottom' ? 'top' : 'bottom'} ${align === 'end' ? 'right' : 'left'}`;
		pos = { top, left, transformOrigin };
	}

	async function calcSubPos(i: number) {
		await tick();
		if (!subEl || !itemEls[i]) return;
		const r   = itemEls[i]!.getBoundingClientRect();
		const vw  = window.innerWidth;
		const vh  = window.innerHeight;
		const sw  = subEl.offsetWidth  || 200;
		const sh  = subEl.offsetHeight || 100;
		const gap = 4;

		let left = r.right + gap;
		let top  = r.top;
		let origin = 'top left';

		if (left + sw > vw) { left = r.left - sw - gap; origin = 'top right'; }
		if (top + sh > vh)  { top  = Math.max(8, vh - sh - 8); }

		subPos = { top, left, transformOrigin: origin };
	}

	async function openMenu() {
		closing = false;
		focusIdx = -1;
		subIdx   = -1;
		pos = { top: -9999, left: -9999, transformOrigin: 'top left' };
		open = true;
		await tick();
		calcPos();
	}

	function closeMenu() {
		closing  = true;
		subIdx   = -1;
		setTimeout(() => { open = false; closing = false; focusIdx = -1; }, 160);
	}

	function toggle() { open ? closeMenu() : openMenu(); }

	async function openSub(i: number) {
		subClose = false;
		subIdx   = i;
		subPos   = { top: -9999, left: -9999, transformOrigin: 'top left' };
		await calcSubPos(i);
	}

	function closeSub() {
		subClose = true;
		setTimeout(() => {
			if (subClose) { subIdx = -1; subClose = false; }
		}, 120);
	}

	// keyboard nav — only top-level for now
	const selectableItems = $derived(
		items.map((it, i) => ({ it, i })).filter(({ it }) => it.type !== 'divider' && it.type !== 'label' && !it.disabled)
	);

	function onKeydown(e: KeyboardEvent) {
		if (!open) return;
		if (e.key === 'Escape') { e.preventDefault(); closeMenu(); return; }
		if (e.key === 'ArrowDown') {
			e.preventDefault();
			const cur = selectableItems.findIndex(s => s.i === focusIdx);
			focusIdx = selectableItems[(cur + 1) % selectableItems.length]?.i ?? -1;
		}
		if (e.key === 'ArrowUp') {
			e.preventDefault();
			const cur = selectableItems.findIndex(s => s.i === focusIdx);
			focusIdx = selectableItems[cur <= 0 ? selectableItems.length - 1 : cur - 1]?.i ?? -1;
		}
		if (e.key === 'Enter' && focusIdx >= 0) {
			e.preventDefault();
			const item = items[focusIdx];
			if (item?.children) { openSub(focusIdx); return; }
			if (item?.onclick)  { item.onclick(); closeMenu(); }
		}
	}
</script>

<svelte:window onkeydown={onKeydown} />

<span bind:this={wrapEl} style="display:inline-block;">
	{@render trigger({ toggle, open })}
</span>

<div bind:this={portalEl} style="display:contents;">
{#if open}
	<!-- backdrop -->
	<div
		role="presentation"
		class="fixed inset-0 z-[9998]"
		onmousedown={(e) => { if (e.target === e.currentTarget) closeMenu(); }}
	></div>

	<!-- main menu -->
	<div
		bind:this={menuEl}
		role="menu"
		class="dd-menu dd-anim-{animation} {closing ? 'dd-closing' : ''}"
		style:position="fixed"
		style:z-index="9999"
		style:top="{pos.top}px"
		style:left="{pos.left}px"
		style:transform-origin={pos.transformOrigin}
		onmousedown={(e) => e.stopPropagation()}
	>
		{#each items as item, i}
			{#if item.type === 'divider'}
				<div class="dd-divider"></div>
			{:else if item.type === 'label'}
				<div class="dd-section-label">{item.label}</div>
			{:else}
				<button
					type="button"
					role="menuitem"
					disabled={item.disabled}
					bind:this={itemEls[i]}
					class="dd-item {item.danger ? 'dd-danger' : ''} {focusIdx === i ? 'dd-focused' : ''}"
					onmouseenter={() => {
						focusIdx = i;
						if (item.children) openSub(i); else closeSub();
					}}
					onmouseleave={() => {
						if (!item.children) focusIdx = -1;
					}}
					onclick={() => {
						if (item.disabled) return;
						if (item.children) { openSub(i); return; }
						item.onclick?.();
						closeMenu();
					}}
				>
					{#if item.icon}
						<span class="dd-icon">{@render item.icon()}</span>
					{/if}
					<span class="dd-item-body">
						<span class="dd-label">{item.label}</span>
						{#if item.hint}
							<span class="dd-hint">{item.hint}</span>
						{/if}
					</span>
					{#if item.children}
						<svg class="dd-chevron-right" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>
					{:else if item.shortcut}
						<span class="dd-shortcut">{item.shortcut}</span>
					{/if}
				</button>
			{/if}
		{/each}
	</div>

	<!-- submenu -->
	{#if subIdx >= 0 && items[subIdx]?.children}
		<div
			bind:this={subEl}
			role="menu"
			class="dd-menu dd-anim-scale {subClose ? 'dd-closing' : ''}"
			style:position="fixed"
			style:z-index="10000"
			style:top="{subPos.top}px"
			style:left="{subPos.left}px"
			style:transform-origin={subPos.transformOrigin}
			onmouseenter={() => { subClose = false; }}
			onmouseleave={() => closeSub()}
			onmousedown={(e) => e.stopPropagation()}
		>
			{#each items[subIdx]!.children! as sub}
				{#if sub.type === 'divider'}
					<div class="dd-divider"></div>
				{:else if sub.type === 'label'}
					<div class="dd-section-label">{sub.label}</div>
				{:else}
					<button
						type="button"
						role="menuitem"
						disabled={sub.disabled}
						class="dd-item {sub.danger ? 'dd-danger' : ''}"
						onclick={() => {
							if (sub.disabled) return;
							sub.onclick?.();
							closeMenu();
						}}
					>
						{#if sub.icon}
							<span class="dd-icon">{@render sub.icon()}</span>
						{/if}
						<span class="dd-item-body">
							<span class="dd-label">{sub.label}</span>
							{#if sub.hint}<span class="dd-hint">{sub.hint}</span>{/if}
						</span>
						{#if sub.shortcut}
							<span class="dd-shortcut">{sub.shortcut}</span>
						{/if}
					</button>
				{/if}
			{/each}
		</div>
	{/if}
{/if}
</div>

<style>
	.dd-menu {
		background: var(--card);
		border: 1px solid var(--border);
		border-radius: 0.875rem;
		box-shadow: 0 16px 48px -8px rgba(0,0,0,0.24), 0 4px 12px -4px rgba(0,0,0,0.1);
		min-width: 200px;
		padding: 0.3rem;
		outline: none;
	}

	.dd-item {
		width: 100%;
		display: flex;
		align-items: center;
		gap: 0.625rem;
		padding: 0.5rem 0.625rem;
		border-radius: 0.55rem;
		background: transparent;
		border: none;
		cursor: pointer;
		text-align: left;
		transition: background 0.1s;
		color: var(--foreground);
	}
	.dd-item:disabled { opacity: 0.4; cursor: not-allowed; }
	.dd-item.dd-focused:not(:disabled),
	.dd-item:hover:not(:disabled) { background: var(--muted); }

	.dd-danger { color: var(--destructive); }
	.dd-danger.dd-focused,
	.dd-danger:hover:not(:disabled) { background: color-mix(in srgb, var(--destructive) 10%, transparent); }

	.dd-icon {
		display: flex;
		align-items: center;
		flex-shrink: 0;
		color: var(--muted-foreground);
	}
	.dd-danger .dd-icon { color: var(--destructive); }

	.dd-item-body {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 0.1rem;
		min-width: 0;
	}
	.dd-label   { font-size: 0.875rem; font-weight: 500; line-height: 1.3; }
	.dd-hint    { font-size: 0.7rem; color: var(--muted-foreground); line-height: 1.2; }
	.dd-danger .dd-hint { color: color-mix(in srgb, var(--destructive) 70%, transparent); }

	.dd-shortcut {
		font-size: 0.7rem;
		color: var(--muted-foreground);
		background: var(--muted);
		border: 1px solid var(--border);
		border-radius: 0.3rem;
		padding: 0.1rem 0.35rem;
		font-family: monospace;
		flex-shrink: 0;
		white-space: nowrap;
	}

	.dd-chevron-right {
		width: 0.875rem; height: 0.875rem;
		color: var(--muted-foreground);
		flex-shrink: 0;
	}

	.dd-divider      { height: 1px; background: var(--border); margin: 0.3rem 0; }
	.dd-section-label {
		font-size: 0.65rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--muted-foreground);
		padding: 0.5rem 0.625rem 0.2rem;
	}

	/* ── ANIMATIONS ── */
	.dd-anim-scale               { animation: dd-scale-in   0.18s cubic-bezier(0.34,1.56,0.64,1) both; }
	.dd-anim-scale.dd-closing    { animation: dd-scale-out  0.14s ease-in both; }
	.dd-anim-slide               { animation: dd-slide-in   0.2s  cubic-bezier(0.16,1,0.3,1) both; }
	.dd-anim-slide.dd-closing    { animation: dd-slide-out  0.14s ease-in both; }
	.dd-anim-elastic             { animation: dd-elastic-in 0.45s ease-out both; }
	.dd-anim-elastic.dd-closing  { animation: dd-scale-out  0.14s ease-in both; }
	.dd-anim-bounce              { animation: dd-bounce-in  0.45s cubic-bezier(0.34,1.56,0.64,1) both; }
	.dd-anim-bounce.dd-closing   { animation: dd-scale-out  0.14s ease-in both; }
	.dd-anim-zoom                { animation: dd-zoom-in    0.2s  cubic-bezier(0.16,1,0.3,1) both; }
	.dd-anim-zoom.dd-closing     { animation: dd-zoom-out   0.14s ease-in both; }

	@keyframes dd-scale-in   { from { opacity:0; transform:scale(0.88); } to { opacity:1; transform:scale(1); } }
	@keyframes dd-scale-out  { from { opacity:1; transform:scale(1);    } to { opacity:0; transform:scale(0.88); } }
	@keyframes dd-slide-in   { from { opacity:0; transform:translateY(-8px) scale(0.97); } to { opacity:1; transform:translateY(0) scale(1); } }
	@keyframes dd-slide-out  { from { opacity:1; transform:translateY(0);  } to { opacity:0; transform:translateY(-6px); } }
	@keyframes dd-elastic-in {
		0%   { opacity:0; transform:scale(0.5); }
		55%  { opacity:1; transform:scale(1.06); }
		75%  { transform:scale(0.97); }
		100% { transform:scale(1); }
	}
	@keyframes dd-bounce-in {
		0%   { opacity:0; transform:scale(0.4) translateY(-12px); }
		55%  { opacity:1; transform:scale(1.05) translateY(3px); }
		80%  { transform:scale(0.97) translateY(-1px); }
		100% { transform:scale(1) translateY(0); }
	}
	@keyframes dd-zoom-in  { from { opacity:0; transform:scale(0.7); } to { opacity:1; transform:scale(1); } }
	@keyframes dd-zoom-out { from { opacity:1; transform:scale(1);   } to { opacity:0; transform:scale(0.7); } }
</style>
