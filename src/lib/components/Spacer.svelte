<script lang="ts">
	type Props = {
		size?: number | string;
		axis?: 'x' | 'y';
	};

	let { size, axis }: Props = $props();

	const val = size === undefined
		? undefined
		: typeof size === 'number' ? `${size * 0.25}rem` : size;

	const w = $derived(!axis || axis === 'x' ? (val ?? undefined) : '0');
	const h = $derived(!axis || axis === 'y' ? (val ?? undefined) : '0');
</script>

<div
	aria-hidden="true"
	style:flex={val ? undefined : '1 1 0'}
	style:width={w}
	style:height={h}
	style:min-width={axis === 'x' ? val : undefined}
	style:min-height={axis === 'y' ? val : undefined}
></div>
