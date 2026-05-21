<script lang="ts">
	import type { Snippet } from 'svelte';

	type Preset = 'inbox' | 'search' | 'data' | 'folder' | 'users' | 'error' | 'custom';
	type Size   = 'sm' | 'md' | 'lg';

	type Props = {
		preset?:      Preset;
		title?:       string;
		description?: string;
		action?:      { label: string; onclick: () => void };
		size?:        Size;
		icon?:        Snippet;
		children?:    Snippet;
		class?:       string;
	};

	let {
		preset      = 'inbox',
		title,
		description,
		action,
		size        = 'md',
		icon,
		children,
		class: cls  = '',
	}: Props = $props();

	const sizeMap: Record<Size, { icon: number; title: string; desc: string; wrap: string }> = {
		sm: { icon: 40, title: 'text-sm font-semibold', desc: 'text-xs',   wrap: 'py-8 gap-3'  },
		md: { icon: 56, title: 'text-base font-semibold', desc: 'text-sm', wrap: 'py-12 gap-4' },
		lg: { icon: 72, title: 'text-lg font-semibold',  desc: 'text-sm',  wrap: 'py-16 gap-5' },
	};

	const sz = $derived(sizeMap[size]);

	/* ── built-in SVG paths (Heroicons outline, viewBox 24×24) ── */
	const icons: Record<Preset, string> = {
		inbox:  'M2.25 13.5h3.86a2.25 2.25 0 0 1 2.012 1.244l.256.512a2.25 2.25 0 0 0 2.013 1.244h3.218a2.25 2.25 0 0 0 2.013-1.244l.256-.512a2.25 2.25 0 0 1 2.013-1.244h3.859m-19.5.338V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 0 0-2.15-1.588H6.911a2.25 2.25 0 0 0-2.15 1.588L2.35 13.177a2.25 2.25 0 0 0-.1.661Z',
		search: 'm21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z',
		data:   'M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z',
		folder: 'M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z',
		users:  'M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z',
		error:  'M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z',
		custom: '',
	};
</script>

<div class="flex flex-col items-center justify-center text-center {sz.wrap} {cls}">
	<!-- icon -->
	<div class="text-muted-foreground/40">
		{#if icon}
			{@render icon()}
		{:else if preset !== 'custom'}
			<svg
				width={sz.icon}
				height={sz.icon}
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="1.5"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<path d={icons[preset]} />
			</svg>
		{/if}
	</div>

	<!-- title -->
	{#if title}
		<p class="{sz.title} text-foreground">{title}</p>
	{/if}

	<!-- description -->
	{#if description}
		<p class="{sz.desc} text-muted-foreground max-w-xs leading-relaxed">{description}</p>
	{/if}

	<!-- custom slot -->
	{#if children}
		{@render children()}
	{/if}

	<!-- action button -->
	{#if action}
		<button
			onclick={action.onclick}
			class="mt-1 inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:opacity-90 active:scale-95 transition-all"
		>
			{action.label}
		</button>
	{/if}
</div>
