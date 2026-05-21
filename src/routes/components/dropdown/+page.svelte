<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Dropdown from '$lib/components/Dropdown.svelte';
	import type { DropdownItem } from '$lib/components/Dropdown.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import PropsTable from '$lib/components/PropsTable.svelte';

	type Anim = 'scale' | 'slide' | 'elastic' | 'bounce' | 'zoom';
	let playAnim = $state<Anim>('scale');

	const anims: { value: Anim; label: string; desc: string }[] = [
		{ value: 'scale',   label: 'Scale',   desc: 'Pop'         },
		{ value: 'slide',   label: 'Slide',   desc: 'From top'    },
		{ value: 'elastic', label: 'Elastic', desc: 'Bounces back'},
		{ value: 'bounce',  label: 'Bounce',  desc: 'Bounce'      },
		{ value: 'zoom',    label: 'Zoom',    desc: 'Zoom in'     },
	];

	let lastAction = $state('');

	const importCode = `import Dropdown from '$lib/components/Dropdown.svelte';
import type { DropdownItem } from '$lib/components/Dropdown.svelte';`;

	const usageCode = `<script lang="ts">
  import Dropdown from '$lib/components/Dropdown.svelte';
  import Button from '$lib/components/Button.svelte';

  const items = [
    { label: 'Edit',   shortcut: '⌘E' },
    { label: 'Copy',   shortcut: '⌘C' },
    { type: 'divider' },
    { label: 'Delete', danger: true },
  ];
<\/script>

<Dropdown {items}>
  {#snippet trigger({ toggle, open })}
    <Button onclick={toggle}>Options</Button>
  {/snippet}
</Dropdown>`;

	const submenuCode = `<Dropdown items={[
  { label: 'Share', children: [
    { label: 'Twitter / X' },
    { label: 'LinkedIn' },
    { type: 'divider' },
    { label: 'Copy Link', shortcut: '⌘C' },
  ]},
]}>
  {#snippet trigger({ toggle })}
    <Button onclick={toggle}>Share</Button>
  {/snippet}
</Dropdown>`;

	const props = [
		{ name: 'items',     type: 'DropdownItem[]',                                          default: '—',            description: 'Array of menu items to render.' },
		{ name: 'trigger',   type: 'Snippet<[{ toggle: () => void, open: boolean }]>',        default: '—',            description: 'Snippet that renders the trigger element. Receives toggle() and open state.' },
		{ name: 'placement', type: "'bottom-start' | 'bottom-end' | 'top-start' | 'top-end'", default: "'bottom-start'", description: 'Where the menu appears relative to the trigger.' },
		{ name: 'animation', type: "'scale' | 'slide' | 'elastic' | 'bounce' | 'zoom'",       default: "'scale'",      description: 'Open/close animation style.' },
		{ name: 'offset',    type: 'number',                                                   default: '6',            description: 'Gap in px between the trigger and the menu.' },
	];

	const itemProps = [
		{ name: 'type',     type: "'item' | 'divider' | 'label'", default: "'item'",  description: "Item type. 'divider' renders a separator, 'label' renders a non-interactive heading." },
		{ name: 'label',    type: 'string',                        default: '—',       description: 'Visible text for the item.' },
		{ name: 'icon',     type: 'Snippet',                       default: '—',       description: 'Optional icon snippet rendered before the label.' },
		{ name: 'shortcut', type: 'string',                        default: '—',       description: 'Keyboard shortcut shown on the right (e.g. ⌘E).' },
		{ name: 'hint',     type: 'string',                        default: '—',       description: 'Subtle secondary text shown below the label.' },
		{ name: 'danger',   type: 'boolean',                       default: 'false',   description: 'Renders the item in red to indicate a destructive action.' },
		{ name: 'disabled', type: 'boolean',                       default: 'false',   description: 'Grays out the item and prevents interaction.' },
		{ name: 'children', type: 'DropdownItem[]',                default: '—',       description: 'Nested items that open a submenu on hover.' },
		{ name: 'onclick',  type: '() => void',                    default: '—',       description: 'Click handler for the item.' },
	];
</script>

