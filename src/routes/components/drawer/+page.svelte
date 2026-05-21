<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Drawer from '$lib/components/Drawer.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import PropsTable from '$lib/components/PropsTable.svelte';
	import { toastStore } from '$lib/stores/toast.svelte';

	type Side = 'left' | 'right' | 'top' | 'bottom';
	type Size = 'sm' | 'md' | 'lg' | 'full';

	/* ── Variant grid (same pattern as dialog) ── */
	let opens: Record<string, boolean> = $state({});
	function toggle(k: string) { opens[k] = !opens[k]; }
	function close(k: string)  { opens[k] = false; }

	const variants: { key: string; label: string; side: Side; size: Size; desc: string }[] = [
		{ key: 'left',        label: 'Left',         side: 'left',   size: 'md',   desc: 'Slides in from the left' },
		{ key: 'right',       label: 'Right',        side: 'right',  size: 'md',   desc: 'Slides in from the right' },
		{ key: 'top',         label: 'Top',          side: 'top',    size: 'md',   desc: 'Drops from the top' },
		{ key: 'bottom',      label: 'Bottom',       side: 'bottom', size: 'md',   desc: 'Rises from the bottom' },
		{ key: 'left-sm',     label: 'Left SM',      side: 'left',   size: 'sm',   desc: 'Narrow left panel' },
		{ key: 'right-lg',    label: 'Right LG',     side: 'right',  size: 'lg',   desc: 'Wide right panel' },
		{ key: 'bottom-sm',   label: 'Bottom SM',    side: 'bottom', size: 'sm',   desc: 'Small action sheet' },
		{ key: 'bottom-lg',   label: 'Bottom LG',    side: 'bottom', size: 'lg',   desc: 'Large bottom sheet' },
		{ key: 'right-full',  label: 'Right Full',   side: 'right',  size: 'full', desc: 'Full screen from right' },
		{ key: 'top-sm',      label: 'Top SM',       side: 'top',    size: 'sm',   desc: 'Thin top panel' },
	];

	/* ── Use-case states ── */
	let navOpen      = $state(false);
	let filterOpen   = $state(false);
	let cartOpen     = $state(false);
	let commentsOpen = $state(false);

	/* Cart */
	let cartItems = $state([
		{ id: 1, name: 'Wireless Earbuds', price: 59, qty: 1 },
		{ id: 2, name: 'Phone Case',       price: 19, qty: 2 },
		{ id: 3, name: 'USB-C Cable',      price: 12, qty: 1 },
	]);
	let cartTotal = $derived(cartItems.reduce((s, i) => s + i.price * i.qty, 0));
	function removeItem(id: number) { cartItems = cartItems.filter(i => i.id !== id); }

	/* Filters */
	let filters = $state({ trending: true, following: false, nearby: false, live: true });

	const navItems = [
		{ icon: '🏠', label: 'Home' },
		{ icon: '🔍', label: 'Discover' },
		{ icon: '➕', label: 'Create' },
		{ icon: '💬', label: 'Inbox' },
		{ icon: '👤', label: 'Profile' },
		{ icon: '⚙️', label: 'Settings' },
		{ icon: '🔖', label: 'Bookmarks' },
	];

	const comments = [
		{ user: 'alex_k',    avatar: 'A', text: 'This is fire 🔥',         likes: 142 },
		{ user: 'sara.m',    avatar: 'S', text: 'POV: me every morning 😭', likes: 89  },
		{ user: 'dev_joy',   avatar: 'D', text: 'Tutorial pls!!',           likes: 67  },
		{ user: 'music_fan', avatar: 'M', text: 'Song name?',               likes: 54  },
		{ user: 'travel_r',  avatar: 'T', text: 'Where is this??',          likes: 38  },
		{ user: 'code_wiz',  avatar: 'C', text: 'Built different 💯',       likes: 31  },
	];

	const importCode = `import Drawer from '$lib/components/Drawer.svelte';`;

	const usageCode = `<script lang="ts">
  let open = $state(false);
<\/script>

<Button onclick={() => (open = true)}>Open Drawer</Button>

<Drawer {open} onClose={() => (open = false)} side="right" size="md" title="Settings">
  <p>Drawer content goes here.</p>
  {#snippet footer()}
    <Button onclick={() => (open = false)}>Close</Button>
  {/snippet}
</Drawer>`;

	const props = [
		{ name: 'open',     type: 'boolean',                             default: '—',         description: 'Controls whether the drawer is visible.' },
		{ name: 'onClose',  type: '() => void',                          default: '—',         description: 'Callback fired when the backdrop is clicked or Escape is pressed.' },
		{ name: 'side',     type: "'left' | 'right' | 'top' | 'bottom'", default: "'right'",   description: 'Which edge the drawer slides in from.' },
		{ name: 'size',     type: "'sm' | 'md' | 'lg' | 'xl' | 'full'", default: "'md'",      description: 'Width (or height for top/bottom) of the drawer panel.' },
		{ name: 'title',    type: 'string',                              default: 'undefined', description: 'Optional header title. Renders a close button alongside it.' },
		{ name: 'children', type: 'Snippet',                             default: '—',         description: 'Main scrollable content of the drawer.' },
		{ name: 'footer',   type: 'Snippet',                             default: 'undefined', description: 'Optional sticky footer slot rendered below the body.' },
	];
