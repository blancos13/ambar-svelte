<script lang="ts">
	import Tabs from '$lib/components/Tabs.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import PropsTable from '$lib/components/PropsTable.svelte';

	type Anim = 'spring' | 'smooth' | 'snappy' | 'elastic' | 'bounce';

	let v = $state({ line: 'home', pill: 'following', card: 'all', icon: 'video', full: 'foryou', anim: 'foryou', vert: 'home' });
	let playAnim = $state<Anim>('smooth');

	const feed   = [{ value:'foryou', label:'For You' }, { value:'following', label:'Following' }, { value:'live', label:'Live' }];
	const nav    = [{ value:'home', label:'Home' }, { value:'explore', label:'Explore' }, { value:'inbox', label:'Inbox' }, { value:'profile', label:'Profile' }];
	const filter = [{ value:'all', label:'All' }, { value:'video', label:'Video' }, { value:'photo', label:'Photo' }, { value:'live', label:'Live', disabled: true }];

	const svgVideo  = `<svg class="size-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>`;
	const svgMusic  = `<svg class="size-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>`;
	const svgGame   = `<svg class="size-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="6" y1="12" x2="10" y2="12"/><line x1="8" y1="10" x2="8" y2="14"/><circle cx="15" cy="11" r="1" fill="currentColor"/><circle cx="17" cy="13" r="1" fill="currentColor"/><rect x="2" y="6" width="20" height="12" rx="4"/></svg>`;
	const svgFood   = `<svg class="size-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>`;
	const svgTravel = `<svg class="size-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.99 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.9 1.17h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 8.91a16 16 0 0 0 5.98 5.98l1.2-1.2a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`;

	const iconTabs = [
		{ value:'video',  label:'Video',  icon: svgVideo  },
		{ value:'music',  label:'Music',  icon: svgMusic  },
		{ value:'gaming', label:'Gaming', icon: svgGame   },
		{ value:'food',   label:'Food',   icon: svgFood   },
		{ value:'travel', label:'Travel', icon: svgTravel },
	];

	const anims: { value: Anim; label: string; desc: string }[] = [
		{ value:'smooth',  label:'Smooth',  desc:'Default — smooth transition' },
		{ value:'spring',  label:'Spring',  desc:'Slight overshoot'            },
		{ value:'snappy',  label:'Snappy',  desc:'Fast & sharp'                },
		{ value:'elastic', label:'Elastic', desc:'Bounces back'                },
		{ value:'bounce',  label:'Bounce',  desc:'Hard bounce'                 },
	];

	const importCode = `import Tabs from '$lib/components/Tabs.svelte';`;

	const usageCode = `<script lang="ts">
  import Tabs from '$lib/components/Tabs.svelte';

  const tabs = [
    { value: 'home',    label: 'Home'    },
    { value: 'explore', label: 'Explore' },
    { value: 'inbox',   label: 'Inbox'   },
  ];

  let active = $state('home');
<\/script>

<Tabs bind:value={active} {tabs} variant="pill" />`;

	const iconCode = `const tabs = [
  { value: 'video', label: 'Video', icon: '<svg ...>' },
  { value: 'music', label: 'Music', icon: '<svg ...>' },
];

<Tabs bind:value={active} {tabs} variant="card" />`;

	const props = [
		{ name: 'tabs',      type: 'Tab[]',                                              default: '—',         description: 'Array of tab definitions.' },
		{ name: 'value',     type: 'string',                                             default: "''",        description: 'Bindable active tab value.' },
		{ name: 'variant',   type: "'line' | 'pill' | 'card'",                           default: "'line'",    description: 'Visual style of the tab bar.' },
		{ name: 'animation', type: "'smooth' | 'spring' | 'snappy' | 'elastic' | 'bounce'", default: "'smooth'", description: 'Easing curve used for the sliding indicator.' },
		{ name: 'fullWidth', type: 'boolean',                                            default: 'false',     description: 'Stretches tabs to fill the container width.' },
		{ name: 'vertical',  type: 'boolean',                                            default: 'false',     description: 'Stacks tabs vertically with the indicator on the right edge.' },
		{ name: 'onchange',  type: '(value: string) => void',                            default: '—',         description: 'Callback fired when the active tab changes.' },
	];

	const tabProps = [
		{ name: 'value',    type: 'string',  default: '—',     description: 'Unique identifier for the tab.' },
		{ name: 'label',    type: 'string',  default: '—',     description: 'Display text.' },
		{ name: 'icon',     type: 'string',  default: '—',     description: 'SVG HTML string rendered before the label.' },
		{ name: 'disabled', type: 'boolean', default: 'false', description: 'Grays out the tab and shows a lock icon.' },
	];
