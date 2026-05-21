<script lang="ts">
	import { onMount, tick, untrack } from 'svelte';
	import { fade } from 'svelte/transition';
	import type { Snippet } from 'svelte';

	export type NavItem = {
		id:        string;
		label:     string;
		icon?:     string;          // Heroicons SVG path, viewBox 0 0 24 24 (optional)
		href?:     string;
		badge?:    string | number;
		disabled?: boolean;
		children?: NavItem[];
	};

	export type NavSection = {
		title?: string;
		items:  NavItem[];
	};

	/**
	 * variant      — shell appearance
	 *   default    : card bg + right border
	 *   floating   : card bg + shadow, no border
	 *   inset      : transparent bg, no border (embed inside a layout)
	 *
	 * itemStyle    — nav item visual treatment
	 *   default    : accent tint bg + accent text when active
	 *   filled     : solid accent bg + accent-foreground text when active (bold)
	 *   ghost      : accent text only, no background — minimal
	 */
	type Variant = 'default' | 'floating' | 'inset';
	type ItemStyle = 'default' | 'filled' | 'outline' | 'ghost';
	type ActiveIndicator = 'bar' | 'track' | 'none';
	type AnimationMode = 'smooth' | 'snappy' | 'calm' | 'none';
	type ViewportMode = 'auto' | 'desktop' | 'mobile';
	type Collapsible = 'icon' | 'offcanvas' | 'none';

	type Props = {
		sections:   NavSection[];
		active?:    string;
		collapsed?: boolean;
		open?:      boolean;
		width?:     number;
		variant?:   Variant;
		itemStyle?: ItemStyle;
		activeIndicator?: ActiveIndicator;
		animation?: AnimationMode;
		mode?: ViewportMode;
		collapsible?: Collapsible;
		mobileContained?: boolean;
		hideHeader?: boolean;
		header?:    Snippet<[{ collapsed: boolean }]>;
		footer?:    Snippet<[{ collapsed: boolean }]>;
		onselect?:  (id: string) => void;
		class?:     string;
	};

	let {
		sections,
		active     = $bindable<string | undefined>(undefined),
		collapsed  = $bindable(false),
		open       = $bindable(false),
		width      = 240,
		variant    = 'default',
		itemStyle  = 'default',
		activeIndicator = 'bar',
		animation = 'smooth',
		mode = 'auto',
		collapsible = 'icon',
		mobileContained = false,
		hideHeader = false,
		header,
		footer,
		onselect,
		class: cls = '',
	}: Props = $props();

	let autoMobile = $state(false);
	let navEl: HTMLElement | undefined = $state();
	let trackTop = $state(0);
	let trackHeight = $state(0);
	let trackVisible = $state(false);
	onMount(() => {
		const mq = window.matchMedia('(max-width: 768px)');
		autoMobile = mq.matches;
		const h = (e: MediaQueryListEvent) => { autoMobile = e.matches; };
		mq.addEventListener('change', h);
		return () => mq.removeEventListener('change', h);
	});

	const isMobile = $derived(mode === 'mobile' || (mode === 'auto' && autoMobile));
	const isCollapsed = $derived(collapsed && !isMobile && collapsible === 'icon');
	const isOffcanvas = $derived(collapsed && !isMobile && collapsible === 'offcanvas');

	let expanded = $state<Record<string, boolean>>({});

	function toggleExpand(id: string) {
		expanded = { ...expanded, [id]: !expanded[id] };
	}

	function select(item: NavItem) {
		if (item.disabled) return;
		if (item.children?.length) {
			if (collapsed) collapsed = false;
			toggleExpand(item.id);
			return;
		}
		active = item.id;
		onselect?.(item.id);
		open = false;
	}

	function hasActiveChild(item: NavItem): boolean {
		return item.children?.some(c => c.id === active || hasActiveChild(c)) ?? false;
	}

	$effect(() => {
		const cur = active;
		if (!cur) return;
		untrack(() => {
			let changed = false;
			const next = { ...expanded };
			for (const s of sections)
				for (const item of s.items)
					if (hasActiveChild(item) && !next[item.id]) {
						next[item.id] = true;
						changed = true;
					}
			if (changed) expanded = next;
		});
	});

	function toggleCollapse() {
		if (collapsible === 'none') return;
		if (!collapsed) expanded = {};
		collapsed = !collapsed;
	}

	function isActive(item: NavItem) { return active === item.id; }

	async function syncTrack(target?: HTMLElement | null) {
		if (activeIndicator !== 'track' || !navEl) return;
		await tick();

		const item = target ?? navEl.querySelector<HTMLElement>('.sb-item-active, .sb-child-active');
		if (!item) {
			trackVisible = false;
			return;
		}

		trackTop = item.offsetTop;
		trackHeight = item.offsetHeight;
		trackVisible = true;
	}

	function showTrack(event: MouseEvent | FocusEvent) {
		void syncTrack(event.currentTarget as HTMLElement);
	}

	function restoreTrack() {
		void syncTrack();
	}

	$effect(() => {
		active;
		expanded;
		isCollapsed;
		isOffcanvas;
		activeIndicator;
		animation;
		collapsible;

		if (activeIndicator === 'track') {
			untrack(() => {
				void syncTrack();
			});
		} else {
			trackVisible = false;
		}
	});
