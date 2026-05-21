<script lang="ts">
	import Link from '$lib/components/Link.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import PropsTable from '$lib/components/PropsTable.svelte';

	const importCode = `import Link from '$lib/components/Link.svelte';`;

	const usageCode = `<Link href="/page" variant="accent">Go to page</Link>`;

	const inlineCode = `<!-- Default inline link -->
<Link href="/page">Creator tools</Link>

<!-- Accent link -->
<Link href="/analytics" variant="accent">Open analytics</Link>

<!-- Muted link -->
<Link href="/settings" variant="muted">Privacy settings</Link>

<!-- Disabled -->
<Link href="/page" disabled>Disabled link</Link>`;

	const decorationCode = `<Link href="#" variant="underline">Underline</Link>
<Link href="#" variant="double">Double</Link>
<Link href="#" variant="dotted">Dotted</Link>
<Link href="#" variant="dashed">Dashed</Link>
<Link href="#" variant="wavy">Wavy</Link>
<Link href="#" variant="overline">Overline</Link>
<Link href="#" variant="over-under">Over + under</Link>
<Link href="#" variant="strike">Strike</Link>
<Link href="#" variant="mark">Mark</Link>
<Link href="#" variant="reveal">Reveal</Link>`;

	const motionCode = `<Link href="#" variant="underline" motion="line">Creator fund</Link>
<Link href="#" variant="accent"   motion="scan">Live jump</Link>
<Link href="#" variant="dashed"   motion="dash">Draft route</Link>
<Link href="#" variant="muted"    motion="pulse">Quiet route</Link>
<Link href="#" variant="inline"   motion="glint">Boosted link</Link>
<Link href="#" variant="inline"   motion="highlight">Trending route</Link>`;

	const buttonCode = `<!-- Pill surface -->
<Link href="/profile" variant="pill" icon={ICONS.user}>Profile</Link>

<!-- Button surface -->
<Link href="/continue" variant="button" icon={ICONS.arrow} iconSide="right">Continue</Link>

<!-- External button -->
<Link href="https://github.com/blancos13/ambar-svelte" variant="button" external>GitHub</Link>

<!-- Icon-only -->
<Link href="/search" variant="icon" icon={ICONS.search} ariaLabel="Search" />`;

	const externalCode = `<Link href="https://example.com" external>Open in new tab</Link>`;

	const ICONS = {
		search: 'm21 21-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0Z',
		arrow: 'M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3',
		user: 'M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.5 20.25a8.25 8.25 0 0 1 15 0',
	};

	const decorations = [
		['underline', 'Underline'],
		['double', 'Double'],
		['dotted', 'Dotted'],
		['dashed', 'Dashed'],
		['wavy', 'Wavy'],
		['overline', 'Overline'],
		['over-under', 'Over + under'],
		['strike', 'Strike'],
		['strike-soft', 'Strike soft'],
		['mark', 'Mark'],
		['reveal', 'Reveal'],
	] as const;

	const props = [
		{ name: 'href', type: 'string', default: "'#'", description: 'The URL the link points to.' },
		{ name: 'variant', type: "'inline' | 'accent' | 'muted' | 'underline' | 'double' | 'dotted' | 'dashed' | 'wavy' | 'overline' | 'over-under' | 'strike' | 'strike-soft' | 'mark' | 'reveal' | 'pill' | 'button' | 'icon'", default: "'inline'", description: 'Visual style of the link. Text decoration variants apply CSS decoration. Surface variants (pill, button) render as a filled element.' },
		{ name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Font and minimum height size.' },
		{ name: 'motion', type: "'none' | 'line' | 'scan' | 'dash' | 'pulse' | 'glint' | 'highlight'", default: "'none'", description: 'Adds a looping ambient animation. Works on any variant.' },
		{ name: 'icon', type: 'string', default: 'undefined', description: 'SVG path data for an icon rendered alongside the label.' },
		{ name: 'iconSide', type: "'left' | 'right'", default: "'left'", description: 'Which side to place the icon.' },
		{ name: 'external', type: 'boolean', default: 'false', description: 'Adds target="_blank" and rel="noreferrer", and shows an external arrow icon.' },
		{ name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the link visually and functionally.' },
		{ name: 'animated', type: 'boolean', default: 'true', description: 'Enables hover micro-animations on decoration variants.' },
		{ name: 'ariaLabel', type: 'string', default: 'undefined', description: 'Accessible label, required for icon-only links.' },
		{ name: 'onclick', type: '(event: MouseEvent) => void', default: 'undefined', description: 'Click handler. Not called when the link is disabled.' },
		{ name: 'class', type: 'string', default: "''", description: 'Extra CSS classes to pass to the anchor element.' },
	];
</script>

<div class="comp-header">
	<div class="comp-header-top">
		<h1 class="comp-title">Link</h1>
		<span class="comp-badge">Navigation</span>
	</div>
	<p class="comp-desc">Navigation links with button-grade feedback: 17 decoration variants, 6 loop motion effects, pill and button surfaces, icon support, external state, and disabled state.</p>
</div>

<section class="doc-section">
	<h2 class="doc-section-title">Import</h2>
	<CodeBlock code={importCode} lang="ts" />
</section>

<section class="doc-section">
	<h2 class="doc-section-title">Usage</h2>
	<div class="preview-box preview-box-accent">
		<Link href="#" variant="accent" icon={ICONS.arrow} iconSide="right">Open analytics</Link>
	</div>
	<CodeBlock code={usageCode} lang="svelte" />
</section>

<section class="doc-section">
	<h2 class="doc-section-title">Inline Links</h2>
	<p class="doc-section-desc">Use <code>inline</code> for body text, <code>accent</code> for primary actions, <code>muted</code> for secondary routes.</p>
	<div class="preview-box">
		<p class="inline-prose">
			Use <Link href="#" variant="inline">inline links</Link> for normal text navigation,
			<Link href="#" variant="accent">accent links</Link> for the main jump,
			and <Link href="#" variant="muted">muted links</Link> for secondary routes.
		</p>
		<div class="row-wrap">
			<Link href="#" variant="inline">Creator tools</Link>
			<Link href="#" variant="accent" icon={ICONS.arrow} iconSide="right">Open analytics</Link>
			<Link href="#" variant="muted">Privacy settings</Link>
			<Link href="#" disabled>Disabled link</Link>
		</div>
	</div>
	<CodeBlock code={inlineCode} lang="svelte" />
</section>

<section class="doc-section">
	<h2 class="doc-section-title">Text Decoration</h2>
	<p class="doc-section-desc">Decoration variants let links read as text first, action second. Hover to see the animated interaction.</p>
	<div class="preview-box">
		<div class="row-wrap">
			{#each decorations as [variant, label]}
				<Link href="#" {variant}>{label}</Link>
			{/each}
		</div>
		<p class="inline-prose">
			Decoration variants are useful in context:
			<Link href="#" variant="dotted">terms</Link>,
			<Link href="#" variant="wavy">section jump</Link>,
			<Link href="#" variant="mark">highlighted route</Link>,
			or <Link href="#" variant="strike">removed route</Link>.
		</p>
	</div>
	<CodeBlock code={decorationCode} lang="svelte" />
</section>

<section class="doc-section">
	<h2 class="doc-section-title">Loop Motion</h2>
	<p class="doc-section-desc">The <code>motion</code> prop adds a looping ambient animation — works on any variant.</p>
	<div class="preview-box">
		<div class="row-wrap">
			<Link href="#" variant="underline" motion="line">Creator fund</Link>
			<Link href="#" variant="accent" motion="scan">Live jump</Link>
			<Link href="#" variant="dashed" motion="dash">Draft route</Link>
			<Link href="#" variant="muted" motion="pulse">Quiet route</Link>
			<Link href="#" variant="inline" motion="glint">Boosted link</Link>
			<Link href="#" variant="inline" motion="highlight">Trending route</Link>
		</div>
	</div>
	<CodeBlock code={motionCode} lang="svelte" />
</section>

<section class="doc-section">
	<h2 class="doc-section-title">Button Models</h2>
	<p class="doc-section-desc">Surface variants: <code>pill</code> renders on a secondary background, <code>button</code> uses the accent fill, <code>icon</code> is a square icon button.</p>
	<div class="preview-box">
		<div class="row-wrap">
			<Link href="#" variant="pill" icon={ICONS.user}>Profile</Link>
			<Link href="#" variant="pill" size="sm">Small pill</Link>
			<Link href="#" variant="button" icon={ICONS.arrow} iconSide="right">Continue</Link>
			<Link href="https://github.com/blancos13/ambar-svelte" variant="button" external>GitHub</Link>
			<Link href="#" variant="icon" icon={ICONS.search} ariaLabel="Search" />
		</div>
	</div>
	<CodeBlock code={buttonCode} lang="svelte" />
</section>

<section class="doc-section">
	<h2 class="doc-section-title">Sizes</h2>
	<p class="doc-section-desc"><code>sm</code>, <code>md</code> (default), and <code>lg</code> — affects font size and min-height for surface variants.</p>
	<div class="preview-box">
		<div class="row-wrap">
			<Link href="#" size="sm" variant="accent">Small</Link>
			<Link href="#" size="md" variant="accent">Medium</Link>
			<Link href="#" size="lg" variant="accent">Large</Link>
			<Link href="#" size="lg" variant="pill" icon={ICONS.arrow} iconSide="right">Large pill</Link>
		</div>
	</div>
</section>

<section class="doc-section">
	<h2 class="doc-section-title">External Links</h2>
	<p class="doc-section-desc">Pass <code>external</code> to open in a new tab. An arrow icon is appended automatically.</p>
	<div class="preview-box">
		<Link href="https://github.com/blancos13/ambar-svelte" variant="button" external>GitHub</Link>
		<Link href="https://svelte.dev" variant="accent" external>Svelte docs</Link>
	</div>
	<CodeBlock code={externalCode} lang="svelte" />
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

	.row-wrap { display: flex; flex-wrap: wrap; align-items: center; gap: 1rem 1.25rem; }
	.inline-prose { font-size: 0.875rem; line-height: 1.75; color: var(--muted-foreground); max-width: 42rem; }
</style>
