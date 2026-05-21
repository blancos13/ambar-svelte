<script lang="ts">
	import { onMount } from 'svelte';

	type Option = { value: string; label: string; icon?: string; disabled?: boolean; };
	type Group  = { group: string; options: Option[]; };
	type Anim   = 'slide' | 'scale' | 'elastic' | 'fade' | 'flip';

	type Props = {
		value?: string;
		options: (Option | Group)[];
		label?: string;
		placeholder?: string;
		hint?: string;
		error?: string;
		disabled?: boolean;
		searchable?: boolean;
		animation?: Anim;
		onvalue?: (v: string) => void;
	};

	let {
		value = $bindable(''),
		options,
		label,
		placeholder = 'Seç...',
		hint,
		error,
		disabled = false,
		searchable = false,
		animation = 'slide',
		onvalue,
	}: Props = $props();

	let open     = $state(false);
	let closing  = $state(false);
	let search   = $state('');
	let activeIdx = $state(-1);

	let triggerEl: HTMLButtonElement | undefined = $state();
	let searchEl:  HTMLInputElement  | undefined = $state();
	let portalEl:  HTMLDivElement    | undefined = $state();
	let mounted    = $state(false);

	/* Position state — supports both top-anchored and bottom-anchored */
	let pos = $state<{
		top?: number; bottom?: number;
		left: number; width: number; above: boolean;
	}>({ left: 0, width: 0, above: false });

	const hasError = $derived(!!error);

	function isGroup(item: Option | Group): item is Group { return 'group' in item; }

	let allOptions = $derived.by(() => {
		const flat: Option[] = [];
		for (const item of options) {
			if (isGroup(item)) flat.push(...item.options);
			else flat.push(item);
		}
		return flat;
	});

	let selected = $derived(allOptions.find(o => o.value === value));

	let filteredGroups = $derived.by(() => {
		const q = search.trim().toLowerCase();
		return options.map(item => {
			if (isGroup(item)) {
				const opts = q ? item.options.filter(o => o.label.toLowerCase().includes(q)) : item.options;
				return opts.length ? { ...item, options: opts } : null;
			}
			const opt = item as Option;
			return (!q || opt.label.toLowerCase().includes(q)) ? opt : null;
		}).filter(Boolean) as (Option | Group)[];
	});

	let flatFiltered = $derived.by(() => {
		const flat: Option[] = [];
		for (const item of filteredGroups) {
			if (isGroup(item)) flat.push(...item.options.filter(o => !o.disabled));
			else if (!item.disabled) flat.push(item);
		}
		return flat;
	});

	/* Portal */
	onMount(() => { mounted = true; });
	$effect(() => {
		if (portalEl && mounted && portalEl.parentElement !== document.body)
			document.body.appendChild(portalEl);
	});
	$effect(() => () => {
		if (portalEl?.parentElement === document.body) document.body.removeChild(portalEl);
	});

	function calcPos() {
		if (!triggerEl) return;
		const r = triggerEl.getBoundingClientRect();
		const spaceBelow = window.innerHeight - r.bottom;
		const above = spaceBelow < 260 && r.top > spaceBelow;
		if (above) {
			pos = { bottom: window.innerHeight - r.top + 4, left: r.left, width: r.width, above: true };
		} else {
			pos = { top: r.bottom + 4, left: r.left, width: r.width, above: false };
		}
	}

	function openDrop() {
		if (disabled) return;
		calcPos();
		closing = false;
		open = true;
		activeIdx = flatFiltered.findIndex(o => o.value === value);
		if (searchable) setTimeout(() => searchEl?.focus(), 30);
	}

	function closeDrop() {
		closing = true;
		setTimeout(() => { open = false; closing = false; search = ''; activeIdx = -1; }, 200);
	}

	function toggle() { open ? closeDrop() : openDrop(); }

	function pick(opt: Option) {
		if (opt.disabled) return;
		value = opt.value;
		onvalue?.(opt.value);
		closeDrop();
	}

	function onTriggerKey(e: KeyboardEvent) {
		if (['Enter', ' ', 'ArrowDown'].includes(e.key)) { e.preventDefault(); open ? closeDrop() : openDrop(); }
		else if (e.key === 'Escape' && open) { e.preventDefault(); closeDrop(); }
	}

	function onDropKey(e: KeyboardEvent) {
		if (e.key === 'Escape') { e.preventDefault(); closeDrop(); triggerEl?.focus(); }
		else if (e.key === 'ArrowDown') { e.preventDefault(); activeIdx = Math.min(activeIdx + 1, flatFiltered.length - 1); }
		else if (e.key === 'ArrowUp')   { e.preventDefault(); activeIdx = Math.max(activeIdx - 1, 0); }
		else if (e.key === 'Enter' && activeIdx >= 0) { e.preventDefault(); pick(flatFiltered[activeIdx]); }
	}
