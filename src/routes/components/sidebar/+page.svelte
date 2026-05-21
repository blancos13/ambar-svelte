<script lang="ts">
	import Sidebar from '$lib/components/Sidebar.svelte';
	import type { NavSection } from '$lib/components/Sidebar.svelte';
	import CodeBlock  from '$lib/components/CodeBlock.svelte';
	import PropsTable from '$lib/components/PropsTable.svelte';

	// ── Icons ───────────────────────────────────────────────────────────────
	const ICONS = {
		home:   'M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25',
		chart:  'M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z',
		users:  'M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Z',
		inbox:  'M2.25 13.5h3.86a2.25 2.25 0 0 1 2.012 1.244l.256.512a2.25 2.25 0 0 0 2.013 1.244h3.218a2.25 2.25 0 0 0 2.013-1.244l.256-.512a2.25 2.25 0 0 1 2.013-1.244h3.859m-19.5.338V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 0 0-2.15-1.588H6.911a2.25 2.25 0 0 0-2.15 1.588L2.35 13.177a2.25 2.25 0 0 0-.1.661Z',
		cog:    'M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z',
		bolt:   'M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z',
		folder: 'M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z',
		logout: 'M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75',
	};

	const sections: NavSection[] = [
		{
			items: [
				{ id: 'home',  label: 'Home',  icon: ICONS.home,  href: '#' },
				{ id: 'inbox', label: 'Inbox', icon: ICONS.inbox, href: '#', badge: 3 },
			],
		},
		{
			title: 'Workspace',
			items: [
				{
					id: 'analytics', label: 'Analytics', icon: ICONS.chart,
					children: [
						{ id: 'overview', label: 'Overview', icon: ICONS.chart },
						{ id: 'traffic',  label: 'Traffic',  icon: ICONS.bolt  },
					],
				},
				{ id: 'files', label: 'Files',    icon: ICONS.folder, href: '#', badge: 'New' },
				{ id: 'team',  label: 'Team',     icon: ICONS.users,  href: '#' },
			],
		},
		{
			title: 'System',
			items: [
				{ id: 'settings', label: 'Settings', icon: ICONS.cog, href: '#' },
			],
		},
	];

	// ── Playground state ────────────────────────────────────────────────────
	let active    = $state('home');
	let collapsed = $state(false);

	type ItemStyle      = 'default' | 'filled' | 'ghost' | 'outline';
	type Variant        = 'default' | 'floating' | 'inset';
	type Collapsible    = 'icon' | 'offcanvas' | 'none';
	type ActiveIndicator = 'bar' | 'track' | 'none';
	type Animation      = 'smooth' | 'snappy' | 'calm' | 'none';
	type ViewportMode   = 'auto' | 'desktop' | 'mobile';

	let itemStyle:       ItemStyle       = $state('default');
	let variant:         Variant         = $state('default');
	let collapsible:     Collapsible     = $state('icon');
	let activeIndicator: ActiveIndicator = $state('track');
	let animation:       Animation       = $state('smooth');
	let mode:            ViewportMode    = $state('desktop');
	let sidebarOpen      = $state(false);

	// ── Code examples ───────────────────────────────────────────────────────
	const importCode = `import Sidebar from '$lib/components/Sidebar.svelte';
import type { NavSection } from '$lib/components/Sidebar.svelte';`;

	const usageCode = `<script lang="ts">
  import Sidebar from '$lib/components/Sidebar.svelte';
  import type { NavSection } from '$lib/components/Sidebar.svelte';

  const sections: NavSection[] = [
    {
      items: [
        { id: 'home',  label: 'Home',  icon: '...svg path...', href: '/' },
        { id: 'inbox', label: 'Inbox', icon: '...svg path...', href: '/inbox', badge: 3 },
      ],
    },
    {
      title: 'Workspace',
      items: [
        { id: 'team', label: 'Team', icon: '...svg path...', href: '/team' },
      ],
    },
  ];

  let active    = $state('home');
  let collapsed = $state(false);
  let open      = $state(false);  // mobile drawer state
<\/script>

<div style="position: relative; height: 560px; overflow: hidden;">
  <Sidebar
    {sections}
    bind:active
    bind:collapsed
    bind:open
    mode="auto"
    itemStyle="default"
    variant="default"
    collapsible="icon"
    activeIndicator="bar"
    animation="smooth"
    mobileContained
  />
</div>`;

	const headerFooterCode = `<Sidebar {sections} bind:active>
  {#snippet header({ collapsed })}
    <div style="display:flex; align-items:center; gap:0.5rem;">
      <div class="logo-icon">A</div>
      {#if !collapsed}<span>Ambar UI</span>{/if}
    </div>
  {/snippet}

  {#snippet footer({ collapsed })}
    <button onclick={signOut}>
      <svg><!-- logout icon --></svg>
      {#if !collapsed}<span>Sign out</span>{/if}
    </button>
  {/snippet}
</Sidebar>`;

	const props = [
		{ name: 'sections',        type: 'NavSection[]',                                        description: 'Navigation data. Each section has an optional title and items array.' },
		{ name: 'active',          type: 'string',                           default: "''",     description: '$bindable. ID of the currently active nav item.' },
		{ name: 'collapsed',       type: 'boolean',                          default: 'false',  description: '$bindable. When true shows icon-only rail.' },
		{ name: 'open',            type: 'boolean',                          default: 'false',  description: '$bindable. Mobile drawer open state.' },
		{ name: 'width',           type: 'number',                           default: '240',    description: 'Expanded width in pixels.' },
		{ name: 'variant',         type: "'default' | 'floating' | 'inset'", default: "'default'", description: 'Shell visual style.' },
		{ name: 'itemStyle',       type: "'default' | 'filled' | 'ghost' | 'outline'", default: "'default'", description: 'Active item highlight style.' },
		{ name: 'activeIndicator', type: "'bar' | 'track' | 'none'",         default: "'bar'",  description: 'Active state indicator position.' },
		{ name: 'animation',       type: "'smooth' | 'snappy' | 'calm' | 'none'", default: "'smooth'", description: 'Collapse & item transition speed.' },
		{ name: 'collapsible',     type: "'icon' | 'offcanvas' | 'none'",    default: "'icon'", description: 'Collapse behavior.' },
		{ name: 'mode',            type: "'auto' | 'desktop' | 'mobile'",    default: "'auto'",    description: 'Rendering mode. auto switches to mobile drawer below 768px. mobile forces drawer, desktop forces sidebar.' },
		{ name: 'mobileContained', type: 'boolean',                          default: 'false',     description: 'Constrains mobile drawer to the parent container instead of the viewport.' },
		{ name: 'header',          type: "Snippet<[{ collapsed: boolean }]>",                   description: 'Custom top area. Receives collapsed state.' },
		{ name: 'footer',          type: "Snippet<[{ collapsed: boolean }]>",                   description: 'Custom bottom area. Receives collapsed state.' },
		{ name: 'onselect',        type: '(id: string) => void',                                description: 'Fires when user selects a nav item.' },
	];
