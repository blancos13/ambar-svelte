<script lang="ts">
	import type { Snippet } from 'svelte';

	type Direction = 'row' | 'column' | 'row-reverse' | 'column-reverse';
	type Align     = 'start' | 'center' | 'end' | 'stretch' | 'baseline';
	type Justify   = 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
	type Wrap      = boolean | 'reverse';

	type Props = {
		direction?: Direction;
		gap?:       number | string;
		align?:     Align;
		justify?:   Justify;
		wrap?:      Wrap;
		grow?:      boolean;
		shrink?:    boolean;
		padding?:   number | string;
		as?:        string;
		class?:     string;
		children:   Snippet;
	};

	let {
		direction = 'row',
		gap       = 0,
		align     = 'stretch',
		justify   = 'start',
		wrap      = false,
		grow      = false,
		shrink    = false,
		padding   = 0,
		as        = 'div',
		class: cls = '',
		children,
	}: Props = $props();

	const sz = (v: number | string) =>
		v === 0 ? undefined : typeof v === 'number' ? `${v * 0.25}rem` : v;

	const ai: Record<Align,   string> = { start:'flex-start', center:'center', end:'flex-end', stretch:'stretch',      baseline:'baseline'    };
	const jc: Record<Justify, string> = { start:'flex-start', center:'center', end:'flex-end', between:'space-between', around:'space-around', evenly:'space-evenly' };

	const wrapVal  = $derived(wrap === 'reverse' ? 'wrap-reverse' : wrap ? 'wrap' : undefined);
	const growVal  = $derived(grow   ? '1' : undefined);
	const shrinkVal= $derived(shrink ? '1' : undefined);
</script>

<svelte:element
	this={as}
	class={cls || undefined}
	style:display="flex"
	style:flex-direction={direction}
	style:flex-wrap={wrapVal}
	style:flex-grow={growVal}
	style:flex-shrink={shrinkVal}
	style:gap={sz(gap)}
	style:align-items={ai[align]}
	style:justify-content={jc[justify]}
	style:padding={sz(padding)}
>
	{@render children()}
</svelte:element>
