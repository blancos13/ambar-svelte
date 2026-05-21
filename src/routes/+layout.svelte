<script lang="ts">
	import '../app.css';
	import { onMount, tick } from 'svelte';
	import { page }       from '$app/stores';
	import { themeStore } from '$lib/stores/theme.svelte';
	import Settings from '$lib/components/Settings.svelte';
	import Sheet    from '$lib/components/Sheet.svelte';
	import Toast    from '$lib/components/Toast.svelte';

	let { children } = $props();

	let settingsOpen = $state(false);
	let navSheetOpen = $state(false);
	let searchOpen   = $state(false);
	let searchQuery  = $state('');
	let searchEl: HTMLInputElement | undefined = $state();

	onMount(() => { themeStore.init(); });

	// Close overlays on navigation
	$effect(() => {
		$page.url.pathname;
		navSheetOpen  = false;
		searchOpen    = false;
		searchQuery   = '';
	});

	const navSections = [
		{ title: 'Getting Started', items: [
			{ label: 'Installation', href: '/components/installation' },
			{ label: 'Theming',      href: '/components/theming'      },
			{ label: 'AI / LLMs',   href: '/components/guide'        },
		]},
		{ title: 'Inputs', items: [
			{ label: 'Button',    href: '/components/button'    },
			{ label: 'Checkbox',  href: '/components/checkbox'  },
			{ label: 'Input',     href: '/components/input'     },
			{ label: 'OTP Input', href: '/components/otp-input' },
			{ label: 'Radio',     href: '/components/radio'     },
			{ label: 'Search',    href: '/components/search'    },
			{ label: 'Select',    href: '/components/select'    },
			{ label: 'Slider',    href: '/components/slider'    },
			{ label: 'Switch',    href: '/components/switch'    },
			{ label: 'Textarea',  href: '/components/textarea'  },
		]},
		{ title: 'Layout', items: [
			{ label: 'Accordion',         href: '/components/accordion'  },
			{ label: 'Avatar',            href: '/components/avatar'     },
			{ label: 'Breadcrumb',        href: '/components/breadcrumb' },
			{ label: 'Layout Primitives', href: '/components/layout'     },
			{ label: 'Sidebar',           href: '/components/sidebar'    },
			{ label: 'Tabs',              href: '/components/tabs'       },
		]},
		{ title: 'Overlay', items: [
			{ label: 'Dialog',   href: '/components/dialog'   },
			{ label: 'Drawer',   href: '/components/drawer'   },
			{ label: 'Dropdown', href: '/components/dropdown' },
			{ label: 'Popover',  href: '/components/popover'  },
			{ label: 'Sheet',    href: '/components/sheet'    },
			{ label: 'Toast',    href: '/components/toast'    },
			{ label: 'Tooltip',  href: '/components/tooltip'  },
		]},
		{ title: 'Display', items: [
			{ label: 'Empty State', href: '/components/empty-state' },
			{ label: 'Link',        href: '/components/link'        },
			{ label: 'List',        href: '/components/list'        },
			{ label: 'Progress',    href: '/components/progress'    },
			{ label: 'Skeleton',    href: '/components/skeleton'    },
			{ label: 'Spinner',     href: '/components/spinner'     },
			{ label: 'Typography',  href: '/components/typography'  },
		]},
		{ title: 'Charts', items: [
			{ label: 'Bar Chart',   href: '/components/charts/bar-chart'   },
			{ label: 'Candlestick', href: '/components/charts/candlestick' },
			{ label: 'Donut Chart', href: '/components/charts/donut-chart' },
			{ label: 'Heatmap',     href: '/components/charts/heatmap'     },
			{ label: 'Line Chart',  href: '/components/charts/line-chart'  },
			{ label: 'Realtime',    href: '/components/charts/realtime'    },
			{ label: 'Sparkline',   href: '/components/charts/sparkline'   },
		]},
	];

	// Flat list for search
	const searchItems = navSections.flatMap(s =>
		s.items.map(i => ({ label: i.label, href: i.href, section: s.title }))
	);

	const searchResults = $derived(
		searchQuery.trim()
			? searchItems.filter(i =>
				i.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
				i.section.toLowerCase().includes(searchQuery.toLowerCase())
			  )
			: searchItems
	);

	function openSearch() {
		searchOpen = true;
		tick().then(() => searchEl?.focus());
	}

	function closeSearch() {
		searchOpen = false;
		searchQuery = '';
	}

	function onSearchKey(e: KeyboardEvent) {
		if (e.key === 'Escape') closeSearch();
	}

	function onWindowKey(e: KeyboardEvent) {
		if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
			e.preventDefault();
			searchOpen ? closeSearch() : openSearch();
		}
		if (e.key === 'Escape' && searchOpen) closeSearch();
	}

	const currentPath = $derived($page.url.pathname);
