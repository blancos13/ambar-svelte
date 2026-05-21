<script lang="ts">
	import { onMount, tick } from 'svelte';
	import type { Snippet } from 'svelte';

	export type SearchItem = {
		id:           string | number;
		label:        string;
		description?: string;
		category?:    string;
		icon?:        Snippet;
		badge?:       string;
		href?:        string;
	};

	type Size = 'sm' | 'md' | 'lg';

	type Props = {
		value?:       string;
		placeholder?: string;
		size?:        Size;
		items?:       SearchItem[];
		loading?:     boolean;
		debounce?:    number;
		maxRecent?:   number;
		recentKey?:   string;
		command?:     boolean;
		shortcut?:    string;
		emptyText?:   string;
		expandable?:  boolean;
		onSearch?:    (q: string) => void;
		onSelect?:    (item: SearchItem) => void;
	};

	let {
		value       = $bindable(''),
		placeholder = 'Ara...',
		size        = 'md',
		items       = [],
		loading     = false,
		debounce    = 280,
		maxRecent   = 6,
		recentKey   = '__sr_recent',
		command     = false,
		shortcut    = '⌘K',
		emptyText   = 'Sonuç bulunamadı',
		expandable  = false,
		onSearch,
		onSelect,
	}: Props = $props();

	/* ── SIZE MAPS ── */
	const heights: Record<Size, string> = { sm: 'h-9',    md: 'h-12',   lg: 'h-14'    };
	const iconSz:  Record<Size, string> = { sm: 'size-3.5', md: 'size-4', lg: 'size-5' };
	const textSz:  Record<Size, string> = { sm: 'text-xs', md: 'text-sm', lg: 'text-sm' };
	const collW:   Record<Size, string> = { sm: '2.25rem', md: '3rem',   lg: '3.5rem'  };

	/* ── STATE ── */
	let focused   = $state(false);
	let open      = $state(false);
	let closing   = $state(false);
	let focusIdx  = $state(-1);
	let recent    = $state<string[]>([]);
	let expanded  = $state(!expandable);

	let inputEl:  HTMLInputElement | undefined = $state();
	let wrapEl:   HTMLDivElement   | undefined = $state();
	let dropEl:   HTMLDivElement   | undefined = $state();
	let portalEl: HTMLDivElement   | undefined = $state();
	let mounted   = $state(false);

	let debTimer: ReturnType<typeof setTimeout>;

	type Pos = { top: number; left: number; width: number };
	let pos = $state<Pos>({ top: -9999, left: -9999, width: 320 });

	const collapsed = $derived(expandable && !expanded);

	/* ── PORTAL ── */
	onMount(() => {
		mounted = true;
		try { recent = JSON.parse(localStorage.getItem(recentKey) ?? '[]'); } catch {}
	});
	$effect(() => {
		if (portalEl && mounted && portalEl.parentElement !== document.body)
			document.body.appendChild(portalEl);
	});
	$effect(() => () => {
		if (portalEl?.parentElement === document.body) document.body.removeChild(portalEl);
	});

	/* ── POSITION ── */
	async function calcPos() {
		await tick();
		if (!wrapEl || !dropEl) return;
		const r  = wrapEl.getBoundingClientRect();
		const vh = window.innerHeight;
		const dh = dropEl.offsetHeight || 320;
		let top = r.bottom + 4;
		if (top + dh > vh - 8 && r.top - 6 - dh > 8) top = r.top - 6 - dh;
		pos = { top, left: r.left, width: r.width };
	}

	/* ── OPEN / CLOSE ── */
	async function openDrop() {
		if (open) { calcPos(); return; }
		closing = false; focusIdx = -1;
		pos = { top: -9999, left: -9999, width: 320 };
		open = true;
		await calcPos();
	}

	function closeDrop() {
		if (!open) return;
		closing = true;
		setTimeout(() => { open = false; closing = false; focusIdx = -1; }, 180);
	}

	function shouldOpen() {
		return value.trim() || recent.length > 0;
	}

	/* ── EXPANDABLE ── */
	function handleWrapClick() {
		if (expandable && !expanded) {
			expanded = true;
			tick().then(() => {
				inputEl?.focus();
				if (shouldOpen()) openDrop();
			});
		}
	}

	/* ── INPUT ── */
	function handleInput() {
		clearTimeout(debTimer);
		debTimer = setTimeout(() => onSearch?.(value), debounce);
		if (shouldOpen()) openDrop(); else closeDrop();
	}

	/* ── RECENT ── */
	function saveRecent(q: string) {
		if (!q.trim()) return;
		const next = [q, ...recent.filter(r => r !== q)].slice(0, maxRecent);
		recent = next;
		try { localStorage.setItem(recentKey, JSON.stringify(next)); } catch {}
	}
	function removeRecent(q: string, e: MouseEvent) {
		e.stopPropagation();
		recent = recent.filter(r => r !== q);
		try { localStorage.setItem(recentKey, JSON.stringify(recent)); } catch {}
		if (!recent.length && !value) closeDrop();
	}
	function clearRecent() {
		recent = [];
		try { localStorage.removeItem(recentKey); } catch {}
		if (!value) closeDrop();
	}

	/* ── SELECT ── */
	function selectItem(item: SearchItem) {
		value = item.label;
		saveRecent(item.label);
		closeDrop();
		onSelect?.(item);
		if (item.href) window.location.href = item.href;
	}
	function selectRecent(q: string) {
		value = q;
		onSearch?.(q);
		closeDrop();
	}

	/* ── GROUPED ── */
	const grouped = $derived.by(() => {
		const m = new Map<string, SearchItem[]>();
		for (const it of items) {
			const c = it.category ?? '';
			if (!m.has(c)) m.set(c, []);
			m.get(c)!.push(it);
		}
		return [...m.entries()];
	});

	const navItems = $derived(value ? items : recent.map((r, i) => ({ id: `r${i}`, label: r })));

	/* ── KEYBOARD ── */
	function onKeydown(e: KeyboardEvent) {
		if (command && (e.metaKey || e.ctrlKey) && e.key === 'k') {
			e.preventDefault();
			if (expandable && !expanded) {
				expanded = true;
				tick().then(() => { inputEl?.focus(); openDrop(); });
			} else {
				inputEl?.focus(); openDrop();
			}
			return;
		}
		if (!open) return;
		if (e.key === 'Escape') {
			e.preventDefault();
			closeDrop();
			if (expandable && !value) expanded = false;
			inputEl?.blur();
			return;
		}
		if (e.key === 'ArrowDown') { e.preventDefault(); focusIdx = (focusIdx + 1) % navItems.length; }
		if (e.key === 'ArrowUp')   { e.preventDefault(); focusIdx = focusIdx <= 0 ? navItems.length - 1 : focusIdx - 1; }
		if (e.key === 'Enter' && focusIdx >= 0) {
			e.preventDefault();
			const it = navItems[focusIdx];
			if (!it) return;
			if (value) selectItem(it as SearchItem);
			else selectRecent(it.label);
		} else if (e.key === 'Enter' && value) {
			saveRecent(value); closeDrop(); onSearch?.(value);
		}
	}

	/* ── HIGHLIGHT ── */
	function hl(text: string, q: string) {
		if (!q.trim()) return text;
		const i = text.toLowerCase().indexOf(q.toLowerCase());
		if (i === -1) return text;
		return text.slice(0, i)
			+ `<mark class="sr-hl">${text.slice(i, i + q.length)}</mark>`
			+ text.slice(i + q.length);
	}
