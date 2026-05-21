<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Popover from '$lib/components/Popover.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import PropsTable from '$lib/components/PropsTable.svelte';

	type Placement = 'top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end' | 'left' | 'right';
	type Anim = 'scale' | 'slide' | 'elastic' | 'flip' | 'bounce' | 'zoom';

	const placements: Placement[] = ['top-start','top','top-end','bottom-start','bottom','bottom-end','left','right'];
	const anims: Anim[] = ['scale','slide','elastic','flip','bounce','zoom'];

	const importCode = `import Popover from '$lib/components/Popover.svelte';`;

	const usageCode = `<Popover>
  {#snippet trigger({ toggle, open })}
    <Button variant={open ? 'primary' : 'secondary'} onclick={toggle}>
      Open Popover
    </Button>
  {/snippet}

  {#snippet children()}
    <div class="w-52 p-4">
      <p class="text-sm font-semibold">Hello!</p>
      <p class="mt-1 text-xs text-muted-foreground">This is a popover.</p>
    </div>
  {/snippet}
</Popover>`;

	const placementsCode = `<!-- 8 placement options -->
<Popover placement="top">...</Popover>
<Popover placement="top-start">...</Popover>
<Popover placement="top-end">...</Popover>
<Popover placement="bottom">...</Popover>
<Popover placement="bottom-start">...</Popover>
<Popover placement="bottom-end">...</Popover>
<Popover placement="left">...</Popover>
<Popover placement="right">...</Popover>`;

	const animationsCode = `<Popover animation="scale">...</Popover>
<Popover animation="slide">...</Popover>
<Popover animation="elastic">...</Popover>
<Popover animation="flip">...</Popover>
<Popover animation="bounce">...</Popover>
<Popover animation="zoom">...</Popover>`;

	const arrowCode = `<!-- Arrow enabled (default) -->
<Popover arrow={true}>...</Popover>

<!-- No arrow -->
<Popover arrow={false}>...</Popover>`;

	const profileCardCode = `<Popover placement="bottom-start" animation="scale">
  {#snippet trigger({ toggle })}
    <button onclick={toggle} class="...">
      <span class="avatar">A</span>
      @ui.engineer
    </button>
  {/snippet}

  {#snippet children()}
    <div class="w-72 p-5">
      <p class="font-bold">UI Engineer</p>
      <p class="text-sm text-muted-foreground">@ui.engineer</p>
      <div class="mt-3 flex gap-5 text-sm">
        <span><strong>512</strong> Following</span>
        <span><strong>18.2K</strong> Followers</span>
      </div>
      <Button class="mt-4" fullWidth>Follow</Button>
    </div>
  {/snippet}
</Popover>`;

	const props = [
		{ name: 'open',      type: 'boolean',                                                                                         default: 'false',    description: 'Bindable open state of the popover.' },
		{ name: 'placement', type: "'top' | 'bottom' | 'left' | 'right' | 'top-start' | 'top-end' | 'bottom-start' | 'bottom-end'",  default: "'bottom'", description: 'Preferred placement. Auto-flips near viewport edges.' },
		{ name: 'offset',    type: 'number',                                                                                          default: '8',        description: 'Distance in pixels between the trigger and the popover panel.' },
		{ name: 'arrow',     type: 'boolean',                                                                                         default: 'true',     description: 'Shows a directional arrow pointing at the trigger.' },
		{ name: 'animation', type: "'scale' | 'slide' | 'elastic' | 'flip' | 'bounce' | 'zoom'",                                     default: "'scale'",  description: 'Open/close animation preset.' },
		{ name: 'trigger',   type: 'Snippet<[{ toggle: () => void; open: boolean }]>',                                                required: true,      description: 'Trigger snippet. Receives toggle() and open state.' },
		{ name: 'children',  type: 'Snippet',                                                                                         required: true,      description: 'Popover panel content snippet.' },
	];
</script>

<!-- Page header -->
<div class="comp-header">
	<div class="comp-header-top">
		<h1 class="comp-title">Popover</h1>
	</div>
	<p class="comp-desc">Portal-based floating panel with 8 placements, 6 animations, auto-flip near edges, and an optional arrow.</p>
</div>

<!-- ── IMPORT ── -->
<section class="doc-section">
	<h2 class="doc-section-title">Import</h2>
	<CodeBlock code={importCode} lang="ts" />
</section>