</script>

<div class="flex w-full flex-col gap-1.5 {disabled ? 'pointer-events-none opacity-50' : ''}">
	{#if label}
		<label class="pl-0.5 text-sm font-medium {hasError ? 'text-destructive' : 'text-muted-foreground'}">
			{label}
		</label>
	{/if}

	<button
		bind:this={triggerEl}
		type="button"
		class="
			flex h-12 w-full items-center gap-2 rounded-xl px-3 text-left
			transition-all duration-150 active:scale-[0.98]
			bg-muted hover:bg-[color-mix(in_srgb,var(--muted)_80%,var(--border))]
			{hasError ? 'shadow-[inset_0_0_0_1.5px_var(--destructive)]' : ''}
		"
		onclick={toggle}
		onkeydown={onTriggerKey}
		aria-haspopup="listbox"
		aria-expanded={open}
	>
		{#if selected?.icon}
			<span class="text-base leading-none">{selected.icon}</span>
		{/if}
		<span class="flex-1 truncate text-sm {selected ? 'text-foreground' : 'text-muted-foreground'}">
			{selected?.label ?? placeholder}
		</span>
		<svg
			class="size-4 shrink-0 text-muted-foreground transition-transform duration-200 {open ? 'rotate-180' : ''}"
			fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"
		><path d="M6 9l6 6 6-6"/></svg>
	</button>

	{#if error}
		<p class="pl-0.5 text-xs text-destructive">{error}</p>
	{:else if hint}
		<p class="pl-0.5 text-xs text-muted-foreground">{hint}</p>
	{/if}
</div>

<div bind:this={portalEl} style="display:contents;">
{#if open}
	<!-- Invisible backdrop to catch outside clicks -->
	<div class="fixed inset-0 z-[9998]" onmousedown={(e) => { if (e.target === e.currentTarget) closeDrop(); }}></div>

	<!-- Dropdown -->
	<div
		class="select-drop select-anim-{animation}"
		class:select-closing={closing}
		style:position="fixed"
		style:z-index="9999"
		style:top={pos.top != null ? pos.top + 'px' : 'auto'}
		style:bottom={pos.bottom != null ? pos.bottom + 'px' : 'auto'}
		style:left="{pos.left}px"
		style:width="{pos.width}px"
		style:transform-origin={pos.above ? 'bottom center' : 'top center'}
		role="listbox"
		onkeydown={onDropKey}
		onmousedown={(e) => e.stopPropagation()}
	>
		{#if searchable}
			<div class="border-b border-border px-2 py-2">
				<div class="flex items-center gap-2 rounded-lg bg-muted px-3 py-2">
					<svg class="size-3.5 shrink-0 text-muted-foreground" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
						<path d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"/>
					</svg>
					<input
						bind:this={searchEl}
						bind:value={search}
						type="text"
						placeholder="Ara..."
						class="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
					/>
				</div>
			</div>
		{/if}

		<div class="max-h-56 overflow-y-auto py-1">
			{#if flatFiltered.length === 0}
				<p class="px-4 py-3 text-sm text-muted-foreground">Sonuç bulunamadı.</p>
			{:else}
				{#each filteredGroups as item}
					{#if isGroup(item)}
						<p class="px-3 pb-1 pt-2.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
							{item.group}
						</p>
						{#each item.options as opt}
							{@const isActive = flatFiltered.indexOf(opt) === activeIdx}
							<button
								type="button"
								class="
									flex w-full items-center gap-2.5 rounded-lg px-2 py-2.5 mx-1 text-left text-sm
									transition-all duration-100 active:scale-[0.97]
									{opt.disabled ? 'cursor-default opacity-40' : 'cursor-pointer hover:bg-muted active:bg-border'}
									{opt.value === value ? 'font-semibold text-accent' : 'text-foreground'}
									{isActive && !opt.disabled ? 'bg-muted' : ''}
								"
								style:width="calc(100% - 0.5rem)"
								onclick={() => pick(opt)}
								role="option"
								aria-selected={opt.value === value}
							>
								{#if opt.icon}<span class="text-base leading-none">{opt.icon}</span>{/if}
								<span class="flex-1 truncate">{opt.label}</span>
								{#if opt.value === value}
									<svg class="size-4 shrink-0 text-accent" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
										<path d="M20 6L9 17l-5-5"/>
									</svg>
								{/if}
							</button>
						{/each}
					{:else}
						{@const isActive = flatFiltered.indexOf(item) === activeIdx}
						<button
							type="button"
							class="
								flex w-full items-center gap-2.5 rounded-lg px-2 py-2.5 mx-1 text-left text-sm
								transition-all duration-100 active:scale-[0.97]
								{item.disabled ? 'cursor-default opacity-40' : 'cursor-pointer hover:bg-muted active:bg-border'}
								{item.value === value ? 'font-semibold text-accent' : 'text-foreground'}
								{isActive && !item.disabled ? 'bg-muted' : ''}
							"
							style:width="calc(100% - 0.5rem)"
							onclick={() => pick(item)}
							role="option"
							aria-selected={item.value === value}
						>
							{#if item.icon}<span class="text-base leading-none">{item.icon}</span>{/if}
							<span class="flex-1 truncate">{item.label}</span>
							{#if item.value === value}
								<svg class="size-4 shrink-0 text-accent" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
									<path d="M20 6L9 17l-5-5"/>
								</svg>
							{/if}
						</button>
					{/if}
				{/each}
			{/if}
		</div>
	</div>
{/if}
</div>

<style>
	.select-drop {
		background: var(--card);
		border: 1px solid var(--border);
		border-radius: 1rem;
		box-shadow: 0 12px 40px -8px rgba(0,0,0,0.22), 0 2px 8px -2px rgba(0,0,0,0.1);
		overflow: hidden;
	}

	/* ── SLIDE ── */
	.select-anim-slide { animation: sel-slide-in 0.22s cubic-bezier(0.16,1,0.3,1) both; }
	.select-anim-slide.select-closing { animation: sel-slide-out 0.16s ease-in both; }

	/* ── SCALE ── */
	.select-anim-scale { animation: sel-scale-in 0.2s cubic-bezier(0.34,1.56,0.64,1) both; }
	.select-anim-scale.select-closing { animation: sel-scale-out 0.15s ease-in both; }

	/* ── ELASTIC ── */
	.select-anim-elastic { animation: sel-elastic-in 0.5s ease-out both; }
	.select-anim-elastic.select-closing { animation: sel-scale-out 0.18s ease-in both; }

	/* ── FADE ── */
	.select-anim-fade { animation: sel-fade-in 0.18s ease-out both; }
	.select-anim-fade.select-closing { animation: sel-fade-out 0.15s ease-in both; }

	/* ── FLIP ── */
	.select-anim-flip { animation: sel-flip-in 0.28s cubic-bezier(0.16,1,0.3,1) both; }
	.select-anim-flip.select-closing { animation: sel-flip-out 0.18s ease-in both; }

	@keyframes sel-slide-in  { from { opacity:0; transform:translateY(-10px); } to { opacity:1; transform:translateY(0); } }
	@keyframes sel-slide-out { from { opacity:1; transform:translateY(0); } to { opacity:0; transform:translateY(-10px); } }

	@keyframes sel-scale-in  { from { opacity:0; transform:scale(0.88); } to { opacity:1; transform:scale(1); } }
	@keyframes sel-scale-out { from { opacity:1; transform:scale(1); } to { opacity:0; transform:scale(0.88); } }

	@keyframes sel-elastic-in {
		0%   { opacity:0; transform:scale(0.5); }
		55%  { opacity:1; transform:scale(1.06); }
		75%  { transform:scale(0.97); }
		100% { transform:scale(1); }
	}

	@keyframes sel-fade-in  { from { opacity:0; } to { opacity:1; } }
	@keyframes sel-fade-out { from { opacity:1; } to { opacity:0; } }

	@keyframes sel-flip-in  { from { opacity:0; transform:perspective(600px) rotateX(-10deg) scale(0.95); } to { opacity:1; transform:perspective(600px) rotateX(0) scale(1); } }
	@keyframes sel-flip-out { from { opacity:1; transform:perspective(600px) rotateX(0); } to { opacity:0; transform:perspective(600px) rotateX(-10deg) scale(0.95); } }
</style>
