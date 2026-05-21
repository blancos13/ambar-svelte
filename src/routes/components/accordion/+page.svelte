<script lang="ts">
	import Accordion from '$lib/components/Accordion.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import PropsTable from '$lib/components/PropsTable.svelte';

	type Anim = 'smooth' | 'spring' | 'snappy' | 'elastic' | 'bounce';
	let playAnim = $state<Anim>('smooth');

	const anims: { value: Anim; label: string; desc: string }[] = [
		{ value: 'smooth',  label: 'Smooth',  desc: 'Default'          },
		{ value: 'snappy',  label: 'Snappy',  desc: 'Fast & sharp'     },
		{ value: 'spring',  label: 'Spring',  desc: 'Slight overshoot' },
		{ value: 'elastic', label: 'Elastic', desc: 'Bounces back'     },
		{ value: 'bounce',  label: 'Bounce',  desc: 'Hard bounce'      },
	];

	const importCode = `import Accordion from '$lib/components/Accordion.svelte';`;

	const usageCode = `<script lang="ts">
  import Accordion from '$lib/components/Accordion.svelte';
<\/script>

{#snippet answerOne()}
  <p>Ambar UI is a Svelte 5 component library with zero dependencies.</p>
{/snippet}
{#snippet answerTwo()}
  <p>Copy components into $lib/components and import them directly.</p>
{/snippet}

<Accordion items={[
  { value: 'q1', title: 'What is Ambar UI?', children: answerOne },
  { value: 'q2', title: 'How do I install it?', children: answerTwo },
]} />`;

	const variantsCode = `<!-- Default: single open, bordered -->
<Accordion variant="default" {items} />

<!-- Card: each item is its own card, supports multiple -->
<Accordion variant="card" multiple {items} />

<!-- Flush: no borders, ideal for FAQ sections -->
<Accordion variant="flush" {items} />`;

	const multipleCode = `<Accordion multiple defaultOpen={['q1', 'q2']} {items} />`;

	const animationsCode = `<Accordion animation="smooth"  {items} />
<Accordion animation="snappy"  {items} />
<Accordion animation="spring"  {items} />
<Accordion animation="elastic" {items} />
<Accordion animation="bounce"  {items} />`;

	const disabledCode = `<Accordion items={[
  { value: 'a', title: 'Active item',   children: content },
  { value: 'b', title: 'Disabled item', disabled: true, children: content },
]} />`;

	const props = [
		{ name: 'items',       type: 'Item[]',                                                          required: true,  description: 'Array of accordion items. Each item has value, title, and children (Snippet).' },
		{ name: 'multiple',    type: 'boolean',                                                         default: 'false', description: 'When true, multiple panels can be open at the same time.' },
		{ name: 'variant',     type: "'default' | 'card' | 'flush'",                                    default: "'default'", description: 'Visual style of the accordion.' },
		{ name: 'animation',   type: "'smooth' | 'spring' | 'snappy' | 'elastic' | 'bounce'",           default: "'smooth'", description: 'Open/close animation preset.' },
		{ name: 'defaultOpen', type: 'string[]',                                                        default: '[]',   description: 'Array of item values that are open on initial render.' },
	];
</script>

<!-- Page header -->
<div class="comp-header">
	<div class="comp-header-top">
		<h1 class="comp-title">Accordion</h1>
	</div>
	<p class="comp-desc">Collapsible panels with 3 variants, 5 animations, multiple-open mode, icons, and disabled state.</p>
</div>

<!-- ── IMPORT ── -->
<section class="doc-section">
	<h2 class="doc-section-title">Import</h2>
	<CodeBlock code={importCode} lang="ts" />
</section>

<!-- ── USAGE ── -->
<section class="doc-section">
	<h2 class="doc-section-title">Usage</h2>
	<div class="preview-box" style="align-items: flex-start; justify-content: flex-start;">
		<div style="width: 100%; max-width: 36rem;">
			<Accordion items={[
				{ value: 'q1', title: 'What is Ambar UI?',   icon: infoIcon,    children: usageA },
				{ value: 'q2', title: 'How do I install it?', icon: packageIcon, children: usageB },
			]} />
		</div>
	</div>
	<CodeBlock code={usageCode} lang="svelte" />
