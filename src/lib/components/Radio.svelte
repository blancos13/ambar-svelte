<script lang="ts">
	type Props = {
		value:     unknown;
		group?:    unknown;    // $bindable — currently selected value
		label?:    string;
		hint?:     string;
		disabled?: boolean;
		onchange?: (v: unknown) => void;
	};

	let {
		value,
		group    = $bindable<unknown>(undefined),
		label,
		hint,
		disabled = false,
		onchange,
	}: Props = $props();

	const checked = $derived(group === value);

	function select() {
		if (disabled || checked) return;
		group = value;
		onchange?.(value);
	}

	function onKey(e: KeyboardEvent) {
		if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); select(); }
	}
</script>

<button
	type="button"
	role="radio"
	aria-checked={checked}
	aria-disabled={disabled}
	class="group flex items-start gap-3 text-left {disabled ? 'pointer-events-none opacity-50' : ''}"
	onclick={select}
	onkeydown={onKey}
>
	<!-- circle -->
	<span class="
		relative mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full
		transition-all duration-150 active:scale-90
		{checked
			? 'bg-accent'
			: 'bg-muted group-hover:bg-[color-mix(in_srgb,var(--muted)_80%,var(--border))]'}
	">
		{#if checked}
			<span class="radio-dot size-2 rounded-full bg-accent-foreground"></span>
		{/if}
	</span>

	<!-- label + hint -->
	{#if label || hint}
		<span class="flex flex-col gap-0.5">
			{#if label}
				<span class="text-sm font-medium leading-snug text-foreground">{label}</span>
			{/if}
			{#if hint}
				<span class="text-xs text-muted-foreground">{hint}</span>
			{/if}
		</span>
	{/if}
</button>

<style>
	.radio-dot {
		animation: radio-pop 0.22s cubic-bezier(0.34, 1.56, 0.64, 1) both;
	}
	@keyframes radio-pop {
		from { transform: scale(0); }
		to   { transform: scale(1); }
	}
</style>