</script>

<div class="comp-header">
	<div class="comp-header-top">
		<h1 class="comp-title">Drawer</h1>
		<span class="comp-badge">Overlay</span>
	</div>
	<p class="comp-desc">Slide-in panel that anchors to any edge of the screen. Portal-based with 4 sides and 5 size options.</p>
</div>

<section class="doc-section">
	<h2 class="doc-section-title">Import</h2>
	<CodeBlock code={importCode} lang="ts" />
</section>

<section class="doc-section">
	<h2 class="doc-section-title">Usage</h2>
	<CodeBlock code={usageCode} lang="svelte" />
</section>

<section class="doc-section">
	<h2 class="doc-section-title">Variants</h2>
	<p class="doc-section-desc">Each button opens a drawer with a different direction and size combination.</p>
	<div class="preview-box preview-box-accent">
		{#each variants as v}
			<Button onclick={() => toggle(v.key)}>
				{v.label}
			</Button>
		{/each}
	</div>
</section>

<section class="doc-section">
	<h2 class="doc-section-title">Use Cases</h2>
	<p class="doc-section-desc">Real-world drawer patterns: navigation menu, filters, shopping cart, and comments.</p>
	<div class="preview-box">
		<Button variant="secondary" onclick={() => (navOpen = true)}>Navigation Menu</Button>
		<Button variant="secondary" onclick={() => (filterOpen = true)}>Filters</Button>
		<Button variant="secondary" onclick={() => (cartOpen = true)}>Cart</Button>
		<Button variant="secondary" onclick={() => (commentsOpen = true)}>Comments</Button>
	</div>
</section>

<section class="doc-section">
	<h2 class="doc-section-title">API Reference</h2>
	<PropsTable {props} />
</section>


<!-- ════════════════════════════════════════
     VARIANT DRAWERS
     ════════════════════════════════════════ -->
{#each variants as v}
	<Drawer open={opens[v.key] ?? false} onClose={() => close(v.key)} side={v.side} size={v.size} title={v.label}>
		<p class="text-sm text-muted-foreground">{v.desc}</p>
		<p class="mt-3 text-sm text-muted-foreground">
			Side: <span class="font-semibold text-foreground">{v.side}</span> —
			Size: <span class="font-semibold text-foreground">{v.size}</span>
		</p>
		<div class="mt-4 space-y-2">
			{#each ['Item one', 'Item two', 'Item three'] as item}
				<div class="rounded-xl bg-muted px-4 py-3 text-sm text-foreground">{item}</div>
			{/each}
		</div>

		{#snippet footer()}
			<div class="flex gap-2">
				<Button variant="ghost" class="flex-1" onclick={() => close(v.key)}>Cancel</Button>
				<Button class="flex-1" onclick={() => { close(v.key); toastStore.show(`${v.label} closed`, 'success'); }}>
					Got it
				</Button>
			</div>
		{/snippet}
	</Drawer>
{/each}


<!-- ════════════════════════════════════════
     NAVIGATION MENU
     ════════════════════════════════════════ -->
<Drawer open={navOpen} onClose={() => (navOpen = false)} side="left" size="sm">
	<div class="mb-6 flex items-center gap-3">
		<div class="flex size-12 items-center justify-center rounded-full bg-accent text-lg font-bold text-accent-foreground">
			M
		</div>
		<div>
			<div class="font-bold text-foreground">@mc_dev</div>
			<div class="text-xs text-muted-foreground">1.2M followers</div>
		</div>
	</div>
	<nav class="space-y-1">
		{#each navItems as item}
			<button
				class="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-foreground transition-colors hover:bg-muted active:bg-border"
				onclick={() => { navOpen = false; toastStore.show(item.label, 'info'); }}
			>
				<span class="text-lg">{item.icon}</span>
				{item.label}
			</button>
		{/each}
	</nav>

	{#snippet footer()}
		<button
			class="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
			onclick={() => (navOpen = false)}
		>
			<span class="text-lg">🚪</span>
			Log out
		</button>
	{/snippet}
</Drawer>


<!-- ════════════════════════════════════════
     FILTERS
     ════════════════════════════════════════ -->
<Drawer open={filterOpen} onClose={() => (filterOpen = false)} side="right" title="Filters">
	<div class="space-y-3">
		<p class="text-sm text-muted-foreground">Customize your feed.</p>
		{#each Object.entries(filters) as [key, val]}
			<button
				class="flex w-full items-center justify-between rounded-xl bg-muted px-4 py-3 transition-colors hover:bg-border"
				onclick={() => { (filters as any)[key] = !val; }}
			>
				<span class="text-sm font-medium capitalize text-foreground">{key}</span>
				<div class="relative h-6 w-11 rounded-full transition-colors {val ? 'bg-accent' : 'bg-border'}">
					<div class="absolute top-0.5 size-5 rounded-full bg-white shadow transition-transform {val ? 'translate-x-5' : 'translate-x-0.5'}"></div>
				</div>
			</button>
		{/each}
	</div>

	{#snippet footer()}
		<div class="flex gap-2">
			<Button variant="secondary" class="flex-1" onclick={() => { filters = { trending: false, following: false, nearby: false, live: false }; }}>
				Reset
			</Button>
			<Button class="flex-1" onclick={() => { filterOpen = false; toastStore.show('Filters applied', 'success'); }}>
				Apply
			</Button>
		</div>
	{/snippet}
</Drawer>


<!-- ════════════════════════════════════════
     CART
     ════════════════════════════════════════ -->
<Drawer open={cartOpen} onClose={() => (cartOpen = false)} side="right" size="lg" title="Cart ({cartItems.length})">
	{#if cartItems.length === 0}
		<div class="flex flex-col items-center justify-center py-16 text-center">
			<span class="text-4xl">🛒</span>
			<p class="mt-3 text-sm text-muted-foreground">Cart is empty</p>
		</div>
	{:else}
		<div class="space-y-3">
			{#each cartItems as item (item.id)}
				<div class="flex items-center gap-3 rounded-xl bg-muted px-4 py-3">
					<div class="size-10 rounded-lg bg-border"></div>
					<div class="min-w-0 flex-1">
						<div class="truncate text-sm font-semibold text-foreground">{item.name}</div>
						<div class="text-xs text-muted-foreground">Qty: {item.qty}</div>
					</div>
					<div class="text-sm font-bold text-foreground">${item.price * item.qty}</div>
					<Button variant="icon" onclick={() => removeItem(item.id)} ariaLabel="Remove">
						<svg class="size-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
							<path d="M6 18L18 6M6 6l12 12"/>
						</svg>
					</Button>
				</div>
			{/each}
		</div>
	{/if}

	{#snippet footer()}
		<div class="space-y-3">
			<div class="flex items-center justify-between text-sm">
				<span class="text-muted-foreground">Total</span>
				<span class="text-lg font-bold text-foreground">${cartTotal}</span>
			</div>
			<Button fullWidth onclick={() => { cartOpen = false; toastStore.show('Order placed!', 'success'); }}>
				Checkout
			</Button>
		</div>
	{/snippet}
</Drawer>


<!-- ════════════════════════════════════════
     COMMENTS (bottom sheet)
     ════════════════════════════════════════ -->
<Drawer open={commentsOpen} onClose={() => (commentsOpen = false)} side="bottom" size="lg" title="Comments">
	<div class="space-y-4">
		{#each comments as c}
			<div class="flex items-start gap-3">
				<div class="flex size-8 flex-shrink-0 items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-foreground">
					{c.avatar}
				</div>
				<div class="min-w-0 flex-1">
					<span class="text-sm font-semibold text-foreground">@{c.user}</span>
					<p class="text-sm text-muted-foreground">{c.text}</p>
				</div>
				<div class="flex flex-col items-center gap-0.5">
					<Button variant="icon" ariaLabel="Like comment" onclick={() => toastStore.show('Liked!', 'success')}>
						<svg class="size-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
							<path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
						</svg>
					</Button>
					<span class="text-xs text-muted-foreground">{c.likes}</span>
				</div>
			</div>
		{/each}
	</div>

	{#snippet footer()}
		<div class="flex gap-2">
			<input
				type="text"
				placeholder="Add a comment..."
				class="flex-1 rounded-xl bg-muted px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
			/>
			<Button class="px-4" onclick={() => toastStore.show('Comment posted!', 'success')}>
				Post
			</Button>
		</div>
	{/snippet}
</Drawer>

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