</script>

<svelte:window onkeydown={onWindowKey} />

<svelte:head>
	<title>Ambar UI — Svelte 5 Component Library</title>
</svelte:head>

<!-- ── Top Navbar ── -->
<header class="docs-nav">
	<div class="docs-nav-inner">

		<!-- Logo -->
		<a href="/" class="docs-logo">
			<div class="docs-logo-icon">
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
					stroke-linecap="round" stroke-linejoin="round" style="width:1rem;height:1rem">
					<path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
				</svg>
			</div>
			<span class="docs-logo-name">ambar<span class="docs-logo-ui">ui</span></span>
			<span class="docs-logo-version">v1.0</span>
		</a>

		<!-- Center nav links (desktop) -->
		<nav class="docs-nav-links">
			<a href="/" class="docs-nav-link" class:active={currentPath === '/'}>Docs</a>
			<a href="/components/button" class="docs-nav-link"
				class:active={currentPath.startsWith('/components')}>Components</a>
		</nav>

		<!-- Search trigger (desktop) -->
		<button class="search-trigger" onclick={openSearch} aria-label="Search components">
			<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
				style="width:0.875rem;height:0.875rem;flex-shrink:0">
				<circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
			</svg>
			<span class="search-trigger-text">Search components...</span>
			<kbd class="search-kbd">⌘K</kbd>
		</button>

		<!-- Right actions -->
		<div class="docs-nav-actions">
			<!-- Mobile hamburger -->
			<button
				class="docs-icon-btn nav-hamburger"
				onclick={() => (navSheetOpen = true)}
				aria-label="Open navigation"
			>
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
					stroke-linecap="round" style="width:1.1rem;height:1.1rem">
					<path d="M3 12h18M3 6h18M3 18h18"/>
				</svg>
			</button>

			<!-- Mobile search icon -->
			<button class="docs-icon-btn nav-search-mobile" onclick={openSearch} aria-label="Search">
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
					style="width:1rem;height:1rem">
					<circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
				</svg>
			</button>

			<!-- Dark / light toggle -->
			<button class="docs-icon-btn" onclick={() => themeStore.toggleMode()}
				aria-label="Toggle theme" title="Toggle light / dark">
				{#if themeStore.mode === 'dark'}
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
						style="width:1rem;height:1rem">
						<circle cx="12" cy="12" r="5"/>
						<path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
					</svg>
				{:else}
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
						style="width:1rem;height:1rem">
						<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
					</svg>
				{/if}
			</button>

			<!-- Theme settings -->
			<button class="docs-icon-btn" onclick={() => (settingsOpen = true)}
				aria-label="Theme settings" title="Customize theme">
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
					style="width:1rem;height:1rem">
					<circle cx="12" cy="12" r="3"/>
					<path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/>
					<path d="M12 2v2M12 20v2M2 12h2M20 12h2"/>
				</svg>
			</button>

			<!-- GitHub -->
			<a href="https://github.com/blancos13/ambar-svelte" target="_blank" rel="noreferrer"
				class="docs-icon-btn" aria-label="GitHub">
				<svg viewBox="0 0 24 24" fill="currentColor" style="width:1rem;height:1rem">
					<path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/>
				</svg>
			</a>
		</div>
	</div>
</header>

<!-- ── Search Overlay ── -->
{#if searchOpen}
<!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
<div class="search-overlay" onclick={closeSearch}>
	<!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
	<div class="search-box" onclick={(e) => e.stopPropagation()}>
		<div class="search-input-row">
			<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
				style="width:1rem;height:1rem;flex-shrink:0;color:var(--muted-foreground)">
				<circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
			</svg>
			<input
				bind:this={searchEl}
				bind:value={searchQuery}
				placeholder="Search components..."
				class="search-input"
				onkeydown={onSearchKey}
			/>
			{#if searchQuery}
				<button class="search-clear" onclick={() => { searchQuery = ''; searchEl?.focus(); }}
					aria-label="Clear">
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
						style="width:0.875rem;height:0.875rem">
						<path d="M18 6 6 18M6 6l12 12"/>
					</svg>
				</button>
			{/if}
		</div>

		<div class="search-results">
			{#if searchResults.length > 0}
				{@const grouped = navSections.map(s => ({
					title: s.title,
					items: searchResults.filter(r => r.section === s.title)
				})).filter(g => g.items.length > 0)}

				{#each grouped as group}
					<p class="search-group-title">{group.title}</p>
					{#each group.items as item}
						<a
							href={item.href}
							class="search-result"
							class:search-result-active={currentPath === item.href}
							onclick={closeSearch}
						>
							<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
								style="width:0.875rem;height:0.875rem;flex-shrink:0;color:var(--muted-foreground)">
								<rect x="3" y="3" width="18" height="18" rx="2"/>
								<path d="M9 9h6M9 13h4"/>
							</svg>
							<span class="search-result-label">{item.label}</span>
						</a>
					{/each}
				{/each}
			{:else}
				<p class="search-empty">No results for "<strong>{searchQuery}</strong>"</p>
			{/if}
		</div>

		<div class="search-footer">
			<span class="search-footer-hint"><kbd>↵</kbd> select</span>
			<span class="search-footer-hint"><kbd>Esc</kbd> close</span>
		</div>
	</div>
</div>
{/if}

<!-- Mobile navigation Sheet -->
<Sheet open={navSheetOpen} onClose={() => (navSheetOpen = false)} size="lg">
	<div class="sheet-nav-top">
		<a href="/" class="sheet-nav-home" class:sheet-nav-active={currentPath === '/'}>
			<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
				style="width:1rem;height:1rem;flex-shrink:0">
				<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
				<polyline points="9 22 9 12 15 12 15 22"/>
			</svg>
			Home
		</a>
		<a href="https://github.com/blancos13/ambar-svelte" target="_blank" rel="noreferrer" class="sheet-nav-home">
			<svg viewBox="0 0 24 24" fill="currentColor" style="width:1rem;height:1rem;flex-shrink:0">
				<path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/>
			</svg>
			GitHub
		</a>
	</div>

	{#each navSections as section}
		<p class="sheet-section-title">{section.title}</p>
		<div class="sheet-section-items">
			{#each section.items as item}
				<a
					href={item.href}
					class="sheet-nav-item"
					class:sheet-nav-active={currentPath === item.href || currentPath.startsWith(item.href + '/')}
				>{item.label}</a>
			{/each}
		</div>
	{/each}
</Sheet>

<Settings bind:open={settingsOpen} />
<Toast />

<div id="app-content" class="app-content">
	{@render children()}
</div>

<style>
/* ── Navbar ── */
.docs-nav {
	position: sticky;
	top: 0;
	z-index: 50;
	border-bottom: 1px solid var(--border);
	background: color-mix(in srgb, var(--background) 85%, transparent);
	backdrop-filter: blur(12px);
	-webkit-backdrop-filter: blur(12px);
}

.docs-nav-inner {
	max-width: 1280px;
	margin: 0 auto;
	padding: 0 1rem;
	height: 3.5rem;
	display: flex;
	align-items: center;
	gap: 0.75rem;
}

.docs-logo {
	display: flex;
	align-items: center;
	gap: 0.5rem;
	text-decoration: none;
	flex-shrink: 0;
}

.docs-logo-icon {
	width: 1.75rem; height: 1.75rem;
	border-radius: 0.5rem;
	background: var(--accent);
	color: var(--accent-foreground);
	display: flex; align-items: center; justify-content: center;
	flex-shrink: 0;
}

.docs-logo-name {
	font-size: 1rem; font-weight: 700;
	color: var(--foreground);
	letter-spacing: -0.02em;
}
.docs-logo-ui { color: var(--accent); }

.docs-logo-version {
	font-size: 0.65rem; font-weight: 600;
	color: var(--muted-foreground);
	background: var(--secondary);
	padding: 0.1rem 0.4rem;
	border-radius: 9999px;
}

.docs-nav-links {
	display: flex; align-items: center; gap: 0.25rem;
	flex-shrink: 0;
}

.docs-nav-link {
	font-size: 0.875rem; font-weight: 500;
	color: var(--muted-foreground);
	text-decoration: none;
	padding: 0.375rem 0.75rem;
	border-radius: 0.5rem;
	transition: color 0.15s, background 0.15s;
}
.docs-nav-link:hover  { color: var(--foreground); background: var(--secondary); }
.docs-nav-link.active { color: var(--foreground); font-weight: 600; }

/* ── Search trigger ── */
.search-trigger {
	flex: 1;
	max-width: 18rem;
	display: flex;
	align-items: center;
	gap: 0.5rem;
	padding: 0.4rem 0.75rem;
	border: 1px solid var(--border);
	border-radius: 0.625rem;
	background: var(--background);
	color: var(--muted-foreground);
	font-size: 0.8125rem;
	cursor: pointer;
	transition: border-color 0.15s, background 0.15s, color 0.15s;
	text-align: left;
}
.search-trigger:hover {
	border-color: color-mix(in srgb, var(--accent) 50%, var(--border));
	color: var(--foreground);
	background: var(--secondary);
}
.search-trigger-text {
	flex: 1;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}
.search-kbd {
	font-size: 0.65rem;
	font-family: inherit;
	background: var(--secondary);
	border: 1px solid var(--border);
	border-radius: 0.3rem;
	padding: 0.1rem 0.3rem;
	color: var(--muted-foreground);
	flex-shrink: 0;
}

.docs-nav-actions {
	display: flex; align-items: center; gap: 0.25rem; margin-left: auto;
}

.docs-icon-btn {
	display: flex; align-items: center; justify-content: center;
	width: 2rem; height: 2rem;
	border-radius: 0.5rem;
	border: none; background: none;
	color: var(--muted-foreground);
	cursor: pointer; text-decoration: none;
	transition: color 0.15s, background 0.15s;
}
.docs-icon-btn:hover { color: var(--foreground); background: var(--secondary); }

.nav-hamburger    { display: none; }
.nav-search-mobile { display: none; }

@media (max-width: 800px) {
	.nav-hamburger     { display: flex; }
	.nav-search-mobile { display: flex; }
	.docs-nav-links    { display: none; }
	.docs-logo-version { display: none; }
	.search-trigger    { display: none; }
}

/* ── Search Overlay ── */
.search-overlay {
	position: fixed;
	inset: 0;
	z-index: 200;
	background: rgba(0, 0, 0, 0.5);
	backdrop-filter: blur(4px);
	display: flex;
	align-items: flex-start;
	justify-content: center;
	padding: 5rem 1rem 2rem;
	animation: search-fade-in 0.15s ease;
}
@keyframes search-fade-in {
	from { opacity: 0; }
	to   { opacity: 1; }
}

.search-box {
	width: 100%;
	max-width: 34rem;
	background: var(--card);
	border: 1px solid var(--border);
	border-radius: 1rem;
	overflow: hidden;
	box-shadow: 0 24px 64px rgba(0, 0, 0, 0.25);
	animation: search-slide-in 0.18s cubic-bezier(0.34, 1.56, 0.64, 1);
}
@keyframes search-slide-in {
	from { transform: translateY(-12px) scale(0.97); opacity: 0; }
	to   { transform: translateY(0) scale(1);        opacity: 1; }
}

.search-input-row {
	display: flex;
	align-items: center;
	gap: 0.625rem;
	padding: 0 1rem;
	border-bottom: 1px solid var(--border);
	height: 3.25rem;
}

.search-input {
	flex: 1;
	background: none;
	border: none;
	outline: none;
	font-size: 0.9375rem;
	color: var(--foreground);
	min-width: 0;
}
.search-input::placeholder { color: var(--muted-foreground); }

.search-clear {
	display: flex; align-items: center; justify-content: center;
	width: 1.5rem; height: 1.5rem;
	border-radius: 0.375rem;
	border: none; background: none;
	color: var(--muted-foreground);
	cursor: pointer;
	transition: background 0.12s, color 0.12s;
}
.search-clear:hover { background: var(--muted); color: var(--foreground); }

.search-results {
	max-height: 22rem;
	overflow-y: auto;
	padding: 0.5rem;
	scrollbar-width: thin;
	scrollbar-color: var(--border) transparent;
}

.search-group-title {
	font-size: 0.65rem;
	font-weight: 700;
	text-transform: uppercase;
	letter-spacing: 0.09em;
	color: var(--muted-foreground);
	padding: 0.5rem 0.5rem 0.25rem;
	margin: 0;
}

.search-result {
	display: flex;
	align-items: center;
	gap: 0.625rem;
	padding: 0.5rem 0.625rem;
	border-radius: 0.5rem;
	text-decoration: none;
	color: var(--foreground);
	font-size: 0.875rem;
	transition: background 0.1s;
}
.search-result:hover,
.search-result-active { background: color-mix(in srgb, var(--accent) 10%, transparent); }
.search-result-active { color: var(--accent); font-weight: 600; }

.search-result-label { flex: 1; }

.search-empty {
	padding: 2rem 1rem;
	text-align: center;
	font-size: 0.875rem;
	color: var(--muted-foreground);
}

.search-footer {
	display: flex;
	gap: 1rem;
	padding: 0.5rem 1rem;
	border-top: 1px solid var(--border);
	background: color-mix(in srgb, var(--muted) 30%, var(--card));
}
.search-footer-hint {
	display: flex;
	align-items: center;
	gap: 0.3rem;
	font-size: 0.7rem;
	color: var(--muted-foreground);
}
.search-footer-hint kbd {
	font-size: 0.6rem;
	font-family: inherit;
	background: var(--secondary);
	border: 1px solid var(--border);
	border-radius: 0.25rem;
	padding: 0.1rem 0.35rem;
}

/* ── Sheet nav content ── */
:global(.sheet-nav-top) {
	display: flex;
	gap: 0.5rem;
	margin-bottom: 1.25rem;
}

:global(.sheet-nav-home) {
	display: flex; align-items: center; gap: 0.5rem;
	flex: 1;
	padding: 0.625rem 0.875rem;
	border-radius: 0.75rem;
	border: 1px solid var(--border);
	background: var(--secondary);
	font-size: 0.8125rem; font-weight: 600;
	color: var(--foreground);
	text-decoration: none;
	transition: background 0.12s;
}
:global(.sheet-nav-home:hover) { background: var(--muted); }

:global(.sheet-section-title) {
	font-size: 0.65rem; font-weight: 700;
	text-transform: uppercase; letter-spacing: 0.09em;
	color: var(--muted-foreground);
	margin: 1rem 0 0.4rem;
}

:global(.sheet-section-items) {
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	gap: 0.25rem;
}

:global(.sheet-nav-item) {
	display: block;
	padding: 0.45rem 0.625rem;
	border-radius: 0.5rem;
	font-size: 0.8125rem;
	color: var(--muted-foreground);
	text-decoration: none;
	transition: color 0.12s, background 0.12s;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}
:global(.sheet-nav-item:hover) { color: var(--foreground); background: var(--secondary); }
:global(.sheet-nav-active) {
	color: var(--accent) !important;
	background: color-mix(in srgb, var(--accent) 10%, transparent) !important;
	font-weight: 600;
}

/* ── App content ── */
.app-content {
	transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), border-radius 0.4s cubic-bezier(0.16, 1, 0.3, 1);
	transform-origin: center top;
	will-change: transform, border-radius;
}

:global(.dialog-shrink-active) {
	transform: scale(0.88) translateY(30px);
	border-radius: 1.25rem;
	overflow: hidden;
	pointer-events: none;
}
</style>
