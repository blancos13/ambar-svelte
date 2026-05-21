<script lang="ts">
	import type { Snippet } from 'svelte';

	type Align   = 'start' | 'center' | 'end' | 'stretch' | 'baseline';
	type Justify = 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';

	type Props = {
		gap?:     number | string;
		align?:   Align;
		justify?: Justify;
		padding?: number | string;
		as?:      string;
		class?:   string;
		children: Snippet;
	};

	let {
		gap     = 0,
		align   = 'stretch',
		justify = 'start',
		padding = 0,
		as      = 'div',
		class: cls = '',
		children,
	}: Props = $props();

	const sz = (v: number | string) =>
		v === 0 ? undefined : typeof v === 'number' ? `${v * 0.25}rem` : v;

	const ai: Record<Align,   string> = { start:'flex-start', center:'center', end:'flex-end', stretch:'stretch',      baseline:'baseline'    };
	const jc: Record<Justify, string> = { start:'flex-start', center:'center', end:'flex-end', between:'space-between', around:'space-around', evenly:'space-evenly' };
</script>

<svelte:element
	this={as}
	class={cls || undefined}
	style:display="flex"
	style:flex-direction="column"
	style:gap={sz(gap)}
	style:align-items={ai[align]}
	style:justify-content={jc[justify]}
	style:padding={sz(padding)}
>
	{@render children()}
</svelte:element>