</script>

<svelte:window onkeydown={onKeydown} />

<!-- ── INPUT WRAPPER ── -->
<div
	bind:this={wrapEl}
	class="{expandable ? 'sr-exp-wrap' : 'w-full'} {expandable && expanded ? 'sr-exp-open' : ''}"
	style:width={collapsed ? collW[size] : undefined}
	onclick={handleWrapClick}
>
	<div class="
		flex {heights[size]} w-full items-center transition-all duration-200
		{collapsed ? 'justify-center px-0 rounded-xl cursor-pointer' : 'gap-2 px-3 rounded-xl cursor-text'}
		{focused
			? 'bg-card shadow-[inset_0_0_0_1.5px_var(--accent)]'
			: 'bg-muted hover:bg-[color-mix(in_srgb,var(--muted)_80%,var(--border))]'}
	">

		<!-- search / spinner icon -->
		{#if loading}
			<span class="sr-spinner {size === 'sm' ? 'sr-spinner-sm' : ''} shrink-0"></span>
		{:else}
			<svg
				class="{iconSz[size]} shrink-0 transition-colors duration-150 {focused ? 'text-accent' : 'text-muted-foreground'}"
				viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
			>
				<circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
			</svg>
		{/if}

		<!-- input — hidden when collapsed -->
		{#if !collapsed}
			<input
				bind:this={inputEl}
				type="search"
				bind:value
				{placeholder}
				autocomplete="off"
				spellcheck="false"
				class="min-w-0 flex-1 bg-transparent {textSz[size]} text-foreground outline-none placeholder:text-muted-foreground [&::-webkit-search-cancel-button]:hidden {expandable ? 'sr-input-fade' : ''}"
				onfocus={() => { focused = true; if (shouldOpen()) openDrop(); }}
				onblur={() => {
					focused = false;
					if (expandable && !value.trim()) {
						setTimeout(() => { expanded = false; closeDrop(); }, 150);
					}
				}}
				oninput={handleInput}
			/>

			<!-- shortcut badge -->
			{#if command && !value && !focused}
				<kbd class="sr-kbd shrink-0">{shortcut}</kbd>
			{/if}

			<!-- clear -->
			{#if value}
				<button
					type="button"
					tabindex="-1"
					class="flex size-6 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-border hover:text-foreground active:scale-90"
					onclick={() => { value = ''; onSearch?.(''); inputEl?.focus(); if (!recent.length) closeDrop(); }}
				>
					<svg class="size-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
						<path d="M6 18L18 6M6 6l12 12"/>
					</svg>
				</button>
			{/if}
		{/if}

	</div>
</div>

<!-- ── PORTAL DROPDOWN ── -->
<div bind:this={portalEl} style="display:contents;">
{#if open}
	<div
		role="presentation"
		class="fixed inset-0 z-[9998]"
		onmousedown={(e) => { if (e.target === e.currentTarget) closeDrop(); }}
	></div>

	<div
		bind:this={dropEl}
		role="listbox"
		class="sr-drop {closing ? 'sr-out' : 'sr-in'}"
		style:position="fixed"
		style:z-index="9999"
		style:top="{pos.top}px"
		style:left="{pos.left}px"
		style:width="{pos.width}px"
		onmousedown={(e) => e.stopPropagation()}
	>

		<!-- RECENT -->
		{#if !value && recent.length > 0}
			<div class="sr-section-row">
				<span class="sr-section-label">Son Aramalar</span>
				<button type="button" class="sr-action-link" onclick={clearRecent}>Temizle</button>
			</div>
			{#each recent as q, i}
				<div
					role="option"
					aria-selected={focusIdx === i}
					class="sr-item {focusIdx === i ? 'sr-item-active' : ''}"
					style="animation-delay:{i * 30}ms"
					onmouseenter={() => (focusIdx = i)}
					onclick={() => selectRecent(q)}
				>
					<svg class="sr-item-icon text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
					</svg>
					<span class="sr-item-text">{q}</span>
					<span
						role="button"
						tabindex="-1"
						class="sr-remove"
						onmousedown={(e) => removeRecent(q, e)}
					>
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="size-3">
							<path d="M6 18L18 6M6 6l12 12"/>
						</svg>
					</span>
				</div>
			{/each}

		<!-- LOADING -->
		{:else if value && loading}
			<div class="sr-loading">
				<span class="sr-dot"></span>
				<span class="sr-dot" style="animation-delay:.15s"></span>
				<span class="sr-dot" style="animation-delay:.3s"></span>
			</div>

		<!-- EMPTY -->
		{:else if value && !loading && items.length === 0}
			<div class="sr-empty">
				<svg class="size-8 mb-2 text-border" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
					<circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
				</svg>
				<p class="text-sm font-medium text-foreground">{emptyText}</p>
				<p class="text-xs text-muted-foreground mt-0.5">"{value}" için sonuç yok</p>
			</div>

		<!-- RESULTS -->
		{:else if value && items.length > 0}
			{#each grouped as [cat, catItems], gi}
				{#if cat}
					<div class="sr-section-label px-3 pt-2 pb-1">{cat}</div>
				{/if}
				{#each catItems as item}
					{@const idx = items.indexOf(item)}
					<div
						role="option"
						aria-selected={focusIdx === idx}
						class="sr-item {focusIdx === idx ? 'sr-item-active' : ''}"
						style="animation-delay:{idx * 25}ms"
						onmouseenter={() => (focusIdx = idx)}
						onclick={() => selectItem(item)}
					>
						{#if item.icon}
							<span class="sr-item-icon-wrap">{@render item.icon()}</span>
						{:else}
							<svg class="sr-item-icon text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
								<circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
							</svg>
						{/if}
						<span class="sr-item-body">
							<span class="sr-item-text">{@html hl(item.label, value)}</span>
							{#if item.description}
								<span class="sr-item-desc">{item.description}</span>
							{/if}
						</span>
						{#if item.badge}
							<span class="sr-badge">{item.badge}</span>
						{/if}
						<svg class="size-3.5 text-muted-foreground/40 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m9 18 6-6-6-6"/></svg>
					</div>
				{/each}
				{#if gi < grouped.length - 1}
					<div class="mx-3 my-1 h-px bg-border"></div>
				{/if}
			{/each}
		{/if}

	</div>
{/if}
</div>

<style>
	/* ── spinner ── */
	.sr-spinner {
		width: 1rem; height: 1rem;
		border: 2px solid var(--border);
		border-top-color: var(--accent);
		border-radius: 50%;
		animation: sr-spin 0.65s linear infinite;
	}
	.sr-spinner-sm { width: 0.875rem; height: 0.875rem; }
	@keyframes sr-spin { to { transform: rotate(360deg); } }

	/* ── kbd hint ── */
	.sr-kbd {
		font-size: 0.65rem; font-family: monospace;
		color: var(--muted-foreground);
		background: var(--card);
		border: 1px solid var(--border);
		border-radius: 0.35rem;
		padding: 0.15rem 0.4rem;
		pointer-events: none;
	}

	/* ── expandable wrapper ── */
	.sr-exp-wrap {
		overflow: hidden;
		border-radius: 0.75rem;
		flex-shrink: 0;
		transition: width 0.38s cubic-bezier(0.34,1.56,0.64,1);
	}
	.sr-exp-wrap.sr-exp-open {
		width: 100%;
	}

	/* input fade-in when expandable opens */
	.sr-input-fade {
		animation: sr-fade-in 0.18s ease 0.16s both;
	}
	@keyframes sr-fade-in {
		from { opacity: 0; }
		to   { opacity: 1; }
	}

	/* ── dropdown ── */
	.sr-drop {
		background: var(--card);
		border-radius: 0.875rem;
		box-shadow: 0 8px 28px -4px rgba(0,0,0,0.18), 0 2px 8px -2px rgba(0,0,0,0.08);
		padding: 0.25rem;
		max-height: 400px;
		overflow-y: auto;
		overflow-x: hidden;
		scrollbar-width: thin;
	}
	.sr-in  { animation: sr-drop-in  0.14s ease both; }
	.sr-out { animation: sr-drop-out 0.1s ease-in both; }
	@keyframes sr-drop-in  {
		from { opacity: 0; transform: translateY(-6px); }
		to   { opacity: 1; transform: translateY(0); }
	}
	@keyframes sr-drop-out {
		from { opacity: 1; transform: translateY(0); }
		to   { opacity: 0; transform: translateY(-4px); }
	}

	/* ── section header ── */
	.sr-section-row {
		display: flex; align-items: center; justify-content: space-between;
		padding: 0.35rem 0.75rem 0.15rem;
	}
	.sr-section-label {
		display: block;
		font-size: 0.65rem; font-weight: 700;
		text-transform: uppercase; letter-spacing: 0.08em;
		color: var(--muted-foreground);
	}
	.sr-action-link {
		font-size: 0.72rem; font-weight: 500;
		color: var(--accent); background: none; border: none; cursor: pointer;
		padding: 0.15rem 0.3rem; border-radius: 0.3rem;
		transition: background 0.1s;
	}
	.sr-action-link:hover { background: color-mix(in srgb, var(--accent) 10%, transparent); }

	/* ── items ── */
	.sr-item {
		display: flex; align-items: center; gap: 0.625rem;
		padding: 0.5rem 0.625rem;
		border-radius: 0.625rem;
		cursor: pointer;
		transition: background 0.1s;
		animation: sr-item-in 0.12s ease both;
	}
	@keyframes sr-item-in {
		from { opacity: 0; transform: translateY(4px); }
		to   { opacity: 1; transform: translateY(0); }
	}
	.sr-item:hover, .sr-item-active { background: var(--muted); }

	.sr-item-icon      { width: 1.125rem; height: 1.125rem; flex-shrink: 0; }
	.sr-item-icon-wrap { display: flex; align-items: center; flex-shrink: 0; }

	.sr-item-body {
		flex: 1; display: flex; flex-direction: column;
		gap: 0.1rem; min-width: 0;
	}
	.sr-item-text {
		font-size: 0.875rem; font-weight: 500;
		color: var(--foreground); line-height: 1.3;
		white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
	}
	.sr-item-desc {
		font-size: 0.72rem; color: var(--muted-foreground);
		white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
	}

	.sr-remove {
		display: flex; align-items: center; justify-content: center;
		width: 1.5rem; height: 1.5rem; flex-shrink: 0;
		border-radius: 50%;
		color: var(--muted-foreground);
		opacity: 0; cursor: pointer;
		transition: opacity 0.15s, background 0.1s;
	}
	.sr-item:hover .sr-remove { opacity: 1; }
	.sr-remove:hover { background: var(--border); color: var(--foreground); }

	.sr-badge {
		font-size: 0.65rem; font-weight: 700;
		background: color-mix(in srgb, var(--accent) 15%, transparent);
		color: var(--accent);
		padding: 0.15rem 0.5rem; border-radius: 9999px; flex-shrink: 0;
		letter-spacing: 0.02em;
	}

	/* ── loading dots ── */
	.sr-loading {
		display: flex; align-items: center; justify-content: center;
		gap: 0.35rem; padding: 2rem;
	}
	.sr-dot {
		width: 0.5rem; height: 0.5rem; border-radius: 50%;
		background: var(--accent);
		animation: sr-bounce 1s ease-in-out infinite;
	}
	@keyframes sr-bounce {
		0%, 80%, 100% { transform: scale(0.5); opacity: 0.3; }
		40%            { transform: scale(1);   opacity: 1;   }
	}

	/* ── empty ── */
	.sr-empty {
		display: flex; flex-direction: column; align-items: center;
		padding: 2.5rem 1rem; text-align: center;
	}

	/* ── highlight ── */
	:global(.sr-hl) {
		background: color-mix(in srgb, var(--accent) 18%, transparent);
		color: var(--accent);
		border-radius: 0.2rem; padding: 0 0.05rem;
		font-style: normal;
	}
</style>