</section>

<!-- ── VARIANTS ── -->
<section class="doc-section">
	<h2 class="doc-section-title">Variants</h2>
	<p class="doc-section-desc">Three layouts: <code>default</code> (bordered list), <code>card</code> (separate cards), <code>flush</code> (borderless for FAQ pages).</p>

	<h3 class="doc-sub-title">Default</h3>
	<p class="doc-section-desc">Single open — opening one panel closes the others.</p>
	<div class="preview-box" style="align-items: flex-start; justify-content: flex-start;">
		<div style="width: 100%; max-width: 36rem;">
			<Accordion variant="default" items={[
				{ value:'what',      title:'What is Ambar UI?',       hint:'Overview',           icon:infoIcon,     children: what      },
				{ value:'install',   title:'Installation',             hint:'Installation steps', icon:packageIcon,  children: install   },
				{ value:'customize', title:'Customizing the theme',                               icon:paletteIcon,  children: customize },
				{ value:'disabled',  title:'This option is disabled',  disabled:true,             icon:lockIcon,     children: empty     },
			]} />
		</div>
	</div>

	<h3 class="doc-sub-title">Card</h3>
	<p class="doc-section-desc">Separate cards with multiple open enabled.</p>
	<div class="preview-box" style="align-items: flex-start; justify-content: flex-start;">
		<div style="width: 100%; max-width: 36rem;">
			<Accordion variant="card" multiple defaultOpen={['plan']} items={[
				{ value:'plan',     title:'Free Plan',     hint:'Basic features', icon:starOutlineIcon, children: planFree },
				{ value:'pro',      title:'Pro',           hint:'$9/mo',          icon:starFillIcon,    children: planPro  },
				{ value:'business', title:'Business Plan', hint:'$29/mo',         icon:buildingIcon,    children: planBiz  },
			]} />
		</div>
	</div>

	<h3 class="doc-sub-title">Flush</h3>
	<p class="doc-section-desc">Borderless — ideal for FAQ pages.</p>
	<div class="preview-box" style="align-items: flex-start; justify-content: flex-start;">
		<div style="width: 100%; max-width: 36rem;">
			<Accordion variant="flush" items={[
				{ value:'q1', title:'How often is content updated?', icon:clockIcon, children: a1 },
				{ value:'q2', title:'How do I delete my account?',   icon:trashIcon, children: a2 },
				{ value:'q3', title:'I forgot my password.',          icon:keyIcon,   children: a3 },
			]} />
		</div>
	</div>

	<CodeBlock code={variantsCode} lang="svelte" />
</section>

<!-- ── MULTIPLE OPEN ── -->
<section class="doc-section">
	<h2 class="doc-section-title">Multiple Open</h2>
	<p class="doc-section-desc">Set <code>multiple</code> to allow several panels to be open simultaneously. Use <code>defaultOpen</code> to pre-expand items by value.</p>
	<CodeBlock code={multipleCode} lang="svelte" />
</section>