</script>

<!-- Page header -->
<div class="comp-header">
	<div class="comp-header-top">
		<h1 class="comp-title">Sidebar</h1>
	</div>
	<p class="comp-desc">Full-featured navigation sidebar with collapsible icon rail, nested items, badges, and fully customizable active styles and animations.</p>
</div>

<!-- Import -->
<section class="doc-section">
	<h2 class="doc-section-title">Import</h2>
	<CodeBlock code={importCode} lang="ts" />
</section>

<!-- ── INTERACTIVE PLAYGROUND ── -->
<section class="doc-section">
	<h2 class="doc-section-title">Playground</h2>
	<p class="doc-section-desc">Tweak every option live — one sidebar, all props.</p>

	<div class="playground">
		<!-- LEFT: single sidebar canvas -->
		<div class="playground-canvas">
			{#if mode === 'mobile'}
				<button
					type="button"
					class="mobile-open-btn"
					onclick={() => (sidebarOpen = true)}
				>
					<svg width="16" height="16" viewBox="0 0 24 24" fill="none"
						stroke="currentColor" stroke-width="2" stroke-linecap="round">
						<path d="M3 12h18M3 6h18M3 18h18"/>
					</svg>
					Open sidebar
				</button>
			{/if}
			<Sidebar
				{sections}
				bind:active
				bind:collapsed
				bind:open={sidebarOpen}
				{mode}
				{itemStyle}
				{variant}
				{collapsible}
				{activeIndicator}
				{animation}
				mobileContained
			>
				{#snippet header({ collapsed: c })}
					<div class="pg-header">
						<div class="pg-avatar">A</div>
						{#if !c}
							<div class="pg-header-text">
								<span class="pg-name">Ambar UI</span>
								<span class="pg-role">Workspace</span>
							</div>
						{/if}
					</div>
				{/snippet}
				{#snippet footer({ collapsed: c })}
					<button type="button" class="pg-footer-btn" aria-label="Sign out">
						<svg width="15" height="15" viewBox="0 0 24 24" fill="none"
							stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
							<path d={ICONS.logout}/>
						</svg>
						{#if !c}<span>Sign out</span>{/if}
					</button>
				{/snippet}
			</Sidebar>
		</div>

		<!-- RIGHT: controls -->
		<div class="playground-controls">

			<div class="ctrl-group">
				<p class="ctrl-label">mode</p>
				<div class="ctrl-row">
					{#each (['desktop','mobile','auto'] as const) as v}
						<button class="ctrl-btn" class:ctrl-btn-on={mode === v}
							onclick={() => { mode = v; sidebarOpen = false; collapsed = false; }}>
							{v}
						</button>
					{/each}
				</div>
			</div>

			<div class="ctrl-group">
				<p class="ctrl-label">itemStyle</p>
				<div class="ctrl-row">
					{#each (['default','filled','ghost','outline'] as const) as v}
						<button class="ctrl-btn" class:ctrl-btn-on={itemStyle === v}
							onclick={() => { itemStyle = v; }}>
							{v}
						</button>
					{/each}
				</div>
			</div>

			<div class="ctrl-group">
				<p class="ctrl-label">variant</p>
				<div class="ctrl-row">
					{#each (['default','floating','inset'] as const) as v}
						<button class="ctrl-btn" class:ctrl-btn-on={variant === v}
							onclick={() => { variant = v; }}>
							{v}
						</button>
					{/each}
				</div>
			</div>

			<div class="ctrl-group">
				<p class="ctrl-label">collapsible</p>
				<div class="ctrl-row">
					{#each (['icon','offcanvas','none'] as const) as v}
						<button class="ctrl-btn" class:ctrl-btn-on={collapsible === v}
							onclick={() => { collapsible = v; collapsed = false; }}>
							{v}
						</button>
					{/each}
				</div>
			</div>

			<div class="ctrl-group">
				<p class="ctrl-label">activeIndicator</p>
				<div class="ctrl-row">
					{#each (['bar','track','none'] as const) as v}
						<button class="ctrl-btn" class:ctrl-btn-on={activeIndicator === v}
							onclick={() => { activeIndicator = v; }}>
							{v}
						</button>
					{/each}
				</div>
			</div>

			<div class="ctrl-group">
				<p class="ctrl-label">animation</p>
				<div class="ctrl-row">
					{#each (['smooth','snappy','calm','none'] as const) as v}
						<button class="ctrl-btn" class:ctrl-btn-on={animation === v}
							onclick={() => { animation = v; }}>
							{v}
						</button>
					{/each}
				</div>
			</div>

		</div>
	</div>

	<CodeBlock code={usageCode} lang="svelte" />
</section>

<!-- Header & Footer Snippets -->
<section class="doc-section">
	<h2 class="doc-section-title">Header & Footer Snippets</h2>
	<p class="doc-section-desc">Pass <code>header</code> and <code>footer</code> snippets for a custom top and bottom area. Both receive <code>collapsed</code>.</p>
	<CodeBlock code={headerFooterCode} lang="svelte" />
</section>

<!-- API Reference -->
<section class="doc-section">
	<h2 class="doc-section-title">API Reference</h2>
	<PropsTable {props} />
</section>

<style>
	.comp-header { margin-bottom: 2.5rem; padding-bottom: 1.5rem; border-bottom: 1px solid var(--border); }
	.comp-header-top { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.5rem; }
	.comp-title { font-size: 1.875rem; font-weight: 800; letter-spacing: -0.025em; color: var(--foreground); }
	.comp-desc { color: var(--muted-foreground); font-size: 0.9375rem; line-height: 1.6; margin-bottom: 1rem; }
	.doc-section { margin-bottom: 2.5rem; display: flex; flex-direction: column; gap: 1rem; }
	.doc-section-title { font-size: 1.125rem; font-weight: 700; color: var(--foreground); letter-spacing: -0.01em; }
	.doc-section-desc { font-size: 0.875rem; color: var(--muted-foreground); margin-top: -0.5rem; }
	.doc-section-desc code { font-family: ui-monospace, monospace; font-size: 0.8em; background: var(--muted); padding: 0.1rem 0.35rem; border-radius: 0.25rem; color: var(--accent); }

	/* ── Playground ── */
	.playground {
		display: grid;
		grid-template-columns: 1fr 15rem;
		gap: 1rem;
		border: 1px solid var(--border);
		border-radius: 1rem;
		overflow: hidden;
		background: var(--muted);
	}

	.playground-canvas {
		position: relative;
		height: 560px;
		background: var(--background);
		overflow: hidden;
	}

	.playground-controls {
		background: var(--card);
		border-left: 1px solid var(--border);
		padding: 1rem 0.875rem;
		display: flex;
		flex-direction: column;
		gap: 1.125rem;
		overflow-y: auto;
	}

	.ctrl-group {
		display: flex;
		flex-direction: column;
		gap: 0.375rem;
	}

	.ctrl-label {
		font-size: 0.65rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.09em;
		color: var(--muted-foreground);
	}

	.ctrl-row {
		display: flex;
		flex-wrap: wrap;
		gap: 0.25rem;
	}

	.ctrl-btn {
		padding: 0.3rem 0.625rem;
		border-radius: 0.4rem;
		border: 1px solid var(--border);
		background: var(--background);
		color: var(--muted-foreground);
		font-size: 0.72rem;
		font-family: ui-monospace, monospace;
		font-weight: 500;
		cursor: pointer;
		transition: background 0.1s, color 0.1s, border-color 0.1s;
		white-space: nowrap;
	}
	.ctrl-btn:hover { color: var(--foreground); background: var(--secondary); }
	.ctrl-btn-on {
		background: var(--accent);
		color: var(--accent-foreground);
		border-color: var(--accent);
		font-weight: 700;
	}

	/* ── Playground sidebar header/footer ── */
	.pg-header {
		display: flex;
		align-items: center;
		gap: 0.625rem;
		min-width: 0;
	}

	.pg-avatar {
		flex: 0 0 30px;
		width: 30px; height: 30px;
		border-radius: 9999px;
		background: var(--accent);
		color: var(--accent-foreground);
		display: flex; align-items: center; justify-content: center;
		font-size: 0.8125rem; font-weight: 700;
	}

	.pg-header-text {
		display: flex;
		flex-direction: column;
		min-width: 0;
	}

	.pg-name {
		font-size: 0.8125rem;
		font-weight: 700;
		color: var(--foreground);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.pg-role {
		font-size: 0.7rem;
		color: var(--muted-foreground);
		white-space: nowrap;
	}

	.pg-footer-btn {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		width: 100%;
		padding: 0.45rem 0.5rem;
		border: none;
		border-radius: 0.5rem;
		background: none;
		color: var(--muted-foreground);
		font-size: 0.8125rem;
		font-weight: 500;
		cursor: pointer;
		transition: background 0.12s, color 0.12s;
		text-align: left;
	}
	.pg-footer-btn:hover { background: var(--muted); color: var(--foreground); }

	/* Mobile open button */
	.mobile-open-btn {
		position: absolute;
		top: 1rem;
		left: 1rem;
		z-index: 10;
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem 0.875rem;
		border-radius: 0.5rem;
		border: 1px solid var(--border);
		background: var(--card);
		color: var(--foreground);
		font-size: 0.8125rem;
		font-weight: 500;
		cursor: pointer;
		transition: background 0.12s;
	}
	.mobile-open-btn:hover { background: var(--muted); }

	@media (max-width: 700px) {
		.playground { grid-template-columns: 1fr; }
		.playground-controls { border-left: none; border-top: 1px solid var(--border); }
		.playground-canvas { height: 400px; }
	}
</style>
