<script lang="ts">
	type Props = {
		value?: string;
		label?: string;
		placeholder?: string;
		hint?: string;
		error?: string;
		disabled?: boolean;
		rows?: number;
		maxlength?: number;
		autoresize?: boolean;
		onvalue?: (v: string) => void;
		[key: string]: any;
	};

	let {
		value = $bindable(''),
		label,
		placeholder = '',
		hint,
		error,
		disabled = false,
		rows = 3,
		maxlength,
		autoresize = false,
		onvalue,
		...rest
	}: Props = $props();

	let focused  = $state(false);
	let hasError = $derived(!!error);
	let el: HTMLTextAreaElement | undefined = $state();

	function handleInput(e: Event) {
		value = (e.target as HTMLTextAreaElement).value;
		onvalue?.(value);
		if (autoresize && el) {
			el.style.height = 'auto';
			el.style.height = el.scrollHeight + 'px';
		}
	}
</script>

<div class="flex w-full flex-col gap-1.5 {disabled ? 'pointer-events-none opacity-50' : ''}">
	{#if label}
		<label class="pl-0.5 text-sm font-medium {hasError ? 'text-destructive' : 'text-muted-foreground'}">{label}</label>
	{/if}

	<div class="
		w-full rounded-xl transition-all duration-150
		{focused
			? 'bg-card shadow-[inset_0_0_0_1.5px_var(--accent)]'
			: 'bg-muted hover:bg-[color-mix(in_srgb,var(--muted)_80%,var(--border))]'}
		{hasError ? '!shadow-[inset_0_0_0_1.5px_var(--destructive)]' : ''}
	">
		<textarea
			{...rest}
			bind:this={el}
			{value}
			{disabled}
			{rows}
			{maxlength}
			{placeholder}
			class="block w-full resize-y bg-transparent px-4 py-3 text-sm leading-relaxed text-foreground outline-none
				placeholder:text-muted-foreground"
			onfocus={() => (focused = true)}
			onblur={() => (focused = false)}
			oninput={handleInput}
		></textarea>
	</div>

	<div class="flex items-center justify-between px-0.5">
		{#if error}
			<p class="text-xs text-destructive">{error}</p>
		{:else if hint}
			<p class="text-xs text-muted-foreground">{hint}</p>
		{:else}
			<span></span>
		{/if}
		{#if maxlength}
			<span class="text-xs {value.length > maxlength * 0.9 ? 'text-destructive' : 'text-muted-foreground'}">
				{value.length}/{maxlength}
			</span>
		{/if}
	</div>
</div>
