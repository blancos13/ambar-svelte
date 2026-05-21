<script lang="ts">
	type Props = {
		checked?: boolean;
		label?: string;
		hint?: string;
		disabled?: boolean;
		indeterminate?: boolean;
		onchange?: (v: boolean) => void;
	};

	let {
		checked = $bindable(false),
		label,
		hint,
		disabled = false,
		indeterminate = false,
		onchange,
	}: Props = $props();

	function toggle() {
		if (disabled) return;
		checked = !checked;
		onchange?.(checked);
	}

	function onKey(e: KeyboardEvent) {
		if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); toggle(); }
	}
</script>

<button
	type="button"
	role="checkbox"
	aria-checked={indeterminate ? 'mixed' : checked}
	aria-disabled={disabled}
	class="group flex items-start gap-3 text-left {disabled ? 'pointer-events-none opacity-50' : ''}"
	onclick={toggle}
	onkeydown={onKey}
>
	<!-- Box -->
	<span class="
		relative mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md
		transition-all duration-150 active:scale-90
		{checked || indeterminate
			? 'bg-accent'
			: 'bg-muted group-hover:bg-[color-mix(in_srgb,var(--muted)_80%,var(--border))]'}
	">
		<!-- Checkmark -->
		{#if checked && !indeterminate}
			<svg
				class="check-icon size-3 text-accent-foreground"
				viewBox="0 0 12 10" fill="none"
				stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
			>
				<path d="M1 5l3.5 3.5L11 1"/>
			</svg>
		{/if}

		<!-- Indeterminate dash -->
		{#if indeterminate}
			<span class="h-0.5 w-2.5 rounded-full bg-accent-foreground"></span>
		{/if}
	</span>

	<!-- Label + hint -->
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
	.check-icon {
		animation: cb-pop 0.2s cubic-bezier(0.34, 1.56, 0.64, 1) both;
	}

	@keyframes cb-pop {
		from { opacity: 0; transform: scale(0.4) rotate(-10deg); }
		to   { opacity: 1; transform: scale(1) rotate(0deg); }
	}
</style>
