<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Tooltip from '$lib/components/Tooltip.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import PropsTable from '$lib/components/PropsTable.svelte';

	const importCode = `import Tooltip from '$lib/components/Tooltip.svelte';`;

	const usageCode = `<Tooltip content="Hello!" placement="top">
  <Button>Hover me</Button>
</Tooltip>`;

	const placementsCode = `<Tooltip content="top-start" placement="top-start">
  <Button variant="secondary" size="sm">top-start</Button>
</Tooltip>
<Tooltip content="top" placement="top">
  <Button variant="secondary" size="sm">top</Button>
</Tooltip>
<Tooltip content="bottom" placement="bottom">
  <Button variant="secondary" size="sm">bottom</Button>
</Tooltip>`;

	const snippetCode = `<Tooltip placement="top">
  {#snippet content()}
    <span class="flex items-center gap-1.5">
      <svg .../>
      <span>Shortcut: <strong>Cmd K</strong></span>
    </span>
  {/snippet}
  <Button variant="secondary">Snippet</Button>
</Tooltip>`;

	const delayCode = `<Tooltip content="Instant" placement="top" delay={0}>
  <Button variant="secondary">0ms</Button>
</Tooltip>
<Tooltip content="Default delay" placement="top" delay={300}>
  <Button variant="secondary">300ms</Button>
</Tooltip>`;

	const disabledCode = `<Tooltip content="This does not appear" placement="top" disabled={true}>
  <Button disabled>Disabled</Button>
</Tooltip>`;

	const props = [
		{ name: 'content', type: 'string | Snippet', description: 'Tooltip text or rich snippet content to display.' },
		{ name: 'placement', type: "'top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end' | 'left' | 'right'", default: "'top'", description: 'Preferred placement of the tooltip relative to the trigger.' },
		{ name: 'delay', type: 'number', default: '300', description: 'Milliseconds before the tooltip appears on hover.' },
		{ name: 'offset', type: 'number', default: '8', description: 'Distance in pixels between the tooltip and the trigger element.' },
		{ name: 'disabled', type: 'boolean', default: 'false', description: 'When true, prevents the tooltip from opening.' },
		{ name: 'children', type: 'Snippet', description: 'The trigger element that the tooltip is attached to.' },
	];
</script>

<!-- Header -->
<div class="comp-header">
	<div class="comp-header-top">
		<h1 class="comp-title">Tooltip</h1>
	</div>
	<p class="comp-desc">Floating label with 8 placements, auto-flip, arrow, configurable delay, and snippet content support.</p>
</div>

<!-- Import -->
<section class="doc-section">
	<h2 class="doc-section-title">Import</h2>
	<CodeBlock code={importCode} lang="ts" />
</section>

<!-- Usage -->
<section class="doc-section">
	<h2 class="doc-section-title">Usage</h2>
	<div class="preview-box">
		<Tooltip content="Hello!" placement="top">
			<Button variant="secondary">Hover me</Button>
		</Tooltip>
	</div>
	<CodeBlock code={usageCode} lang="svelte" />
</section>

<!-- Placements -->
<section class="doc-section">
	<h2 class="doc-section-title">Placements</h2>
	<p class="doc-section-desc">Top, bottom, left, right plus start/end variants.</p>
	<div class="preview-box">
		<div class="grid max-w-sm grid-cols-3 gap-3">
			<Tooltip content="top-start" placement="top-start">
				<Button variant="secondary" size="sm" fullWidth>top-start</Button>
			</Tooltip>
			<Tooltip content="top" placement="top">
				<Button variant="secondary" size="sm" fullWidth>top</Button>
			</Tooltip>
			<Tooltip content="top-end" placement="top-end">
				<Button variant="secondary" size="sm" fullWidth>top-end</Button>
			</Tooltip>

			<Tooltip content="left" placement="left">
				<Button variant="secondary" size="sm" fullWidth>left</Button>
			</Tooltip>
			<div class="flex items-center justify-center">
				<span class="text-xs text-muted-foreground">hover</span>
			</div>
			<Tooltip content="right" placement="right">
				<Button variant="secondary" size="sm" fullWidth>right</Button>
			</Tooltip>

			<Tooltip content="bottom-start" placement="bottom-start">
				<Button variant="secondary" size="sm" fullWidth>btm-start</Button>
			</Tooltip>
			<Tooltip content="bottom" placement="bottom">
				<Button variant="secondary" size="sm" fullWidth>bottom</Button>
			</Tooltip>
			<Tooltip content="bottom-end" placement="bottom-end">
				<Button variant="secondary" size="sm" fullWidth>btm-end</Button>
			</Tooltip>
		</div>
	</div>
	<CodeBlock code={placementsCode} lang="svelte" />
</section>