</script>

{#if isMobile && open}
	<button
		type="button"
		class="sb-backdrop"
		class:sb-backdrop-contained={mobileContained}
		aria-label="Close sidebar"
		onclick={() => (open = false)}
		transition:fade={{ duration: 180 }}
	></button>
{/if}

<aside
	class="sb sb-v-{variant} sb-is-{itemStyle} sb-ai-{activeIndicator} sb-anim-{animation} {cls}"
	class:sb-collapsible-none={collapsible === 'none'}
	class:sb-collapsed={isCollapsed}
	class:sb-offcanvas-collapsed={isOffcanvas}
	class:sb-mobile-mode={isMobile}
	class:sb-mobile-contained={isMobile && mobileContained}
	class:sb-mobile-open={isMobile && open}
	style:--sb-width="{width}px"
>
	<!-- Header (can be hidden for embedded/docs usage) -->
	{#if !hideHeader}
	<div class="sb-header">
		{#if header}
			{@render header({ collapsed: isCollapsed })}
		{:else}
			<span class="sb-logo-box">A</span>
			<span class="sb-fade" style="margin-left:10px; font-weight:700; font-size:14px; color:var(--foreground); white-space:nowrap;">Ambar</span>
		{/if}
	</div>
	{/if}

	<!-- Nav -->
	<nav bind:this={navEl} class="sb-nav" onmouseleave={restoreTrack}>
		{#if activeIndicator === 'track'}
			<span
				class="sb-track"
				class:sb-track-visible={trackVisible}
				style={`height:${trackHeight}px; transform:translateY(${trackTop}px);`}
			></span>
		{/if}

		{#each sections as section, si}
			{#if si > 0}
				<div class="sb-divider"></div>
			{/if}

			{#if section.title}
				<div class="sb-section-title">
					<span class="sb-fade">{section.title}</span>
				</div>
			{/if}

			{#each section.items as item}
				{@const _act     = isActive(item)}
				{@const _hasKids = !!item.children?.length}
				{@const _open    = !!expanded[item.id]}
				{@const _anyKid  = hasActiveChild(item)}

				<a
					href={item.href ?? '#'}
					class="sb-item"
					class:sb-item-active={_act || (_anyKid && !_open)}
					class:sb-item-disabled={item.disabled}
					onclick={(e) => {
						if (!item.href || item.href === '#') e.preventDefault();
						select(item);
					}}
					onmouseenter={showTrack}
					onfocus={showTrack}
					onblur={restoreTrack}
					aria-label={item.label}
				>
					<!-- icon (optional) — flex-grow animates 0→1 when content collapses -->
					{#if item.icon}
					<span class="sb-icon">
						<svg width="18" height="18" viewBox="0 0 24 24" fill="none"
							stroke="currentColor" stroke-width="1.8"
							stroke-linecap="round" stroke-linejoin="round">
							<path d={item.icon}/>
						</svg>
					</span>
					{/if}

					<span class="sb-content" class:sb-content-no-icon={!item.icon}>
						<span class="sb-item-label">{item.label}</span>
						{#if item.badge !== undefined}
							<span class="sb-badge" class:sb-badge-live={item.badge === 'LIVE'}>{item.badge}</span>
						{/if}
						{#if _hasKids}
							<svg class="sb-chevron" class:sb-chevron-open={_open}
								width="13" height="13" viewBox="0 0 24 24" fill="none"
								stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
								<path d="M9 18l6-6-6-6"/>
							</svg>
						{/if}
					</span>

					<span class="sb-tooltip">{item.label}</span>
				</a>

				{#if _hasKids}
					<div class="sb-children" class:sb-children-open={_open && !isCollapsed}>
						<div>
							{#each item.children! as child}
								{@const _ca = isActive(child)}
								<a
									href={child.href ?? '#'}
									class="sb-child"
									class:sb-child-active={_ca}
									class:sb-item-disabled={child.disabled}
									onclick={(e) => {
										if (!child.href || child.href === '#') e.preventDefault();
										select(child);
									}}
									onmouseenter={showTrack}
									onfocus={showTrack}
									onblur={restoreTrack}
								>
									<span class="sb-child-line" class:sb-child-line-active={_ca}></span>
									<span class="sb-child-label">{child.label}</span>
									{#if child.badge !== undefined}
										<span class="sb-badge" style="margin-left:auto">{child.badge}</span>
									{/if}
								</a>
							{/each}
						</div>
					</div>
				{/if}
			{/each}
		{/each}
	</nav>

	<!-- Footer -->
	<div class="sb-footer">
		{#if footer}
			<div class="sb-footer-slot">
				{@render footer({ collapsed: isCollapsed })}
			</div>
		{/if}

		<!-- Collapse toggle — always last item, hidden on mobile -->
		<button class="sb-item sb-collapse-btn" onclick={toggleCollapse}
			aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
			<span class="sb-icon">
				<svg class="sb-collapse-icon" width="17" height="17" viewBox="0 0 24 24"
					fill="none" stroke="currentColor" stroke-width="1.8"
					stroke-linecap="round" stroke-linejoin="round">
					<rect x="3" y="3" width="18" height="18" rx="2"/>
					<path d="M9 3v18"/>
				</svg>
			</span>
			<span class="sb-content">
				<span class="sb-item-label">Collapse</span>
			</span>
		</button>
	</div>
</aside>

<style>
	/* ─────────────────────────────────────────
	   BACKDROP
	───────────────────────────────────────── */
	.sb-backdrop {
		position: fixed; inset: 0;
		padding: 0;
		border: 0;
		background: rgba(0,0,0,0.45);
		z-index: 49;
		animation: sb-fade-in var(--sb-pop) ease both;
	}
	.sb-backdrop-contained {
		position: absolute;
	}
	@keyframes sb-fade-in { from { opacity:0 } to { opacity:1 } }

	/* ─────────────────────────────────────────
	   SHELL
	───────────────────────────────────────── */
	.sb {
		--sb-width: 240px;
		--sb-cw: 64px;       /* collapsed width */
		--sb-pad: 6px;
		--sb-ih: 38px;       /* item height */
		--sb-ir: 10px;       /* item border-radius */
		--sb-dur: 0.3s;
		--sb-fast: 0.14s;
		--sb-pop: 0.24s;
		--sb-ease: cubic-bezier(0.4, 0, 0.2, 1);
		--sb-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
		--sb-mobile-dur: 0.34s;
		--sb-mobile-ease: cubic-bezier(0.2, 0.88, 0.18, 1);

		display: flex;
		flex-direction: column;
		height: 100%;
		width: var(--sb-width);
		background: var(--card);
		overflow: hidden;
		flex-shrink: 0;
		transition:
			width var(--sb-dur) var(--sb-ease),
			margin-left var(--sb-dur) var(--sb-ease),
			transform var(--sb-dur) var(--sb-ease),
			opacity var(--sb-fast) ease;
	}
	.sb.sb-collapsed { width: var(--sb-cw); }
	.sb.sb-offcanvas-collapsed {
		margin-left: calc(var(--sb-width) * -1);
		opacity: 0;
		pointer-events: none;
		transform: translate3d(-14px, 0, 0);
	}

	.sb-anim-snappy {
		--sb-dur: 0.18s;
		--sb-fast: 0.1s;
		--sb-pop: 0.16s;
		--sb-ease: cubic-bezier(0.16, 1, 0.3, 1);
		--sb-spring: cubic-bezier(0.2, 0.9, 0.2, 1.15);
	}
	.sb-anim-calm {
		--sb-dur: 0.42s;
		--sb-fast: 0.2s;
		--sb-pop: 0.32s;
		--sb-ease: cubic-bezier(0.22, 1, 0.36, 1);
		--sb-spring: cubic-bezier(0.22, 1, 0.36, 1);
	}
	.sb-anim-none {
		--sb-dur: 1ms;
		--sb-fast: 1ms;
		--sb-pop: 1ms;
		--sb-ease: linear;
		--sb-spring: linear;
	}

	/* variant: default — right border */
	.sb.sb-v-default  { border-right: 1px solid var(--border); }

	/* variant: floating — shadow, no border */
	.sb.sb-v-floating {
		box-shadow: 4px 0 24px rgba(0,0,0,0.08);
		border-right: none;
	}

	/* variant: inset — transparent, no border */
	.sb.sb-v-inset {
		background: transparent;
		border-right: none;
	}

	/* mobile overlay */
	.sb.sb-mobile-mode {
		position: fixed; top: 0; left: 0;
		height: 100dvh; z-index: 50;
		width: var(--sb-width) !important;
		transform: translate3d(calc(-100% - 18px), 0, 0);
		transition:
			transform var(--sb-mobile-dur) var(--sb-mobile-ease),
			box-shadow var(--sb-mobile-dur) ease;
		box-shadow: 0 0 0 rgba(0,0,0,0);
		will-change: transform;
	}
	.sb.sb-mobile-contained {
		position: absolute;
		height: 100%;
		width: var(--sb-width) !important;
	}
	.sb.sb-mobile-open {
		transform: translate3d(0, 0, 0);
		box-shadow: 18px 0 54px rgba(0,0,0,0.28);
	}
	.sb.sb-mobile-mode .sb-header,
	.sb.sb-mobile-mode .sb-nav,
	.sb.sb-mobile-mode .sb-footer {
		transition:
			opacity var(--sb-mobile-dur) ease,
			transform var(--sb-mobile-dur) var(--sb-mobile-ease);
	}
	.sb.sb-mobile-mode:not(.sb-mobile-open) .sb-header,
	.sb.sb-mobile-mode:not(.sb-mobile-open) .sb-nav,
	.sb.sb-mobile-mode:not(.sb-mobile-open) .sb-footer {
		opacity: 0.82;
		transform: translate3d(-10px, 0, 0);
	}
	.sb.sb-mobile-mode .sb-collapse-btn { display: none; }
	.sb.sb-collapsible-none .sb-collapse-btn { display: none; }

	/* ─────────────────────────────────────────
	   HEADER
	   padding: 0 18px — centres the 28 px logo
	   in the 64 px collapsed width: (64−28)/2 = 18
	───────────────────────────────────────── */
	.sb-header {
		display: flex;
		align-items: center;
		min-height: 56px;
		padding: 0 18px;
		gap: 0;
		border-bottom: 1px solid var(--border);
		flex-shrink: 0;
		overflow: hidden;
	}
	.sb-v-inset .sb-header { border-bottom-color: transparent; }

	.sb-logo-box {
		display: flex; align-items: center; justify-content: center;
		min-width: 28px; width: 28px; height: 28px;
		border-radius: 8px;
		background: var(--accent); color: var(--accent-foreground);
		font-weight: 800; font-size: 13px;
		flex-shrink: 0;
	}

	/* ─────────────────────────────────────────
	   sb-fade — GLOBAL utility class
	   Add class="sb-fade" to any snippet content
	   to get smooth collapse animation.
	   The .sb-collapsed ancestor drives the state.
	───────────────────────────────────────── */
	:global(.sb-fade) {
		opacity: 1;
		max-width: 200px;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		transition:
			opacity     var(--sb-fast) ease,
			max-width   var(--sb-dur) var(--sb-ease),
			margin-left var(--sb-dur) var(--sb-ease);
	}
	:global(.sb-collapsed .sb-fade) {
		opacity: 0;
		max-width: 0;
		margin-left: 0 !important;
		pointer-events: none;
	}

	/* ─────────────────────────────────────────
	   NAV
	───────────────────────────────────────── */
	.sb-nav {
		position: relative;
		flex: 1;
		padding: var(--sb-pad);
		overflow-y: auto;
		overflow-x: hidden;
		scrollbar-width: thin;
		scrollbar-color: var(--border) transparent;
	}

	.sb-track {
		position: absolute;
		left: var(--sb-pad);
		top: 0;
		z-index: 2;
		width: 3px;
		border-radius: 9999px;
		background: var(--accent);
		opacity: 0;
		pointer-events: none;
		transition:
			transform var(--sb-pop) var(--sb-ease),
			height    var(--sb-pop) var(--sb-ease),
			opacity   var(--sb-fast) ease;
	}
	.sb-track-visible { opacity: 1; }

	.sb-divider {
		height: 1px;
		background: var(--border);
		margin: 4px 6px;
		opacity: 0.5;
	}

	.sb-section-title {
		display: flex; align-items: center;
		height: 30px; padding: 0 10px;
		overflow: hidden;
	}
	.sb-section-title .sb-fade {
		font-size: 10px; font-weight: 700;
		letter-spacing: 0.08em; text-transform: uppercase;
		color: var(--muted-foreground);
	}

	/* ─────────────────────────────────────────
	   NAV ITEM
	   Icon centering: .sb-icon has flex-grow:0
	   When collapsed, flex-grow transitions to 1 —
	   the icon fills the item and justify-content:center
	   pins the SVG perfectly. No padding math needed.
	───────────────────────────────────────── */
	.sb-item {
		position: relative;
		display: flex;
		align-items: center;
		height: var(--sb-ih);
		width: 100%;
		border-radius: var(--sb-ir);
		color: var(--muted-foreground);
		text-decoration: none;
		cursor: pointer;
		user-select: none;
		padding: 0;
		transition:
			background var(--sb-fast) ease,
			color      var(--sb-fast) ease,
			transform  var(--sb-fast) var(--sb-spring);
	}
	.sb-item:hover   { background: var(--muted); color: var(--foreground); }
	.sb-item:active  { transform: scale(0.96); }
	.sb-item-disabled { pointer-events: none; opacity: 0.38; }

	/* ── item styles ─────────────────────────── */

	/* default: accent tint + accent text */
	.sb-is-default .sb-item-active {
		background: color-mix(in srgb, var(--accent) 13%, transparent);
		color: var(--accent);
		font-weight: 600;
	}
	.sb-is-default .sb-item-active:hover {
		background: color-mix(in srgb, var(--accent) 18%, transparent);
	}
	@keyframes sb-bar {
		from { transform: scaleY(0); opacity: 0; }
		to   { transform: scaleY(1); opacity: 1; }
	}

	/* filled: solid accent background (btn-primary style) */
	.sb-is-filled .sb-item-active {
		background: var(--accent);
		color: var(--accent-foreground);
		font-weight: 600;
	}
	.sb-is-filled .sb-item-active:hover {
		background: color-mix(in srgb, var(--accent) 88%, black);
		color: var(--accent-foreground);
	}

	/* outline: button-like border with quiet fill */
	.sb-is-outline .sb-item-active {
		background: transparent;
		box-shadow: inset 0 0 0 1.5px color-mix(in srgb, var(--accent) 70%, transparent);
		color: var(--accent);
		font-weight: 600;
	}
	.sb-is-outline .sb-item-active:hover {
		background: color-mix(in srgb, var(--accent) 9%, transparent);
	}

	/* ghost: text color only, no background */
	.sb-is-ghost .sb-item-active {
		background: transparent;
		color: var(--accent);
		font-weight: 600;
	}
	.sb-is-ghost .sb-item:hover { background: transparent; }

	/* active indicator: left rail */
	.sb-ai-bar .sb-item-active::before {
		content: '';
		position: absolute;
		left: 0; top: 7px; bottom: 7px;
		width: 3px;
		border-radius: 0 3px 3px 0;
		background: var(--accent);
		animation: sb-bar var(--sb-pop) var(--sb-spring) both;
	}

	/* ─────────────────────────────────────────
	   ICON
	   flex-grow: 0 (expanded) → 1 (collapsed)
	   Combined with justify-content: center on
	   the icon box, the SVG is always centered
	   once content collapses to zero.
	───────────────────────────────────────── */
	.sb-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		min-width: 40px;
		width: 40px;
		height: 100%;
		flex-shrink: 0;
		flex-grow: 0;
		position: relative;
		transition: flex-grow var(--sb-dur) var(--sb-ease);
	}
	.sb-icon svg { position: relative; z-index: 1; }
	.sb.sb-collapsed .sb-icon {
		flex-grow: 1;
	}

	/* ─────────────────────────────────────────
	   COLLAPSIBLE CONTENT
	───────────────────────────────────────── */
	.sb-content {
		display: flex; align-items: center; gap: 6px;
		flex: 1; min-width: 0;
		padding-right: 10px;
		max-width: 200px; opacity: 1;
		overflow: hidden;
		transition:
			max-width var(--sb-dur) var(--sb-ease),
			opacity   var(--sb-fast) ease,
			padding   var(--sb-dur) var(--sb-ease);
	}
	.sb.sb-collapsed .sb-content {
		max-width: 0; opacity: 0;
		padding-right: 0;
		pointer-events: none;
	}

	/* When no icon, add left padding so text isn't flush with the edge */
	.sb-content-no-icon { padding-left: 10px; }

	.sb-item-label {
		flex: 1;
		font-size: 13.5px; font-weight: inherit;
		white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
		color: inherit;
	}

	/* ─────────────────────────────────────────
	   BADGE
	───────────────────────────────────────── */
	.sb-badge {
		display: inline-flex; align-items: center; justify-content: center;
		min-width: 18px; height: 18px; padding: 0 5px;
		border-radius: 99px;
		background: var(--accent); color: var(--accent-foreground);
		font-size: 10px; font-weight: 700;
		flex-shrink: 0; line-height: 1;
		animation: sb-badge-pop var(--sb-pop) var(--sb-spring) both;
	}
	@keyframes sb-badge-pop {
		from { transform: scale(0); opacity: 0; }
		to   { transform: scale(1); opacity: 1; }
	}

	.sb-badge-live {
		animation: sb-badge-pop var(--sb-pop) var(--sb-spring) both,
		           sb-live-pulse 2.2s ease-in-out 0.4s infinite;
		letter-spacing: 0.04em;
	}
	@keyframes sb-live-pulse {
		0%, 100% { box-shadow: 0 0 0 0 color-mix(in srgb, var(--accent) 60%, transparent); opacity: 1; }
		50%       { box-shadow: 0 0 0 4px color-mix(in srgb, var(--accent) 0%, transparent); opacity: 0.82; }
	}

	/* ─────────────────────────────────────────
	   CHEVRON
	───────────────────────────────────────── */
	.sb-chevron {
		flex-shrink: 0; color: var(--muted-foreground);
		transition: transform var(--sb-pop) var(--sb-spring);
	}
	.sb-chevron-open { transform: rotate(90deg); }

	/* ─────────────────────────────────────────
	   TOOLTIP (collapsed hover label)
	───────────────────────────────────────── */
	.sb-tooltip {
		position: absolute;
		left: calc(100% + 12px); top: 50%;
		transform: translateY(-50%) translateX(-4px);
		padding: 5px 10px; border-radius: 8px;
		background: var(--foreground); color: var(--background);
		font-size: 12px; font-weight: 500; white-space: nowrap;
		opacity: 0; pointer-events: none; z-index: 200;
		transition: opacity var(--sb-fast) ease, transform var(--sb-fast) ease;
		box-shadow: 0 4px 20px rgba(0,0,0,0.15);
	}
	.sb.sb-collapsed .sb-item:hover .sb-tooltip {
		opacity: 1;
		transform: translateY(-50%) translateX(0);
	}

	/* ─────────────────────────────────────────
	   NESTED CHILDREN
	───────────────────────────────────────── */
	.sb-children {
		display: grid; grid-template-rows: 0fr;
		transition: grid-template-rows var(--sb-dur) var(--sb-ease);
		margin-left: 40px;
	}
	.sb-children > div { overflow: hidden; }
	.sb-children-open  { grid-template-rows: 1fr; }

	.sb-child {
		position: relative;
		display: flex; align-items: center; gap: 10px;
		height: 34px; padding: 0 10px 0 16px;
		border-radius: 8px;
		font-size: 13px; color: var(--muted-foreground);
		text-decoration: none; cursor: pointer;
		transition: background var(--sb-fast), color var(--sb-fast), transform var(--sb-fast);
	}
	.sb-child:hover  { background: var(--muted); color: var(--foreground); }
	.sb-child:active { transform: scale(0.97); }
	.sb-child-active { color: var(--accent); font-weight: 600; }

	.sb-child-label {
		flex: 1; font-size: inherit; font-weight: inherit; color: inherit;
		white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
	}

	.sb-child-line {
		width: 1.5px; height: 14px; border-radius: 2px;
		background: var(--border); flex-shrink: 0;
		transition: background var(--sb-fast), height var(--sb-pop) var(--sb-spring);
	}
	.sb-child-line-active { background: var(--accent); height: 18px; }

	/* ─────────────────────────────────────────
	   FOOTER
	───────────────────────────────────────── */
	.sb-footer {
		padding: var(--sb-pad);
		border-top: 1px solid var(--border);
		flex-shrink: 0;
	}
	.sb-v-inset .sb-footer { border-top-color: transparent; }

	.sb-footer-slot { padding-bottom: 4px; }

	.sb-collapse-icon {
		transition: transform var(--sb-dur) var(--sb-ease);
	}
	.sb.sb-collapsed .sb-collapse-icon { transform: rotate(180deg); }
</style>
