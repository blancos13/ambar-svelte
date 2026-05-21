<script lang="ts">
	type Size = 'sm' | 'md' | 'lg';

	type Props = {
		checked?: boolean;
		label?: string;
		hint?: string;
		size?: Size;
		disabled?: boolean;
		onchange?: (v: boolean) => void;
	};

	let {
		checked  = $bindable(false),
		label,
		hint,
		size     = 'md',
		disabled = false,
		onchange,
	}: Props = $props();

	let pressing = $state(false);

	function toggle() {
		if (disabled) return;
		checked = !checked;
		onchange?.(checked);
	}

	function onKey(e: KeyboardEvent) {
		if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); toggle(); }
	}

	const track: Record<Size, string> = {
		sm: 'w-8 h-[18px]',
		md: 'w-11 h-6',
		lg: 'w-14 h-[30px]',
	};
	const thumb: Record<Size, string> = {
		sm: 'size-3.5',
		md: 'size-[18px]',
		lg: 'size-[22px]',
	};
	const offset: Record<Size, string> = {
		sm: 'translate-x-[18px]',
		md: 'translate-x-[22px]',
		lg: 'translate-x-[28px]',
	};
	const padding: Record<Size, string> = {
		sm: 'p-[2px]',
		md: 'p-[3px]',
		lg: 'p-[4px]',
	};
</script>

<button
	type="button"
	role="switch"
	aria-checked={checked}
	aria-disabled={disabled}
	class="group flex items-center gap-3 text-left {disabled ? 'pointer-events-none opacity-50' : ''}"
	onclick={toggle}
	onkeydown={onKey}
	onpointerdown={() => (pressing = true)}
	onpointerup={() => (pressing = false)}
	onpointerleave={() => (pressing = false)}
>
	<!-- Track -->
	<span
		class="relative inline-flex shrink-0 items-center rounded-full {track[size]} {padding[size]}
			transition-colors duration-200
			{checked ? 'bg-accent' : 'bg-muted group-hover:bg-border'}"
	>
		<!-- Thumb -->
		<span
			class="inline-block rounded-full bg-white shadow-sm
				{thumb[size]}
				{pressing ? 'scale-90' : 'scale-100'}
				transition-all duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)]
				{checked ? offset[size] : 'translate-x-0'}"
		></span>
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