</script>

<div class="comp-header">
	<div class="comp-header-top">
		<h1 class="comp-title">Tabs</h1>
	</div>
	<p class="comp-desc">3 variants — line, pill, card — 5 animations, sliding indicator, vertical orientation.</p>
</div>

<section class="doc-section">
	<h2 class="doc-section-title">Import</h2>
	<CodeBlock code={importCode} lang="ts" />
</section>

<section class="doc-section">
	<h2 class="doc-section-title">Usage</h2>
	<div class="preview-box">
		<Tabs bind:value={v.pill} tabs={feed} variant="pill" />
	</div>
	<CodeBlock code={usageCode} lang="svelte" />
</section>

<section class="doc-section">
	<h2 class="doc-section-title">Line</h2>
	<p class="doc-section-desc">Sliding underline indicator — classic navigation style.</p>
	<div class="preview-box" style="flex-direction: column; align-items: flex-start; gap: 1rem;">
		<Tabs bind:value={v.line} tabs={nav} variant="line" />
		<div class="rounded-2xl bg-muted px-5 py-3">
			<p class="text-sm text-muted-foreground">Active: <strong class="text-foreground">{v.line}</strong></p>
		</div>
	</div>
</section>

<section class="doc-section">
	<h2 class="doc-section-title">Pill</h2>
	<p class="doc-section-desc">Floating pill background — suitable for feed or filter switching.</p>
	<div class="preview-box">
		<Tabs bind:value={v.pill} tabs={feed} variant="pill" />
	</div>
</section>

<section class="doc-section">
	<h2 class="doc-section-title">Card</h2>
	<p class="doc-section-desc">Card style with a lifted active tab — works well inside panels.</p>
	<div class="preview-box">
		<Tabs bind:value={v.card} tabs={filter} variant="card" />
	</div>
</section>

<section class="doc-section">
	<h2 class="doc-section-title">With Icons</h2>
	<p class="doc-section-desc">Pass an SVG HTML string via the <code>icon</code> field on each tab.</p>
	<div class="preview-box" style="flex-direction: column; align-items: flex-start; gap: 0.75rem;">
		<Tabs bind:value={v.icon} tabs={iconTabs} variant="pill" />
		<Tabs bind:value={v.icon} tabs={iconTabs} variant="card" />
		<Tabs bind:value={v.icon} tabs={iconTabs} variant="line" />
	</div>
	<CodeBlock code={iconCode} lang="svelte" />
</section>