<!-- ── ICONS ── -->
{#snippet iconEdit()}    <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4Z"/></svg>{/snippet}
{#snippet iconCopy()}    <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>{/snippet}
{#snippet iconShare()}   <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>{/snippet}
{#snippet iconStar()}    <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>{/snippet}
{#snippet iconPin()}     <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 17v5"/><path d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z"/></svg>{/snippet}
{#snippet iconDown()}    <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>{/snippet}
{#snippet iconMute()}    <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 5 6 9H2v6h4l5 4V5z"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>{/snippet}
{#snippet iconBlock()}   <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>{/snippet}
{#snippet iconReport()}  <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>{/snippet}
{#snippet iconTrash()}   <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>{/snippet}
{#snippet iconUser()}    <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>{/snippet}
{#snippet iconSettings()}<svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>{/snippet}
{#snippet iconLogout()}  <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>{/snippet}
{#snippet iconChevron()} <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 9l6 6 6-6"/></svg>{/snippet}
{#snippet iconDots()}    <svg class="size-5" viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/></svg>{/snippet}
{#snippet iconLang()}    <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>{/snippet}
{#snippet iconTheme()}   <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>{/snippet}
{#snippet iconNotif()}   <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>{/snippet}

<div class="comp-header">
	<div class="comp-header-top">
		<h1 class="comp-title">Dropdown</h1>
	</div>
	<p class="comp-desc">Menu dropdown — icon, shortcut, hint, divider, danger, submenu, keyboard nav.</p>
</div>

<section class="doc-section">
	<h2 class="doc-section-title">Import</h2>
	<CodeBlock code={importCode} lang="ts" />
</section>

<section class="doc-section">
	<h2 class="doc-section-title">Usage</h2>
	<p class="doc-section-desc">The <code>trigger</code> prop is a snippet that receives <code>toggle</code> (opens/closes the menu) and <code>open</code> (boolean state).</p>
	<div class="preview-box">
		<Dropdown items={[
			{ label: 'Edit',   icon: iconEdit,  shortcut: '⌘E' },
			{ label: 'Copy',   icon: iconCopy,  shortcut: '⌘C' },
			{ label: 'Share',  icon: iconShare, shortcut: '⌘S' },
			{ type: 'divider' },
			{ label: 'Delete', icon: iconTrash, danger: true   },
		]}>
			{#snippet trigger({ toggle, open })}
				<Button variant="secondary" onclick={toggle}>
					Options
					<span class="transition-transform duration-200 {open ? 'rotate-180' : ''}">
						{@render iconChevron()}
					</span>
				</Button>
			{/snippet}
		</Dropdown>
	</div>
	<CodeBlock code={usageCode} lang="svelte" />
</section>

<section class="doc-section">
	<h2 class="doc-section-title">Basic</h2>
	<p class="doc-section-desc">Basic usage with icons, shortcuts, and a danger item.</p>
	<div class="preview-box">
		<Dropdown items={[
			{ label: 'Edit',   icon: iconEdit,  shortcut: '⌘E' },
			{ label: 'Copy',   icon: iconCopy,  shortcut: '⌘C' },
			{ label: 'Share',  icon: iconShare, shortcut: '⌘S' },
			{ type: 'divider' },
			{ label: 'Delete', icon: iconTrash, danger: true   },
		]}>
			{#snippet trigger({ toggle, open })}
				<Button variant="secondary" onclick={toggle}>
					Options
					<span class="transition-transform duration-200 {open ? 'rotate-180' : ''}">
						{@render iconChevron()}
					</span>
				</Button>
			{/snippet}
		</Dropdown>

		<Dropdown placement="bottom-start" items={[
			{ label: 'Profile',   icon: iconUser     },
			{ label: 'Settings',  icon: iconSettings, shortcut: '⌘,' },
			{ type: 'divider' },
			{ label: 'Sign Out',  icon: iconLogout,  danger: true },
		]}>
			{#snippet trigger({ toggle, open })}
				<Button onclick={toggle}>
					My Account
					<span class="transition-transform duration-200 {open ? 'rotate-180' : ''}">
						{@render iconChevron()}
					</span>
				</Button>
			{/snippet}
		</Dropdown>
	</div>
</section>

<section class="doc-section">
	<h2 class="doc-section-title">Submenu</h2>
	<p class="doc-section-desc">Add <code>children</code> to any item — hover to open the nested menu.</p>
	<div class="preview-box">
		<Dropdown placement="bottom-start" items={[
			{ label: 'Edit',  icon: iconEdit,  shortcut: '⌘E' },
			{ label: 'Share', icon: iconShare, children: [
				{ label: 'Instagram Story', hint: 'Share as story' },
				{ label: 'LinkedIn',        hint: 'Share directly' },
				{ label: 'Twitter / X'                              },
				{ label: 'WhatsApp'                                 },
				{ type: 'divider' },
				{ label: 'Copy Link', icon: iconCopy, shortcut: '⌘C' },
			]},
			{ label: 'Download', icon: iconDown, children: [
				{ label: 'Original quality', hint: '4K · ~450 MB' },
				{ label: 'HD 1080p',         hint: '~120 MB'       },
				{ label: 'HD 720p',          hint: '~65 MB'        },
				{ label: 'Audio file',       hint: 'MP3 · ~8 MB'   },
			]},
			{ label: 'Pin',  icon: iconPin },
			{ type: 'divider' },
			{ label: 'Delete', icon: iconTrash, danger: true },
		]}>
			{#snippet trigger({ toggle, open })}
				<Button variant="secondary" onclick={toggle}>
					Video Options
					<span class="transition-transform duration-200 {open ? 'rotate-180' : ''}">
						{@render iconChevron()}
					</span>
				</Button>
			{/snippet}
		</Dropdown>

		<Dropdown placement="bottom-start" items={[
			{ type: 'label', label: 'Preferences' },
			{ label: 'Language', icon: iconLang, children: [
				{ label: 'Turkish',  hint: 'Default' },
				{ label: 'English'  },
				{ label: 'Deutsch'  },
				{ label: 'Español'  },
				{ label: 'Français' },
			]},
			{ label: 'Theme', icon: iconTheme, children: [
				{ label: 'System' },
				{ label: 'Light'  },
				{ label: 'Dark'   },
			]},
			{ label: 'Notifications', icon: iconNotif, children: [
				{ label: 'All on'            },
				{ label: 'Followers only'    },
				{ label: 'Mute', danger: true },
			]},
			{ type: 'divider' },
			{ label: 'Sign Out', icon: iconLogout, danger: true },
		]}>
			{#snippet trigger({ toggle, open })}
				<Button onclick={toggle}>
					Settings
					<span class="transition-transform duration-200 {open ? 'rotate-180' : ''}">
						{@render iconChevron()}
					</span>
				</Button>
			{/snippet}
		</Dropdown>
	</div>
	<CodeBlock code={submenuCode} lang="svelte" />
</section>

<section class="doc-section">
	<h2 class="doc-section-title">Context Menu Style</h2>
	<p class="doc-section-desc">3-dot trigger pattern — common for post/card actions.</p>
	<div class="preview-box" style="justify-content: flex-start;">
		<div class="flex flex-col gap-3 max-w-sm w-full">
			{#each [
				{ user: 'Zeynep Kaya', time: '2m ago', text: 'This animation is amazing! 🔥' },
				{ user: 'Mert Aydın',  time: '5m ago', text: 'Can you share the source code?' },
			] as post}
				<div class="flex items-start gap-3 rounded-xl border border-border bg-muted/30 p-4">
					<div class="size-9 rounded-full bg-accent flex items-center justify-center text-sm font-bold text-accent-foreground shrink-0">
						{post.user[0]}
					</div>
					<div class="flex-1 min-w-0">
						<div class="flex items-center justify-between gap-2">
							<span class="text-sm font-semibold text-foreground">{post.user}</span>
							<div class="flex items-center gap-2">
								<span class="text-xs text-muted-foreground">{post.time}</span>
								<Dropdown placement="bottom-end" items={[
									{ label: 'Save',    icon: iconStar,   shortcut: '⌘S' },
									{ label: 'Copy',    icon: iconCopy                   },
									{ label: 'Share',   icon: iconShare, children: [
										{ label: 'Instagram Story' },
										{ label: 'LinkedIn'        },
										{ label: 'WhatsApp'        },
									]},
									{ type: 'divider' },
									{ label: 'Mute',    icon: iconMute,   hint: 'Turn off notifications' },
									{ label: 'Block',   icon: iconBlock,  danger: true },
									{ label: 'Report',  icon: iconReport, danger: true },
								]}>
									{#snippet trigger({ toggle })}
										<button
											type="button"
											onclick={toggle}
											class="flex items-center justify-center size-7 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition active:scale-90"
										>
											{@render iconDots()}
										</button>
									{/snippet}
								</Dropdown>
							</div>
						</div>
						<p class="text-sm text-muted-foreground mt-0.5">{post.text}</p>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>

<section class="doc-section">
	<h2 class="doc-section-title">Disabled Items</h2>
	<p class="doc-section-desc">Set <code>disabled: true</code> on any item. A <code>hint</code> explains why.</p>
	<div class="preview-box">
		<Dropdown items={[
			{ label: 'Edit',     icon: iconEdit,  shortcut: '⌘E' },
			{ label: 'Copy',     icon: iconCopy,  shortcut: '⌘C' },
			{ label: 'Share',    icon: iconShare, disabled: true, hint: 'Publish first' },
			{ label: 'Download', icon: iconDown,  disabled: true, hint: 'Premium required' },
			{ type: 'divider' },
			{ label: 'Delete',   icon: iconTrash, danger: true },
		]}>
			{#snippet trigger({ toggle, open })}
				<Button variant="secondary" onclick={toggle}>
					Options
					<span class="transition-transform duration-200 {open ? 'rotate-180' : ''}">
						{@render iconChevron()}
					</span>
				</Button>
			{/snippet}
		</Dropdown>
	</div>
</section>

<section class="doc-section">
	<h2 class="doc-section-title">Animations</h2>
	<p class="doc-section-desc">5 open/close animations — pick one with the buttons below.</p>
	<div class="preview-box preview-box-accent" style="flex-direction: column; align-items: flex-start; gap: 1.25rem;">
		{#if lastAction}
			<div class="rounded-xl bg-muted px-4 py-2.5 text-sm w-full">
				<span class="text-muted-foreground">Clicked:</span>
				<span class="font-semibold text-foreground ml-1">{lastAction}</span>
			</div>
		{/if}

		<div class="flex flex-wrap gap-3 items-start">
			<Dropdown animation={playAnim} placement="bottom-start" items={[
				{ type: 'label', label: 'Actions' },
				{ label: 'Edit',     icon: iconEdit,  shortcut: '⌘E', onclick: () => lastAction = 'Edit'     },
				{ label: 'Copy',     icon: iconCopy,  shortcut: '⌘C', onclick: () => lastAction = 'Copy'     },
				{ label: 'Share',    icon: iconShare, children: [
					{ label: 'Instagram', onclick: () => lastAction = 'Instagram' },
					{ label: 'LinkedIn',  onclick: () => lastAction = 'LinkedIn'  },
					{ label: 'Twitter',   onclick: () => lastAction = 'Twitter'   },
				]},
				{ label: 'Pin',      icon: iconPin,                   onclick: () => lastAction = 'Pin'      },
				{ type: 'divider' },
				{ label: 'Delete',   icon: iconTrash, danger: true,   onclick: () => lastAction = 'Delete'   },
			]}>
				{#snippet trigger({ toggle, open })}
					<Button onclick={toggle}>
						Open Menu
						<span class="transition-transform duration-200 {open ? 'rotate-180' : ''}">
							{@render iconChevron()}
						</span>
					</Button>
				{/snippet}
			</Dropdown>
		</div>

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
	<h2 class="doc-section-title">API Reference</h2>
	<h3 class="doc-section-sub">Dropdown Props</h3>
	<PropsTable props={props} />
	<h3 class="doc-section-sub" style="margin-top: 1.5rem;">DropdownItem Fields</h3>
	<PropsTable props={itemProps} />
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