<!-- Content -->
<section class="doc-section">
	<h2 class="doc-section-title">Content</h2>
	<p class="doc-section-desc">String or snippet content with icon, emphasis, and multi-line layouts.</p>
	<div class="preview-box">
		<div class="flex flex-wrap items-center gap-4">
			<Tooltip content="Simple text tooltip" placement="top">
				<Button variant="secondary">String</Button>
			</Tooltip>

			<Tooltip placement="top">
				{#snippet content()}
					<span class="flex items-center gap-1.5">
						<svg class="size-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
							<path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
							<path d="M12 8v4m0 4h.01"/>
						</svg>
						<span>Shortcut: <strong>Cmd K</strong></span>
					</span>
				{/snippet}
				<Button variant="secondary">Snippet</Button>
			</Tooltip>

			<Tooltip placement="top">
				{#snippet content()}
					<span>This tooltip has <strong>multi-line</strong> content and a longer body.</span>
				{/snippet}
				<Button variant="secondary">Multi-line</Button>
			</Tooltip>

			<Tooltip content="Copy" placement="top">
				<Button variant="secondary" size="sm" class="gap-1.5">
					<svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
					</svg>
					Copy
				</Button>
			</Tooltip>
		</div>
	</div>
	<CodeBlock code={snippetCode} lang="svelte" />
</section>

<!-- Delay -->
<section class="doc-section">
	<h2 class="doc-section-title">Delay</h2>
	<p class="doc-section-desc">Show immediately, with the default delay, or with a slower delay.</p>
	<div class="preview-box">
		<div class="flex flex-wrap items-center gap-4">
			<Tooltip content="Instant" placement="top" delay={0}>
				<Button variant="secondary">0ms</Button>
			</Tooltip>
			<Tooltip content="Default delay" placement="top" delay={300}>
				<Button variant="secondary">300ms</Button>
			</Tooltip>
			<Tooltip content="Slow delay" placement="top" delay={800}>
				<Button variant="secondary">800ms</Button>
			</Tooltip>
		</div>
	</div>
	<CodeBlock code={delayCode} lang="svelte" />
</section>

<!-- Disabled -->
<section class="doc-section">
	<h2 class="doc-section-title">Disabled</h2>
	<p class="doc-section-desc"><code>disabled=true</code> prevents the tooltip from opening.</p>
	<div class="preview-box">
		<div class="flex flex-wrap items-center gap-4">
			<Tooltip content="This appears" placement="top" disabled={false}>
				<Button variant="secondary">Active</Button>
			</Tooltip>
			<Tooltip content="This does not appear" placement="top" disabled={true}>
				<Button variant="secondary" disabled>Disabled</Button>
			</Tooltip>
		</div>
	</div>
	<CodeBlock code={disabledCode} lang="svelte" />
</section>

<!-- Icon Buttons -->
<section class="doc-section">
	<h2 class="doc-section-title">Icon Buttons</h2>
	<p class="doc-section-desc">Tooltip labels for icon-only actions.</p>
	<div class="preview-box">
		<div class="flex items-center gap-2">
			{#each [
				{ icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', label: 'Home' },
				{ icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z', label: 'Search' },
				{ icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9', label: 'Notifications' },
				{ icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z', label: 'Settings' },
				{ icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z', label: 'Profile' },
			] as item}
				<Tooltip content={item.label} placement="bottom" delay={0}>
					<Button variant="icon" ariaLabel={item.label}>
						<svg class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
							<path d={item.icon}/>
						</svg>
					</Button>
				</Tooltip>
			{/each}
		</div>
	</div>
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
	.comp-badge { font-size: 0.65rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; background: color-mix(in srgb, var(--accent) 15%, transparent); color: var(--accent); border: 1px solid color-mix(in srgb, var(--accent) 30%, transparent); padding: 0.15rem 0.5rem; border-radius: 9999px; }
	.comp-desc { color: var(--muted-foreground); font-size: 0.9375rem; line-height: 1.6; margin-bottom: 1rem; }
	.doc-section { margin-bottom: 2.5rem; display: flex; flex-direction: column; gap: 1rem; }
	.doc-section-title { font-size: 1.125rem; font-weight: 700; color: var(--foreground); letter-spacing: -0.01em; }
	.doc-section-desc { font-size: 0.875rem; color: var(--muted-foreground); margin-top: -0.5rem; }
	.doc-section-desc code { font-family: ui-monospace, monospace; font-size: 0.8em; background: var(--muted); padding: 0.1rem 0.35rem; border-radius: 0.25rem; color: var(--accent); }
	.preview-box { padding: 2rem; border: 1px solid var(--border); border-radius: 0.875rem; background: var(--card); display: flex; align-items: center; justify-content: center; min-height: 6rem; flex-wrap: wrap; gap: 0.75rem; }
	.preview-box-accent { background: radial-gradient(ellipse 80% 60% at 50% 0%, color-mix(in srgb, var(--accent) 8%, transparent), transparent); }
</style>