<!-- ── USAGE ── -->
<section class="doc-section">
	<h2 class="doc-section-title">Usage</h2>
	<p class="doc-section-desc">The <code>trigger</code> snippet receives <code>toggle</code> and <code>open</code>. Call <code>toggle()</code> to open or close the panel.</p>
	<div class="preview-box">
		<Popover>
			{#snippet trigger({ toggle, open })}
				<Button variant={open ? 'primary' : 'secondary'} onclick={toggle}>Open Popover</Button>
			{/snippet}
			{#snippet children()}
				<div class="w-52 p-4">
					<p class="text-sm font-semibold text-foreground">Hello!</p>
					<p class="mt-1 text-xs leading-relaxed text-muted-foreground">This is a popover panel. Click outside or toggle again to close.</p>
				</div>
			{/snippet}
		</Popover>
	</div>
	<CodeBlock code={usageCode} lang="svelte" />
</section>

<!-- ── PLACEMENTS ── -->
<section class="doc-section">
	<h2 class="doc-section-title">Placements</h2>
	<p class="doc-section-desc">8 positions available. The popover auto-flips when it would overflow the viewport.</p>
	<div class="preview-box">
		<div class="flex flex-wrap gap-2">
			{#each placements as p}
				<Popover placement={p}>
					{#snippet trigger({ toggle, open })}
						<Button variant={open ? 'primary' : 'secondary'} onclick={toggle}>{p}</Button>
					{/snippet}
					{#snippet children()}
						<div class="w-52 p-4">
							<p class="text-sm font-semibold text-foreground">{p}</p>
							<p class="mt-1 text-xs leading-relaxed text-muted-foreground">Opens in this direction. Auto-flips near the edge.</p>
						</div>
					{/snippet}
				</Popover>
			{/each}
		</div>
	</div>
	<CodeBlock code={placementsCode} lang="svelte" />
</section>

<!-- ── ANIMATIONS ── -->
<section class="doc-section">
	<h2 class="doc-section-title">Animations</h2>
	<p class="doc-section-desc">Six opening animations. Click each button to preview.</p>
	<div class="preview-box">
		<div class="flex flex-wrap gap-2">
			{#each anims as anim}
				<Popover animation={anim}>
					{#snippet trigger({ toggle, open })}
						<Button class={open ? 'opacity-80' : ''} onclick={toggle}>{anim}</Button>
					{/snippet}
					{#snippet children()}
						<div class="w-52 p-4">
							<p class="text-sm font-semibold text-foreground capitalize">{anim} animation</p>
							<p class="mt-1 text-xs leading-relaxed text-muted-foreground">This popover uses the <strong>{anim}</strong> animation.</p>
						</div>
					{/snippet}
				</Popover>
			{/each}
		</div>
	</div>
	<CodeBlock code={animationsCode} lang="svelte" />
</section>

<!-- ── ARROW ── -->
<section class="doc-section">
	<h2 class="doc-section-title">Arrow</h2>
	<p class="doc-section-desc">The arrow is enabled by default. Set <code>arrow={false}</code> to hide it — useful for dropdown menus.</p>
	<div class="preview-box">
		<div class="flex gap-3">
			<Popover>
				{#snippet trigger({ toggle })}
					<Button variant="secondary" onclick={toggle}>With arrow</Button>
				{/snippet}
				{#snippet children()}
					<div class="w-44 p-4">
						<p class="text-sm text-foreground">Arrow enabled (default)</p>
					</div>
				{/snippet}
			</Popover>

			<Popover arrow={false}>
				{#snippet trigger({ toggle })}
					<Button variant="secondary" onclick={toggle}>No arrow</Button>
				{/snippet}
				{#snippet children()}
					<div class="w-44 p-4">
						<p class="text-sm text-foreground">Arrow disabled</p>
					</div>
				{/snippet}
			</Popover>
		</div>
	</div>
	<CodeBlock code={arrowCode} lang="svelte" />
</section>

<!-- ── USE CASES ── -->
<section class="doc-section">
	<h2 class="doc-section-title">Use Cases</h2>
	<p class="doc-section-desc">Real-world patterns built with Popover.</p>
	<div class="preview-box" style="align-items: flex-start; justify-content: flex-start; flex-wrap: wrap; gap: 1rem; padding-top: 3rem; padding-bottom: 3rem;">

		<!-- Profile card -->
		<Popover placement="bottom-start" animation="scale">
			{#snippet trigger({ toggle })}
				<button class="profile-trigger" onclick={toggle}>
					<span class="avatar-circle">A</span>
					@ui.engineer
				</button>
			{/snippet}
			{#snippet children()}
				<div class="w-72 p-5">
					<div class="flex items-start justify-between">
						<div class="flex size-14 items-center justify-center rounded-full bg-accent text-xl font-bold text-accent-foreground">A</div>
						<span class="rounded-full border border-border px-3 py-1 text-xs font-semibold text-muted-foreground">UI Engineer</span>
					</div>
					<p class="mt-3 font-bold text-foreground">UI Engineer</p>
					<p class="text-sm text-muted-foreground">@ui.engineer</p>
					<p class="mt-2 text-sm text-muted-foreground">San Francisco · frontend & design systems</p>
					<div class="mt-3 flex gap-5 text-sm">
						<span><strong class="text-foreground">512</strong> <span class="text-muted-foreground">Following</span></span>
						<span><strong class="text-foreground">18.2K</strong> <span class="text-muted-foreground">Followers</span></span>
					</div>
					<Button class="mt-4" fullWidth>Follow</Button>
				</div>
			{/snippet}
		</Popover>

		<!-- Emoji picker -->
		<Popover placement="top" animation="elastic">
			{#snippet trigger({ toggle })}
				<Button variant="secondary" onclick={toggle}>React</Button>
			{/snippet}
			{#snippet children()}
				<div class="p-3">
					<p class="mb-2 text-xs font-medium text-muted-foreground">Add reaction</p>
					<div class="flex gap-1">
						{#each ['❤️','😂','😮','😢','😡','👍'] as emoji}
							<button class="flex size-10 items-center justify-center rounded-xl text-2xl transition-all hover:bg-muted active:scale-90">{emoji}</button>
						{/each}
					</div>
				</div>
			{/snippet}
		</Popover>

		<!-- More actions -->
		<Popover placement="bottom-end" animation="slide">
			{#snippet trigger({ toggle })}
				<Button variant="icon" onclick={toggle} ariaLabel="More options">
					<svg class="size-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
						<circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/>
					</svg>
				</Button>
			{/snippet}
			{#snippet children()}
				<div class="w-48 py-1.5">
					{#each [
						{ icon: '🔖', label: 'Save' },
						{ icon: '🔗', label: 'Copy link' },
						{ icon: '📤', label: 'Share' },
						{ icon: '🚫', label: 'Not interested' },
						{ icon: '⚠️', label: 'Report', danger: true },
					] as item}
						<button class="flex w-full items-center gap-3 px-4 py-3 text-sm transition-colors hover:bg-muted active:bg-border {item.danger ? 'text-destructive' : 'text-foreground'}">
							<span class="text-base">{item.icon}</span>
							{item.label}
						</button>
					{/each}
				</div>
			{/snippet}
		</Popover>

		<!-- Settings menu (no arrow) -->
		<Popover placement="bottom-start" arrow={false} animation="slide">
			{#snippet trigger({ toggle })}
				<Button variant="outline" onclick={toggle}>Settings</Button>
			{/snippet}
			{#snippet children()}
				<div class="w-52 py-1.5">
					{#each [
						{ icon: '👤', label: 'Edit Profile' },
						{ icon: '🔒', label: 'Privacy' },
						{ icon: '🔔', label: 'Notifications' },
						{ icon: '🚪', label: 'Sign Out', danger: true },
					] as item}
						<button class="flex w-full items-center gap-3 px-4 py-3 text-sm transition-colors hover:bg-muted active:bg-border {item.danger ? 'text-destructive' : 'text-foreground'}">
							<span class="text-base">{item.icon}</span>
							{item.label}
						</button>
					{/each}
				</div>
			{/snippet}
		</Popover>

	</div>
	<CodeBlock code={profileCardCode} lang="svelte" />
</section>

<!-- ── API REFERENCE ── -->
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
	.preview-box { padding: 2rem; border: 1px solid var(--border); border-radius: 0.875rem; background: var(--card); display: flex; align-items: center; justify-content: center; min-height: 6rem; flex-wrap: wrap; gap: 0.75rem; }

	.profile-trigger {
		display: flex;
		align-items: center;
		gap: 0.625rem;
		padding: 0.5rem 1rem;
		border-radius: 0.75rem;
		background: var(--muted);
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--foreground);
		border: none;
		cursor: pointer;
		transition: background 0.15s, transform 0.1s;
	}

	.profile-trigger:hover { background: var(--border); }
	.profile-trigger:active { transform: scale(0.95); }

	.avatar-circle {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 2rem;
		height: 2rem;
		border-radius: 9999px;
		background: var(--accent);
		color: var(--accent-foreground);
		font-size: 0.875rem;
		font-weight: 700;
	}
</style>
