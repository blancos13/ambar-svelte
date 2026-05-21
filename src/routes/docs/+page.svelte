<script lang="ts">
	import Button from '$lib/components/Button.svelte';

	const buttonCode = `import { Button } from '$lib';

<Button>Follow</Button>
<Button variant="secondary">Message</Button>
<Button variant="outline" size="sm">Share</Button>`;

	const sidebarCode = `import { Sidebar } from '$lib';

let active = $state('overview');
let collapsed = $state(false);

<Sidebar
	sections={sections}
	bind:active
	bind:collapsed
	variant="floating"
	itemStyle="filled"
	activeIndicator="track"
	animation="smooth"
/>`;

	const linkCode = `import { Link } from '$lib';

<Link href="/creator" variant="underline" motion="line">Creator profile</Link>
<Link href="/fund" variant="mark" motion="highlight">Creator fund</Link>`;

	const groups = [
		{
			title: 'Actions',
			items: [
				['Button', '/components/button'],
				['Link', '/components/link'],
				['Like', '/components/like'],
				['Dropdown', '/components/dropdown'],
				['Popover', '/components/popover'],
				['Tooltip', '/components/tooltip'],
				['Toast', '/components/toast']
			]
		},
		{
			title: 'Inputs',
			items: [
				['Input', '/components/input'],
				['Textarea', '/components/input'],
				['OtpInput', '/components/input'],
				['Select', '/components/select'],
				['Checkbox', '/components/checkbox'],
				['Radio', '/components/radio'],
				['RadioGroup', '/components/radio'],
				['Switch', '/components/switch'],
				['Slider', '/components/slider'],
				['Search', '/components/search']
			]
		},
		{
			title: 'Navigation',
			items: [
				['Sidebar', '/components/sidebar'],
				['Breadcrumb', '/components/breadcrumb'],
				['Tabs', '/components/tabs'],
				['Accordion', '/components/accordion'],
				['List', '/components/list']
			]
		},
		{
			title: 'Overlay',
			items: [
				['Dialog', '/components/dialog'],
				['Drawer', '/components/drawer'],
				['Sheet', '/components/sheet']
			]
		},
		{
			title: 'Display',
			items: [
				['Avatar', '/components/avatar'],
				['AvatarGroup', '/components/avatar'],
				['EmptyState', '/components/empty-state'],
				['Skeleton', '/components/skeleton'],
				['Spinner', '/components/spinner'],
				['Progress', '/components/progress'],
				['Text', '/components/typography']
			]
		},
		{
			title: 'Layout',
			items: [
				['VStack', '/components/layout'],
				['HStack', '/components/layout'],
				['Grid', '/components/layout'],
				['Flex', '/components/layout'],
				['Spacer', '/components/layout']
			]
		},
		{
			title: 'Charts',
			items: [
				['LineChart', '/components/charts'],
				['BarChart', '/components/charts'],
				['DonutChart', '/components/charts'],
				['CandlestickChart', '/components/charts'],
				['RealtimeLineChart', '/components/charts'],
				['GlobeChart', '/components/charts'],
				['WorldMap', '/components/charts'],
				['HeatMap', '/components/charts'],
				['Sparkline', '/components/charts']
			]
		}
	] as const;
</script>

<svelte:head>
	<title>Docs - Ambar UI</title>
</svelte:head>

<div class="mx-auto max-w-5xl px-6 py-12">
	<header class="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
		<div>
			<a href="/" class="mb-5 inline-flex text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground">Back</a>
			<h1 class="text-4xl font-bold tracking-tight text-foreground">Ambar UI API</h1>
			<p class="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
				Prop-based Svelte 5 components: variant, size, motion, animation, and slots. Zero dependencies.
			</p>
		</div>
		<div class="flex gap-2">
			<Button href="/components/button" variant="secondary">Button preview</Button>
			<Button href="/components/sidebar">Sidebar preview</Button>
		</div>
	</header>

	<section class="mb-10 grid gap-4 md:grid-cols-3">
		<div class="rounded-xl border border-border bg-card p-5">
			<p class="text-sm font-bold text-foreground">Svelte first</p>
			<p class="mt-1 text-sm text-muted-foreground">No cn helper, no class combiner. Component props assemble classes explicitly.</p>
		</div>
		<div class="rounded-xl border border-border bg-card p-5">
			<p class="text-sm font-bold text-foreground">Smooth motion</p>
			<p class="mt-1 text-sm text-muted-foreground">Hover, active, spring, portal, and mobile animations built in. No extra config needed.</p>
		</div>
		<div class="rounded-xl border border-border bg-card p-5">
			<p class="text-sm font-bold text-foreground">Preview driven</p>
			<p class="mt-1 text-sm text-muted-foreground">Every public export points to a live component preview page.</p>
		</div>
	</section>

	<section class="mb-12 grid gap-5 lg:grid-cols-3">
		<div class="rounded-xl border border-border bg-card p-5">
			<h2 class="text-sm font-bold text-foreground">Button</h2>
			<div class="mt-4 flex flex-wrap gap-2">
				<Button>Follow</Button>
				<Button variant="secondary">Message</Button>
				<Button variant="outline" size="sm">Share</Button>
			</div>
			<pre class="mt-5 overflow-x-auto rounded-lg bg-muted p-4 text-xs text-foreground">{buttonCode}</pre>
		</div>

		<div class="rounded-xl border border-border bg-card p-5">
			<h2 class="text-sm font-bold text-foreground">Sidebar</h2>
			<p class="mt-2 text-sm text-muted-foreground">Shell, active style, collapse mode, mobile mode, and animation are all props.</p>
			<pre class="mt-5 overflow-x-auto rounded-lg bg-muted p-4 text-xs text-foreground">{sidebarCode}</pre>
		</div>

		<div class="rounded-xl border border-border bg-card p-5">
			<h2 class="text-sm font-bold text-foreground">Link</h2>
			<p class="mt-2 text-sm text-muted-foreground">Decoration variants and continuous motion are props, not separate CSS recipes.</p>
			<pre class="mt-5 overflow-x-auto rounded-lg bg-muted p-4 text-xs text-foreground">{linkCode}</pre>
		</div>
	</section>

	<section>
		<div class="mb-4 flex items-end justify-between gap-4">
			<div>
				<h2 class="text-lg font-bold text-foreground">Component Previews</h2>
				<p class="mt-1 text-sm text-muted-foreground">47 Svelte components exported from <code class="text-accent">$lib</code>.</p>
			</div>
			<a href="/components/button" class="text-sm font-semibold text-accent hover:underline">Start with Button</a>
		</div>

		<div class="grid gap-4 md:grid-cols-2">
			{#each groups as group}
				<div class="rounded-xl border border-border bg-card p-5">
					<h3 class="text-sm font-bold text-foreground">{group.title}</h3>
					<div class="mt-4 flex flex-wrap gap-2">
						{#each group.items as item}
							<a
								href={item[1]}
								class="rounded-full bg-muted px-3 py-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
							>
								{item[0]}
							</a>
						{/each}
					</div>
				</div>
			{/each}
		</div>
	</section>
</div>
