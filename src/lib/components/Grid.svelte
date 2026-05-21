<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		cols?:    number | string;
		rows?:    number | string;
		gap?:     number | string;
		gapX?:    number | string;
		gapY?:    number | string;
		padding?: number | string;
		as?:      string;
		class?:   string;
		children: Snippet;
	};

	let {
		cols    = 1,
		rows,
		gap,
		gapX,
		gapY,
		padding = 0,
		as      = 'div',
		class: cls = '',
		children,
	}: Props = $props();

	const sz = (v: number | string | undefined) => {
		if (v === undefined || v === 0) return undefined;
		return typeof v === 'number' ? `${v * 0.25}rem` : v;
	};

	const track = (v: number | string | undefined) => {
		if (!v) return undefined;
		return typeof v === 'number' ? `repeat(${v}, minmax(0, 1fr))` : v;
	};

	const colVal  = $derived(track(cols));
	const rowVal  = $derived(track(rows));
	const gapVal  = $derived(sz(gap));
	const gapXVal = $derived(sz(gapX));
	const gapYVal = $derived(sz(gapY));
</script>

<svelte:element
	this={as}
	class={cls || undefined}
	style:display="grid"
	style:grid-template-columns={colVal}
	style:grid-template-rows={rowVal}
	style:gap={gapVal}
	style:column-gap={gapXVal}
	style:row-gap={gapYVal}
	style:padding={sz(padding)}
>
	{@render children()}
</svelte:element>
