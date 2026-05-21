<script lang="ts">
	import { page } from '$app/stores';
	import { onMount, tick } from 'svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import Tabs    from '$lib/components/Tabs.svelte';
	import type { NavSection } from '$lib/components/Sidebar.svelte';
	import {
		themeStore,
		ACCENT_PRESETS,
		FONT_PRESETS,
		THEME_STYLE_PRESETS,
	} from '$lib/stores/theme.svelte';

	const modeTabs = [
		{ value: 'light', label: '☀︎  Light' },
		{ value: 'dark',  label: '◐  Dark'  },
	];

	let { children } = $props();

	// ── Nav data ───────────────────────────────────────────────────────
	const navSections: NavSection[] = [
		{
			title: 'Getting Started',
			items: [
				{ id: '/components/installation', label: 'Installation', href: '/components/installation' },
				{ id: '/components/theming',      label: 'Theming',      href: '/components/theming'      },
				{ id: '/components/guide',        label: 'AI / LLMs',    href: '/components/guide'        },
			]
		},
		{
			title: 'Charts',
			items: [
				{ id: '/components/charts/bar-chart',   label: 'Bar Chart',   href: '/components/charts/bar-chart'   },
				{ id: '/components/charts/candlestick', label: 'Candlestick', href: '/components/charts/candlestick' },
				{ id: '/components/charts/donut-chart', label: 'Donut Chart', href: '/components/charts/donut-chart' },
				{ id: '/components/charts/heatmap',     label: 'Heatmap',     href: '/components/charts/heatmap'     },
				{ id: '/components/charts/line-chart',  label: 'Line Chart',  href: '/components/charts/line-chart'  },
				{ id: '/components/charts/realtime',    label: 'Streaming',   href: '/components/charts/realtime',    badge: 'LIVE' },
				{ id: '/components/charts/sparkline',   label: 'Sparkline',   href: '/components/charts/sparkline'   },
			]
		},
		{
			title: 'Inputs',
			items: [
				{ id: '/components/button',    label: 'Button',    href: '/components/button'    },
				{ id: '/components/checkbox',  label: 'Checkbox',  href: '/components/checkbox'  },
				{ id: '/components/input',     label: 'Input',     href: '/components/input'     },
				{ id: '/components/otp-input', label: 'OTP Input', href: '/components/otp-input' },
				{ id: '/components/radio',     label: 'Radio',     href: '/components/radio'     },
				{ id: '/components/search',    label: 'Search',    href: '/components/search'    },
				{ id: '/components/select',    label: 'Select',    href: '/components/select'    },
				{ id: '/components/slider',    label: 'Slider',    href: '/components/slider'    },
				{ id: '/components/switch',    label: 'Switch',    href: '/components/switch'    },
				{ id: '/components/textarea',  label: 'Textarea',  href: '/components/textarea'  },
			]
		},
		{
			title: 'Layout',
			items: [
				{ id: '/components/accordion',  label: 'Accordion',         href: '/components/accordion'  },
				{ id: '/components/avatar',     label: 'Avatar',            href: '/components/avatar'     },
				{ id: '/components/breadcrumb', label: 'Breadcrumb',        href: '/components/breadcrumb' },
				{ id: '/components/layout',     label: 'Layout Primitives', href: '/components/layout'     },
				{ id: '/components/sidebar',    label: 'Sidebar',           href: '/components/sidebar'    },
				{ id: '/components/tabs',       label: 'Tabs',              href: '/components/tabs'       },
			]
		},
		{
			title: 'Overlay',
			items: [
				{ id: '/components/dialog',   label: 'Dialog',   href: '/components/dialog'   },
				{ id: '/components/drawer',   label: 'Drawer',   href: '/components/drawer'   },
				{ id: '/components/dropdown', label: 'Dropdown', href: '/components/dropdown' },
				{ id: '/components/popover',  label: 'Popover',  href: '/components/popover'  },
				{ id: '/components/sheet',    label: 'Sheet',    href: '/components/sheet'    },
				{ id: '/components/toast',    label: 'Toast',    href: '/components/toast'    },
				{ id: '/components/tooltip',  label: 'Tooltip',  href: '/components/tooltip'  },
			]
		},
		{
			title: 'Display',
			items: [
				{ id: '/components/empty-state', label: 'Empty State', href: '/components/empty-state' },
				{ id: '/components/link',        label: 'Link',        href: '/components/link'        },
				{ id: '/components/list',        label: 'List',        href: '/components/list'        },
				{ id: '/components/progress',    label: 'Progress',    href: '/components/progress'    },
				{ id: '/components/skeleton',    label: 'Skeleton',    href: '/components/skeleton'    },
				{ id: '/components/spinner',     label: 'Spinner',     href: '/components/spinner'     },
				{ id: '/components/typography',  label: 'Typography',  href: '/components/typography'  },
			]
		},
	];

	// ── Active item (synced with route) ────────────────────────────────
	let activeItem = $state<string | undefined>(undefined);
	let sidebarCollapsed = $state(false);

	$effect(() => {
		const path = $page.url.pathname;
		activeItem = undefined;
		for (const section of navSections) {
			for (const item of section.items) {
				if (path === item.href || path.startsWith(item.href + '/')) {
					activeItem = item.id;
					return;
				}
			}
		}
	});

	// Reset collapsed when collapsible changes to 'none'
	$effect(() => {
		if (themeStore.sbCollapsible === 'none') sidebarCollapsed = false;
	});

	// ── On-page TOC ────────────────────────────────────────────────────
	type TocItem = { id: string; text: string; level: number };
	let tocItems        = $state<TocItem[]>([]);
	let activeHeadingId = $state('');
	let intersectionObs: IntersectionObserver | null = null;

	function extractHeadings() {
		const content = document.querySelector('.docs-content');
		if (!content) { tocItems = []; return; }

		const els = Array.from(content.querySelectorAll('h2, h3'));
		tocItems = els.map((h, i) => {
			if (!h.id) {
				h.id = 'h-' + i + '-' +
					(h.textContent ?? '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
			}
			return { id: h.id, text: h.textContent ?? '', level: parseInt(h.tagName[1]) };
		});

		intersectionObs?.disconnect();
		if (!tocItems.length) return;

		intersectionObs = new IntersectionObserver(entries => {
			for (const e of entries)
				if (e.isIntersecting) activeHeadingId = e.target.id;
		}, { rootMargin: '-8% 0% -80% 0%', threshold: 0 });

		tocItems.forEach(t => {
			const el = document.getElementById(t.id);
			if (el) intersectionObs!.observe(el);
		});
	}

	$effect(() => {
		$page.url.pathname;
		activeHeadingId = '';
		tick().then(extractHeadings);
	});

	onMount(() => {
		tick().then(extractHeadings);
		return () => intersectionObs?.disconnect();
	});

	function scrollTo(id: string) {
		const el = document.getElementById(id);
		if (!el) return;
		window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
		activeHeadingId = id;
	}

	// ── Customize panel tab ─────────────────────────────────────────────
	let customizeOpen = $state(true);
</script>

<div class="docs-layout">

	<!-- LEFT — Sidebar component (live, theme-driven) -->
	<div class="docs-sidebar-wrap">
		<Sidebar
			sections={navSections}
			bind:active={activeItem}
			bind:collapsed={sidebarCollapsed}
			itemStyle="ghost"
			collapsible="none"
			variant={themeStore.sbVariant}
			activeIndicator={themeStore.sbActiveIndicator}
			animation={themeStore.sbAnimation}
			hideHeader
		/>
	</div>

	<!-- CENTER — main content -->
	<main class="docs-main">
		<div class="docs-content">
			{@render children()}
		</div>
	</main>

	<!-- RIGHT — TOC + Customize -->
	<aside class="docs-right">

		<!-- On-page TOC -->
		{#if tocItems.length > 0}
			<div class="right-section">
				<p class="right-label">On this page</p>
				<nav class="toc-nav">
					{#each tocItems as item}
						<button
							class="toc-link"
							class:toc-h3={item.level === 3}
							class:toc-active={activeHeadingId === item.id}
							onclick={() => scrollTo(item.id)}
						>{item.text}</button>
					{/each}
				</nav>
			</div>
			<div class="right-divider"></div>
		{/if}

		<!-- Customize panel -->
		<div class="right-section">
			<button class="customize-toggle" onclick={() => (customizeOpen = !customizeOpen)}>
				<p class="right-label" style="margin:0">Customize</p>
				<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
					stroke-width="2.5" stroke-linecap="round"
					style="transition:transform 0.2s; transform: rotate({customizeOpen ? 90 : 0}deg)">
					<path d="M9 18l6-6-6-6"/>
				</svg>
			</button>

			{#if customizeOpen}
				<div class="customize-body">

					<!-- Mode — using our own Tabs component -->
					<div class="cust-group">
						<p class="cust-label">Mode</p>
						<Tabs
							tabs={modeTabs}
							value={themeStore.mode}
							onchange={(v) => themeStore.setMode(v as 'light' | 'dark')}
							variant="line"
							animation="smooth"
							fullWidth
						/>
					</div>

					<!-- Theme -->
					<div class="cust-group">
						<p class="cust-label">Theme</p>
						<div class="cust-themes">
							{#each THEME_STYLE_PRESETS as preset}
								<button
									class="cust-theme-btn"
									class:cust-theme-on={themeStore.styleId === preset.id}
									title={preset.label}
									onclick={() => themeStore.setStyle(preset.id)}
								>
									<span class="cust-swatch"
										style="background: linear-gradient(135deg, {preset.swatch.from}, {preset.swatch.to})"
									></span>
									<span class="cust-theme-label">{preset.label}</span>
								</button>
							{/each}
						</div>
					</div>

					<!-- Accent -->
					<div class="cust-group">
						<p class="cust-label">Accent</p>
						<div class="cust-dots">
							{#each ACCENT_PRESETS as preset}
								<button
									class="cust-dot"
									class:cust-dot-on={themeStore.accentId === preset.id}
									title={preset.label}
									style="background:{preset.base}"
									onclick={() => themeStore.setAccent(preset.id)}
								>
									{#if themeStore.accentId === preset.id}
										<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"
											stroke-linecap="round" style="width:55%;height:55%;color:#fff">
											<path d="M20 6L9 17l-5-5"/>
										</svg>
									{/if}
								</button>
							{/each}
						</div>
					</div>

					<!-- Font -->
					<div class="cust-group">
						<p class="cust-label">Font</p>
						<div class="cust-font-list">
							{#each FONT_PRESETS as preset}
								<button
									class="cust-font-btn"
									class:cust-font-on={themeStore.fontId === preset.id}
									onclick={() => themeStore.setFont(preset.id)}
								>{preset.label}</button>
							{/each}
						</div>
					</div>

				</div>
			{/if}
		</div>

		<!-- Install snippet -->
		<div class="right-divider"></div>
		<div class="right-section">
			<p class="right-label">Install</p>
			<div class="install-box">
				<code class="install-cmd">npm i @ambar-ui/svelte</code>
			</div>
		</div>

	</aside>

</div>


<style>
/* ════════════════════════════════════════
   ROOT
   ════════════════════════════════════════ */
.docs-layout {
	display: flex;
	width: 100%;
	max-width: 1280px;
	margin: 0 auto;
	min-height: calc(100vh - 3.5rem);
	align-items: flex-start;
}

/* ════════════════════════════════════════
   LEFT — Sidebar component wrapper
   ════════════════════════════════════════ */
.docs-sidebar-wrap {
	position: sticky;
	top: 3.5rem;
	flex-shrink: 0;
	height: calc(100vh - 3.5rem);
	/* width driven by the Sidebar component itself (240px default) */
}

/* ════════════════════════════════════════
   CENTER
   ════════════════════════════════════════ */
.docs-main {
	flex: 1;
	min-width: 0;
	padding: 2.5rem 2.5rem 6rem;
}

.docs-content {
	width: 100%;
}

/* ════════════════════════════════════════
   RIGHT — TOC + Customize
   ════════════════════════════════════════ */
.docs-right {
	position: sticky;
	top: 3.5rem;
	width: 13.5rem;
	flex-shrink: 0;
	height: calc(100vh - 3.5rem);
	overflow-y: auto;
	border-left: 1px solid var(--border);
	padding: 1.5rem 1rem 2rem 1.25rem;
	display: flex;
	flex-direction: column;
	gap: 0;
	scrollbar-width: thin;
	scrollbar-color: var(--border) transparent;
}

.right-section {
	display: flex;
	flex-direction: column;
	gap: 0.4rem;
}

.right-label {
	font-size: 0.65rem;
	font-weight: 700;
	text-transform: uppercase;
	letter-spacing: 0.09em;
	color: var(--muted-foreground);
	margin: 0 0 0.25rem;
}

.right-divider {
	height: 1px;
	background: var(--border);
	margin: 1.25rem 0;
}

/* ── TOC ── */
.toc-nav {
	display: flex;
	flex-direction: column;
	gap: 0.05rem;
}

.toc-link {
	display: block;
	width: 100%;
	text-align: left;
	padding: 0.25rem 0 0.25rem 0.625rem;
	margin-left: -0.625rem;
	background: none;
	border: none;
	border-left: 2px solid transparent;
	font-size: 0.78rem;
	line-height: 1.5;
	color: var(--muted-foreground);
	cursor: pointer;
	transition: color 0.12s, border-color 0.12s;
}
.toc-h3     { padding-left: 1.25rem; font-size: 0.74rem; }
.toc-link:hover  { color: var(--foreground); }
.toc-active {
	color: var(--foreground);
	font-weight: 600;
	border-left-color: var(--accent);
}

/* ── Customize toggle ── */
.customize-toggle {
	display: flex;
	align-items: center;
	justify-content: space-between;
	width: 100%;
	background: none;
	border: none;
	padding: 0;
	cursor: pointer;
	color: var(--muted-foreground);
}
.customize-toggle:hover .right-label { color: var(--foreground); }

/* ── Customize body ── */
.customize-body {
	display: flex;
	flex-direction: column;
	gap: 0.875rem;
	margin-top: 0.5rem;
}

.cust-group {
	display: flex;
	flex-direction: column;
	gap: 0.3rem;
}

.cust-label {
	font-size: 0.6rem;
	font-weight: 600;
	text-transform: uppercase;
	letter-spacing: 0.08em;
	color: var(--muted-foreground);
	margin: 0;
}


/* ── Theme (right col) ── */
.cust-themes {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	gap: 0.375rem;
}
.cust-theme-btn {
	display: flex; flex-direction: column; align-items: center; gap: 0.35rem;
	padding: 0.4rem 0.2rem;
	border-radius: 0.5rem; border: none; background: none;
	cursor: pointer; transition: background 0.12s;
}
.cust-theme-btn:hover { background: var(--muted); }
.cust-swatch {
	width: 1.625rem; height: 1.625rem; border-radius: 50%;
	transition: transform 0.15s;
}
.cust-theme-btn:hover .cust-swatch { transform: scale(1.08); }
.cust-theme-on .cust-swatch {
	transform: scale(1.12);
	box-shadow: 0 0 0 2px var(--background), 0 0 0 4px var(--foreground);
}
.cust-theme-label { font-size: 0.58rem; color: var(--muted-foreground); white-space: nowrap; }
.cust-theme-on .cust-theme-label { color: var(--foreground); font-weight: 600; }

/* ── Accent dots (right col) ── */
.cust-dots { display: flex; flex-wrap: wrap; gap: 0.375rem; }
.cust-dot {
	width: 1.375rem; height: 1.375rem;
	border-radius: 50%; border: none;
	cursor: pointer;
	display: flex; align-items: center; justify-content: center;
	transition: transform 0.15s;
	flex-shrink: 0;
}
.cust-dot:hover  { transform: scale(1.15); }
.cust-dot-on {
	transform: scale(1.18);
	outline: 2.5px solid var(--foreground);
	outline-offset: 2px;
}

/* ── Font list (right col) ── */
.cust-font-list { display: flex; flex-wrap: wrap; gap: 0; }
.cust-font-btn {
	padding: 0.275rem 0.4rem;
	border: none; background: none;
	font-size: 0.72rem; font-weight: 450;
	color: var(--muted-foreground);
	cursor: pointer;
	border-bottom: 2px solid transparent;
	transition: color 0.12s, border-color 0.12s;
	white-space: nowrap;
}
.cust-font-btn:hover { color: var(--foreground); }
.cust-font-on {
	color: var(--foreground); font-weight: 600;
	border-bottom-color: var(--accent);
}

/* ── Install snippet ── */
.install-box {
	background: var(--muted);
	border: 1px solid var(--border);
	border-radius: 0.5rem;
	padding: 0.45rem 0.65rem;
}
.install-cmd {
	font-family: ui-monospace, monospace;
	font-size: 0.7rem;
	color: var(--accent);
	user-select: all;
	white-space: nowrap;
}

/* ════════════════════════════════════════
   RESPONSIVE
   ════════════════════════════════════════ */
@media (max-width: 1200px) {
	.docs-right { display: none; }
}

@media (min-width: 801px) and (max-width: 1100px) {
	.docs-main { padding: 2rem 1.5rem 5rem; }
}

@media (max-width: 800px) {
	.docs-sidebar-wrap { display: none; }
	.docs-right        { display: none; }
	.docs-main         { padding: 1rem 1rem 2rem; }
	.docs-content      { overflow-x: hidden; }
}
</style>
