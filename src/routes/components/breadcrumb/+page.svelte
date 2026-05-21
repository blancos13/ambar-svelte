<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import PropsTable from '$lib/components/PropsTable.svelte';
	import type { BreadcrumbItem } from '$lib/components/Breadcrumb.svelte';

	const importCode = `import Breadcrumb from '$lib/components/Breadcrumb.svelte';
import type { BreadcrumbItem } from '$lib/components/Breadcrumb.svelte';`;

	const usageCode = `<script lang="ts">
  import Breadcrumb from '$lib/components/Breadcrumb.svelte';
  import type { BreadcrumbItem } from '$lib/components/Breadcrumb.svelte';

  const items: BreadcrumbItem[] = [
    { label: 'Home',     href: '/' },
    { label: 'Settings', href: '/settings' },
    { label: 'Profile' },
  ];
<\/script>

<Breadcrumb {items} />`;

	const separatorsCode = `<Breadcrumb {items} separator="chevron" />
<Breadcrumb {items} separator="slash" />
<Breadcrumb {items} separator="dot" />
<Breadcrumb {items} separator="arrow" />`;

	const iconsCode = `const items: BreadcrumbItem[] = [
  { label: 'Home',      href: '/', icon: ICONS.home   },
  { label: 'Analytics', href: '#', icon: ICONS.chart  },
  { label: 'Q4 Report'                                },
];

<Breadcrumb {items} separator="chevron" />`;

	const itemStyleCode = `<Breadcrumb items={settingsPath} itemStyle="plain" />
<Breadcrumb items={settingsPath} itemStyle="soft" />
<Breadcrumb items={settingsPath} itemStyle="pill" />`;

	const collapseCode = `<!-- Collapse to 3 visible items; click ··· to expand -->
<Breadcrumb items={longPath} maxVisible={3} />`;

	const ICONS = {
		home:    'M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25',
		folder:  'M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v8.25A2.25 2.25 0 0 0 4.5 16.5h15a2.25 2.25 0 0 0 2.25-2.25V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z',
		chart:   'M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z',
		doc:     'M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z',
		users:   'M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z',
		cog:     'M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z',
		globe:   'M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253M3.157 7.582A8.959 8.959 0 0 0 3 12c0 .778.099 1.533.284 2.253',
	};

	const basic: BreadcrumbItem[] = [
		{ label: 'Home',     href: '#' },
		{ label: 'Settings', href: '#' },
		{ label: 'Profile' },
	];

	const withIcons: BreadcrumbItem[] = [
		{ label: 'Home',      href: '#', icon: ICONS.home   },
		{ label: 'Analytics', href: '#', icon: ICONS.chart  },
		{ label: 'Revenue',   href: '#', icon: ICONS.folder },
		{ label: 'Q4 Report'            },
	];

	const longPath: BreadcrumbItem[] = [
		{ label: 'Home',         href: '#' },
		{ label: 'Projects',     href: '#' },
		{ label: 'Website 2024', href: '#' },
		{ label: 'Design',       href: '#' },
		{ label: 'Components',   href: '#' },
		{ label: 'Button.svelte' },
	];

	const settingsPath: BreadcrumbItem[] = [
		{ label: 'Dashboard',  href: '#', icon: ICONS.home  },
		{ label: 'Settings',   href: '#', icon: ICONS.cog   },
		{ label: 'Team',       href: '#', icon: ICONS.users },
		{ label: 'Permissions'            },
	];

	const itemStyles = [
		{ label: 'plain', value: 'plain' },
		{ label: 'soft',  value: 'soft'  },
		{ label: 'pill',  value: 'pill'  },
	] as const;

	/* interactive demo */
	const dynamicItems: BreadcrumbItem[] = [
		{ label: 'Home',      href: '#' },
		{ label: 'Analytics', href: '#' },
		{ label: 'Revenue',   href: '#' },
		{ label: 'Q4 Report', href: '#' },
		{ label: 'Edit' },
	];
	let currentPage = $state(3);
	const dynamicCrumbs = $derived(dynamicItems.slice(0, currentPage + 1));

	const props = [
		{ name: 'items', type: 'BreadcrumbItem[]', default: '—', description: 'Required. Array of breadcrumb steps. Each item: { label: string; href?: string; icon?: string }. The last item is treated as the current page.' },
		{ name: 'separator', type: "'slash' | 'chevron' | 'dot' | 'arrow'", default: "'chevron'", description: 'Separator rendered between items.' },
		{ name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Text and icon size.' },
		{ name: 'itemStyle', type: "'plain' | 'soft' | 'pill'", default: "'plain'", description: 'Visual style applied to the current (last) item.' },
		{ name: 'maxVisible', type: 'number', default: '0', description: 'Maximum number of items to show. When exceeded, middle items collapse into a clickable ellipsis. 0 means show all.' },
		{ name: 'class', type: 'string', default: 'undefined', description: 'Extra CSS classes for the root nav element.' },
	];
</script>

<div class="comp-header">
	<div class="comp-header-top">
		<h1 class="comp-title">Breadcrumb</h1>
		<span class="comp-badge">Navigation</span>
	</div>
	<p class="comp-desc">Navigation trail with 4 separator styles, icon support, 3 item styles, 3 sizes, and collapsible long paths.</p>
</div>

<section class="doc-section">
	<h2 class="doc-section-title">Import</h2>
	<CodeBlock code={importCode} lang="ts" />
</section>

<section class="doc-section">
	<h2 class="doc-section-title">Usage</h2>
	<div class="preview-box preview-box-accent">
		<Breadcrumb items={basic} />
	</div>
	<CodeBlock code={usageCode} lang="svelte" />
</section>

<section class="doc-section">
	<h2 class="doc-section-title">Separators</h2>
	<p class="doc-section-desc">Four separator styles: <code>chevron</code> (default), <code>slash</code>, <code>dot</code>, <code>arrow</code>.</p>
	<div class="preview-box" style="flex-direction: column; align-items: stretch;">
		<div class="sep-list">
			{#each (['chevron', 'slash', 'dot', 'arrow'] as const) as sep}
				<div class="sep-row">
					<span class="sep-label">{sep}</span>
					<div class="crumb-surface">
						<Breadcrumb items={basic} separator={sep} />
					</div>
				</div>
			{/each}
		</div>
	</div>
	<CodeBlock code={separatorsCode} lang="svelte" />
</section>

<section class="doc-section">
	<h2 class="doc-section-title">With Icons</h2>
	<p class="doc-section-desc">Add an <code>icon</code> SVG path string to any item to display an icon before the label.</p>
	<div class="preview-box">
		<div class="crumb-surface" style="width: 100%;">
			<Breadcrumb items={withIcons} separator="chevron" />
		</div>
	</div>
	<CodeBlock code={iconsCode} lang="svelte" />
</section>

<section class="doc-section">
	<h2 class="doc-section-title">Item Styles</h2>
	<p class="doc-section-desc">The <code>itemStyle</code> prop controls the appearance of the current page item: <code>plain</code>, <code>soft</code>, or <code>pill</code>.</p>
	<div class="preview-box" style="flex-direction: column; align-items: stretch;">
		<div class="sep-list">
			{#each itemStyles as style}
				<div class="sep-row">
					<span class="sep-label">{style.label}</span>
					<div class="crumb-surface">
						<Breadcrumb items={settingsPath} itemStyle={style.value} />
					</div>
				</div>
			{/each}
		</div>
	</div>
	<CodeBlock code={itemStyleCode} lang="svelte" />
</section>

<section class="doc-section">
	<h2 class="doc-section-title">Sizes</h2>
	<p class="doc-section-desc"><code>sm</code>, <code>md</code> (default), <code>lg</code>.</p>
	<div class="preview-box" style="flex-direction: column; align-items: stretch;">
		<div class="sep-list">
			{#each (['sm', 'md', 'lg'] as const) as s}
				<div class="sep-row">
					<span class="sep-label">{s}</span>
					<div class="crumb-surface">
						<Breadcrumb items={settingsPath} size={s} />
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>

<section class="doc-section">
	<h2 class="doc-section-title">Collapse Long Paths</h2>
	<p class="doc-section-desc">Set <code>maxVisible</code> to truncate middle items. Click the <code>...</code> ellipsis to expand them.</p>
	<div class="preview-box" style="flex-direction: column; align-items: stretch; gap: 0.75rem;">
		<div class="crumb-surface">
			<p class="crumb-note">Collapsed — maxVisible=3 (click ... to expand)</p>
			<Breadcrumb items={longPath} maxVisible={3} />
		</div>
		<div class="crumb-surface">
			<p class="crumb-note">Full path — no maxVisible</p>
			<Breadcrumb items={longPath} />
		</div>
	</div>
	<CodeBlock code={collapseCode} lang="svelte" />
</section>

<section class="doc-section">
	<h2 class="doc-section-title">Dynamic — Click to Navigate</h2>
	<p class="doc-section-desc">Breadcrumb updates reactively as you navigate between pages.</p>
	<div class="preview-box" style="padding: 0; overflow: hidden; flex-direction: column; align-items: stretch;">
		<div class="dynamic-bar">
			<Breadcrumb items={dynamicCrumbs} separator="chevron" />
		</div>
		<div class="dynamic-body">
			<p class="dynamic-hint">Navigate to</p>
			<div class="dynamic-btns">
				{#each dynamicItems as item, i}
					<Button
						size="sm"
						variant={currentPage === i ? 'primary' : 'secondary'}
						onclick={() => currentPage = i}
					>
						{item.label}
					</Button>
				{/each}
			</div>
		</div>
	</div>
</section>

<section class="doc-section">
	<h2 class="doc-section-title">Use Case — Dashboard Topbar</h2>
	<p class="doc-section-desc">Breadcrumb placed in a topbar alongside a page title and action buttons.</p>
	<div class="preview-box" style="padding: 0; overflow: hidden; flex-direction: column; align-items: stretch;">
		<div class="topbar">
			<div class="topbar-left">
				<Breadcrumb
					items={[
						{ label: 'Dashboard', href: '#', icon: ICONS.home  },
						{ label: 'Analytics', href: '#', icon: ICONS.chart },
						{ label: 'Revenue' },
					]}
					size="sm"
					separator="slash"
					itemStyle="soft"
				/>
				<h1 class="topbar-title">Revenue Overview</h1>
			</div>
			<div class="topbar-actions">
				<Button variant="secondary" size="sm">Export</Button>
				<Button size="sm">+ New Report</Button>
			</div>
		</div>
		<div class="mock-content">
			{#each [['Total Revenue', '$48,295', '+22%'], ['This Month', '$8,420', '+6%'], ['Last Month', '$6,890', '-3%']] as [lbl, val, chg]}
				<div class="mock-card">
					<p class="mock-label">{lbl}</p>
					<p class="mock-value">{val}</p>
					<p class="mock-change {chg.startsWith('+') ? 'positive' : 'negative'}">{chg}</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<section class="doc-section">
	<h2 class="doc-section-title">API Reference</h2>
	<PropsTable {props} />
</section>

<style>
	.comp-header { margin-bottom: 2.5rem; padding-bottom: 1.5rem; border-bottom: 1px solid var(--border); }
	.comp-header-top { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.5rem; }
	.comp-title { font-size: 1.875rem; font-weight: 800; letter-spacing: -0.025em; color: var(--foreground); }
	.comp-badge { font-size: 0.65rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; background: color-mix(in srgb, var(--accent) 15%, transparent); color: var(--accent); border: 1px solid color-mix(in srgb, var(--accent) 30%, transparent); padding: 0.15rem 0.5rem; border-radius: 9999px; }
	.comp-desc { color: var(--muted-foreground); font-size: 0.9375rem; line-height: 1.6; margin-bottom: 1rem; }
	.doc-section { margin-bottom: 2.5rem; display: flex; flex-direction: column; gap: 1rem; }
	.doc-section-title { font-size: 1.125rem; font-weight: 700; color: var(--foreground); letter-spacing: -0.01em; }
	.doc-section-desc { font-size: 0.875rem; color: var(--muted-foreground); margin-top: -0.5rem; }
	.doc-section-desc code { font-family: ui-monospace, monospace; font-size: 0.8em; background: var(--muted); padding: 0.1rem 0.35rem; border-radius: 0.25rem; color: var(--accent); }
	.preview-box { padding: 2rem; border: 1px solid var(--border); border-radius: 0.875rem; background: var(--card); display: flex; align-items: center; justify-content: center; min-height: 6rem; flex-wrap: wrap; gap: 0.75rem; }
	.preview-box-accent { background: radial-gradient(ellipse 80% 60% at 50% 0%, color-mix(in srgb, var(--accent) 8%, transparent), transparent); }

	.sep-list { display: flex; flex-direction: column; gap: 0.75rem; width: 100%; }
	.sep-row { display: flex; align-items: center; gap: 1rem; }
	.sep-label { flex-shrink: 0; width: 4rem; font-size: 0.75rem; font-family: ui-monospace, monospace; color: var(--muted-foreground); }
	.crumb-surface { flex: 1; border-radius: 0.75rem; background: var(--background); border: 1px solid var(--border); padding: 0.75rem 1rem; }
	.crumb-note { font-size: 0.75rem; color: var(--muted-foreground); margin-bottom: 0.5rem; }

	.dynamic-bar { display: flex; align-items: center; gap: 0.5rem; border-bottom: 1px solid var(--border); padding: 0.75rem 1.25rem; background: color-mix(in srgb, var(--muted) 30%, transparent); }
	.dynamic-body { padding: 1.25rem; }
	.dynamic-hint { font-size: 0.75rem; color: var(--muted-foreground); font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.75rem; }
	.dynamic-btns { display: flex; flex-wrap: wrap; gap: 0.5rem; }

	.topbar { display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid var(--border); padding: 1rem 1.5rem; }
	.topbar-left { display: flex; flex-direction: column; gap: 0.25rem; }
	.topbar-title { font-size: 1.125rem; font-weight: 700; color: var(--foreground); margin-top: 0.125rem; }
	.topbar-actions { display: flex; align-items: center; gap: 0.5rem; }
	.mock-content { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.75rem; padding: 1.5rem; }
	.mock-card { border-radius: 0.75rem; border: 1px solid var(--border); background: var(--background); padding: 1rem; }
	.mock-label { font-size: 0.75rem; color: var(--muted-foreground); }
	.mock-value { margin-top: 0.25rem; font-size: 1.25rem; font-weight: 700; color: var(--foreground); }
	.mock-change { font-size: 0.75rem; }
	.positive { color: #10b981; }
	.negative { color: #f87171; }
</style>
