<script lang="ts">
	import type { Snippet } from 'svelte';

	type Variant = 'display' | 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'body-sm' | 'caption' | 'label' | 'code' | 'quote';
	type Weight  = 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold';
	type Align   = 'left' | 'center' | 'right';
	type Color   = 'default' | 'muted' | 'accent' | 'destructive';

	type Props = {
		variant?:  Variant;
		weight?:   Weight;
		align?:    Align;
		color?:    Color;
		truncate?: boolean;
		children:  Snippet;
	};

	let {
		variant  = 'body',
		weight,
		align,
		color    = 'default',
		truncate = false,
		children,
	}: Props = $props();

	const tags: Record<Variant, string> = {
		display: 'h1', h1: 'h1', h2: 'h2', h3: 'h3', h4: 'h4',
		body: 'p', 'body-sm': 'p', caption: 'span', label: 'span',
		code: 'code', quote: 'blockquote',
	};

	const base: Record<Variant, string> = {
		display:  'text-5xl font-extrabold tracking-tight leading-none',
		h1:       'text-3xl font-bold tracking-tight leading-tight',
		h2:       'text-2xl font-bold leading-snug',
		h3:       'text-xl font-semibold leading-snug',
		h4:       'text-base font-semibold leading-snug',
		body:     'text-sm leading-relaxed',
		'body-sm':'text-xs leading-relaxed',
		caption:  'text-xs leading-normal',
		label:    'text-xs font-medium uppercase tracking-wider',
		code:     'font-mono text-sm rounded-md bg-muted px-1.5 py-0.5',
		quote:    'border-l-2 border-accent pl-4 text-sm italic leading-relaxed',
	};

	const colors: Record<Color, string> = {
		default:     'text-foreground',
		muted:       'text-muted-foreground',
		accent:      'text-accent',
		destructive: 'text-destructive',
	};

	const weights: Record<Weight, string> = {
		normal:    'font-normal',
		medium:    'font-medium',
		semibold:  'font-semibold',
		bold:      'font-bold',
		extrabold: 'font-extrabold',
	};

	const aligns: Record<Align, string> = {
		left: 'text-left', center: 'text-center', right: 'text-right',
	};

	const tag   = $derived(tags[variant]);
	const cls   = $derived([
		base[variant],
		colors[color],
		weight  ? weights[weight]  : '',
		align   ? aligns[align]    : '',
		truncate ? 'truncate'      : '',
	].filter(Boolean).join(' '));
</script>

<svelte:element this={tag} class={cls}>
	{@render children()}
</svelte:element>