<section class="doc-section">
	<h2 class="doc-section-title">Animations</h2>
	<p class="doc-section-desc">Choose the indicator movement easing with the <code>animation</code> prop.</p>
	<div class="preview-box preview-box-accent" style="flex-direction: column; align-items: flex-start; gap: 1.25rem;">
		<Tabs bind:value={v.anim} tabs={feed} variant="pill" animation={playAnim} />
		<Tabs bind:value={v.anim} tabs={feed} variant="line" animation={playAnim} />
		<div class="flex flex-wrap gap-2 border-t border-border pt-4 w-full">
			{#each anims as a}
				<button
					type="button"
					class="rounded-xl px-4 py-2 text-sm transition-all duration-100 active:scale-95
						{playAnim === a.value ? 'bg-accent text-accent-foreground font-semibold' : 'bg-muted text-muted-foreground hover:bg-border'}"
					onclick={() => (playAnim = a.value)}
				>
					<span class="font-medium">{a.label}</span>
					<span class="ml-1.5 text-xs opacity-70">{a.desc}</span>
				</button>
			{/each}
		</div>
	</div>
</section>

<section class="doc-section">
	<h2 class="doc-section-title">Vertical</h2>
	<p class="doc-section-desc">Add <code>vertical</code> — the indicator slides on the right edge (line) or left side (pill/card).</p>
	<div class="preview-box" style="align-items: flex-start; justify-content: flex-start; flex-wrap: wrap; gap: 1.5rem;">
		<div class="flex gap-4">
			<Tabs bind:value={v.vert} tabs={nav} variant="line" vertical />
			<div class="rounded-2xl bg-muted px-5 py-4">
				<p class="text-sm font-semibold text-foreground">{v.vert}</p>
				<p class="mt-1 text-xs text-muted-foreground">Active page</p>
			</div>
		</div>
		<Tabs bind:value={v.vert} tabs={nav} variant="pill" vertical />
		<Tabs bind:value={v.vert} tabs={nav} variant="card" vertical />
	</div>
</section>

<section class="doc-section">
	<h2 class="doc-section-title">Disabled</h2>
	<p class="doc-section-desc">Set <code>disabled: true</code> on any tab — it shows a lock icon and blocks interaction.</p>
	<div class="preview-box" style="flex-direction: column; gap: 0.75rem;">
		<Tabs bind:value={v.card} tabs={filter} variant="line" />
		<Tabs bind:value={v.card} tabs={filter} variant="pill" />
		<Tabs bind:value={v.card} tabs={filter} variant="card" />
	</div>
</section>

<section class="doc-section">
	<h2 class="doc-section-title">Full Width</h2>
	<p class="doc-section-desc">Add <code>fullWidth</code> — tabs share the container width equally.</p>
	<div class="preview-box" style="flex-direction: column; gap: 0.75rem;">
		<div class="w-full max-w-sm space-y-3">
			<Tabs bind:value={v.full} tabs={feed} variant="line" fullWidth />
			<Tabs bind:value={v.full} tabs={feed} variant="pill" fullWidth />
			<Tabs bind:value={v.full} tabs={feed} variant="card" fullWidth />
		</div>
	</div>
</section>

<section class="doc-section">
	<h2 class="doc-section-title">API Reference</h2>
	<h3 class="doc-section-sub">Tabs Props</h3>
	<PropsTable props={props} />
	<h3 class="doc-section-sub" style="margin-top: 1.5rem;">Tab Object Fields</h3>
	<PropsTable props={tabProps} />
</section>

<style>
	.comp-header { margin-bottom: 2.5rem; padding-bottom: 1.5rem; border-bottom: 1px solid var(--border); }
	.comp-header-top { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.5rem; }
	.comp-title { font-size: 1.875rem; font-weight: 800; letter-spacing: -0.025em; color: var(--foreground); }
	.comp-desc { color: var(--muted-foreground); font-size: 0.9375rem; line-height: 1.6; margin-bottom: 1rem; }
	.doc-section { margin-bottom: 2.5rem; display: flex; flex-direction: column; gap: 1rem; }
	.doc-section-title { font-size: 1.125rem; font-weight: 700; color: var(--foreground); letter-spacing: -0.01em; }
	.doc-section-sub { font-size: 0.9375rem; font-weight: 600; color: var(--foreground); }
	.doc-section-desc { font-size: 0.875rem; color: var(--muted-foreground); margin-top: -0.5rem; }
	.doc-section-desc code { font-family: ui-monospace, monospace; font-size: 0.8em; background: var(--muted); padding: 0.1rem 0.35rem; border-radius: 0.25rem; color: var(--accent); }
	.preview-box { padding: 2rem; border: 1px solid var(--border); border-radius: 0.875rem; background: var(--card); display: flex; align-items: center; justify-content: center; min-height: 6rem; flex-wrap: wrap; gap: 0.75rem; }
	.preview-box-accent { background: radial-gradient(ellipse 80% 60% at 50% 0%, color-mix(in srgb, var(--accent) 8%, transparent), transparent); }
</style>