<!-- ── ANIMATIONS ── -->
<section class="doc-section">
	<h2 class="doc-section-title">Animations</h2>
	<p class="doc-section-desc">Five animation presets. Toggle between them below to compare.</p>
	<div class="anim-playground">
		<div style="max-width: 36rem; width: 100%;">
			<Accordion variant="default" animation={playAnim} items={[
				{ value:'a', title:'How does it work?',   icon:infoIcon,  children: animA },
				{ value:'b', title:'Why this animation?', icon:sparkIcon, children: animB },
				{ value:'c', title:'Usage example',       icon:codeIcon,  children: animC },
			]} />
		</div>
		<div class="anim-pills">
			{#each anims as a}
				<button
					type="button"
					class="anim-pill {playAnim === a.value ? 'anim-pill-active' : ''}"
					onclick={() => (playAnim = a.value)}
				>
					<span class="anim-pill-label">{a.label}</span>
					<span class="anim-pill-desc">{a.desc}</span>
				</button>
			{/each}
		</div>
	</div>
	<CodeBlock code={animationsCode} lang="svelte" />
</section>

<!-- ── DISABLED ── -->
<section class="doc-section">
	<h2 class="doc-section-title">Disabled Items</h2>
	<p class="doc-section-desc">Set <code>disabled: true</code> on any item to prevent it from being opened.</p>
	<CodeBlock code={disabledCode} lang="svelte" />
</section>

<!-- ── API REFERENCE ── -->
<section class="doc-section">
	<h2 class="doc-section-title">API Reference</h2>
	<p class="doc-section-desc">The <code>Item</code> type: <code>&#123; value: string; title: string; hint?: string; icon?: Snippet; disabled?: boolean; children: Snippet &#125;</code></p>
	<PropsTable {props} />
</section>

<!-- ══ SVG ICONS ══ -->
{#snippet infoIcon()}
	<svg class="size-4 shrink-0 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
{/snippet}
{#snippet packageIcon()}
	<svg class="size-4 shrink-0 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
{/snippet}
{#snippet paletteIcon()}
	<svg class="size-4 shrink-0 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>
{/snippet}
{#snippet lockIcon()}
	<svg class="size-4 shrink-0 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
{/snippet}
{#snippet starOutlineIcon()}
	<svg class="size-4 shrink-0 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
{/snippet}
{#snippet starFillIcon()}
	<svg class="size-4 shrink-0 text-accent" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
{/snippet}
{#snippet buildingIcon()}
	<svg class="size-4 shrink-0 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
{/snippet}
{#snippet clockIcon()}
	<svg class="size-4 shrink-0 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
{/snippet}
{#snippet trashIcon()}
	<svg class="size-4 shrink-0 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
{/snippet}
{#snippet keyIcon()}
	<svg class="size-4 shrink-0 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>
{/snippet}
{#snippet sparkIcon()}
	<svg class="size-4 shrink-0 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3l1.9 5.8a2 2 0 0 0 1.3 1.3L21 12l-5.8 1.9a2 2 0 0 0-1.3 1.3L12 21l-1.9-5.8a2 2 0 0 0-1.3-1.3L3 12l5.8-1.9a2 2 0 0 0 1.3-1.3L12 3z"/></svg>
{/snippet}
{#snippet codeIcon()}
	<svg class="size-4 shrink-0 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
{/snippet}

<!-- ══ CONTENT SNIPPETS ══ -->
{#snippet usageA()}<p>Ambar UI is a component library built with Svelte 5 and Tailwind CSS v4. Zero external dependencies, built-in animations, and full accessibility support.</p>{/snippet}
{#snippet usageB()}
	<div class="space-y-2">
		<p>Copy components into <code class="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">$lib/components</code> and import them.</p>
		<div class="rounded-lg bg-muted px-3 py-2 font-mono text-xs text-foreground">import Accordion from '$lib/components/Accordion.svelte';</div>
	</div>
{/snippet}

{#snippet what()}<p>Ambar UI is a component library built with Svelte 5 and Tailwind CSS v4. Zero external dependencies, built-in animations, and full accessibility support.</p>{/snippet}
{#snippet install()}
	<div class="space-y-2">
		<p>Copy components into <code class="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">$lib/components</code> and import them.</p>
		<div class="rounded-lg bg-muted px-3 py-2 font-mono text-xs text-foreground">import Accordion from '$lib/components/Accordion.svelte';</div>
	</div>
{/snippet}
{#snippet customize()}<p>Edit CSS custom properties in <code class="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">app.css</code>. Changing the <code class="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">--accent</code> and <code class="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">--card</code> tokens customizes the entire theme.</p>{/snippet}
{#snippet empty()}<span></span>{/snippet}

{#snippet planFree()}
	<ul class="space-y-2 text-sm">
		<li class="flex items-center gap-2"><svg class="size-4 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg>5 videos/month</li>
		<li class="flex items-center gap-2"><svg class="size-4 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg>720p quality</li>
		<li class="flex items-center gap-2"><svg class="size-4 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg><span class="text-muted-foreground">Analytics</span></li>
	</ul>
{/snippet}
{#snippet planPro()}
	<ul class="space-y-2 text-sm">
		{#each ['Unlimited videos','4K quality','Analytics dashboard','Priority support'] as f}
			<li class="flex items-center gap-2"><svg class="size-4 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg>{f}</li>
		{/each}
	</ul>
{/snippet}
{#snippet planBiz()}
	<ul class="space-y-2 text-sm">
		{#each ['Everything in Pro','Team accounts','API access','Custom white-labeling'] as f}
			<li class="flex items-center gap-2"><svg class="size-4 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg>{f}</li>
		{/each}
	</ul>
{/snippet}

{#snippet a1()}<p>Content is updated daily. Trending videos refresh every hour, recommendations every 6 hours.</p>{/snippet}
{#snippet a2()}<p>Go to Settings → Account → Delete Account. Deletion is permanent and cannot be undone.</p>{/snippet}
{#snippet a3()}<p>Click the "Forgot Password" link on the login screen. A reset link will be sent to your email.</p>{/snippet}

{#snippet animA()}<p>Smooth animation is achieved without JavaScript height calculations using the <code class="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">grid-template-rows: 0fr → 1fr</code> CSS trick.</p>{/snippet}
{#snippet animB()}<p>Each animation uses a different cubic-bezier curve. <strong>Snappy</strong> is recommended for drag-and-drop actions, <strong>bounce</strong> for celebration screens.</p>{/snippet}
{#snippet animC()}<div class="rounded-lg bg-muted px-3 py-2 font-mono text-xs text-foreground">&lt;Accordion animation="spring" ... /&gt;</div>{/snippet}

<style>
	.comp-header { margin-bottom: 2.5rem; padding-bottom: 1.5rem; border-bottom: 1px solid var(--border); }
	.comp-header-top { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.5rem; }
	.comp-title { font-size: 1.875rem; font-weight: 800; letter-spacing: -0.025em; color: var(--foreground); }
	.comp-desc { color: var(--muted-foreground); font-size: 0.9375rem; line-height: 1.6; margin-bottom: 1rem; }
	.doc-section { margin-bottom: 2.5rem; display: flex; flex-direction: column; gap: 1rem; }
	.doc-section-title { font-size: 1.125rem; font-weight: 700; color: var(--foreground); letter-spacing: -0.01em; }
	.doc-section-desc { font-size: 0.875rem; color: var(--muted-foreground); margin-top: -0.5rem; }
	.doc-section-desc code { font-family: ui-monospace, monospace; font-size: 0.8em; background: var(--muted); padding: 0.1rem 0.35rem; border-radius: 0.25rem; color: var(--accent); }
	.preview-box { padding: 2rem; border: 1px solid var(--border); border-radius: 0.875rem; background: var(--card); display: flex; align-items: center; justify-content: center; min-height: 6rem; flex-wrap: wrap; gap: 0.75rem; }

	.doc-sub-title {
		font-size: 0.9375rem;
		font-weight: 600;
		color: var(--foreground);
		margin-top: 0.25rem;
	}

	.anim-playground {
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
		padding: 1.5rem;
		border: 1px solid var(--border);
		border-radius: 0.875rem;
		background: var(--card);
	}

	.anim-pills {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		padding-top: 1.25rem;
		border-top: 1px solid var(--border);
	}

	.anim-pill {
		display: inline-flex;
		align-items: center;
		gap: 0.375rem;
		padding: 0.375rem 0.875rem;
		border-radius: 0.75rem;
		font-size: 0.875rem;
		background: var(--muted);
		color: var(--muted-foreground);
		border: none;
		cursor: pointer;
		transition: background 0.1s, color 0.1s;
	}

	.anim-pill:hover {
		background: var(--border);
	}

	.anim-pill-active {
		background: var(--accent);
		color: var(--accent-foreground);
		font-weight: 600;
	}

	.anim-pill-label {
		font-weight: 500;
	}

	.anim-pill-desc {
		font-size: 0.75rem;
		opacity: 0.7;
	}
</style>
