<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		value?: string;
		type?: 'text' | 'email' | 'password' | 'search' | 'url' | 'tel' | 'number';
		label?: string;
		placeholder?: string;
		hint?: string;
		error?: string;
		disabled?: boolean;
		clearable?: boolean;
		prefix?: string;
		suffix?: string;
		start?: Snippet;
		end?: Snippet;
		onvalue?: (v: string) => void;
		[key: string]: any;
	};

	let {
		value = $bindable(''),
		type = 'text',
		label,
		placeholder = '',
		hint,
		error,
		disabled = false,
		clearable = false,
		prefix,
		suffix,
		start,
		end,
		onvalue,
		...rest
	}: Props = $props();

	let focused  = $state(false);
	let showPass = $state(false);
	let hasError = $derived(!!error);

	let inputType = $derived(type === 'password' ? (showPass ? 'text' : 'password') : type);

	function handleInput(e: Event) {
		value = (e.target as HTMLInputElement).value;
		onvalue?.(value);
	}
</script>

<div class="flex w-full flex-col gap-1.5 {disabled ? 'pointer-events-none opacity-50' : ''}">
	{#if label}
		<label class="pl-0.5 text-sm font-medium {hasError ? 'text-destructive' : 'text-muted-foreground'}">{label}</label>
	{/if}

	<div class="
		flex h-12 w-full items-center gap-2 rounded-xl px-3 transition-all duration-150
		{focused
			? 'bg-card shadow-[inset_0_0_0_1.5px_var(--accent)]'
			: 'bg-muted hover:bg-[color-mix(in_srgb,var(--muted)_80%,var(--border))]'}
		{hasError ? '!shadow-[inset_0_0_0_1.5px_var(--destructive)]' : ''}
	">
		<!-- Start icon -->
		{#if start}
			<span class="flex shrink-0 items-center text-muted-foreground">{@render start()}</span>
		{:else if type === 'search'}
			<svg class="size-4 shrink-0 text-muted-foreground" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
				<path d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"/>
			</svg>
		{/if}

		<!-- Prefix -->
		{#if prefix}
			<span class="shrink-0 border-r border-border pr-2.5 text-sm text-muted-foreground">{prefix}</span>
		{/if}

		<div class="flex min-w-0 flex-1">
			<input
				{...rest}
				type={inputType}
				{value}
				{disabled}
				{placeholder}
				class="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground
				{prefix ? 'pl-2.5' : ''}"
				onfocus={() => (focused = true)}
				onblur={() => (focused = false)}
				oninput={handleInput}
			/>
		</div>

		<!-- Suffix -->
		{#if suffix}
			<span class="shrink-0 border-l border-border pl-2.5 text-sm text-muted-foreground">{suffix}</span>
		{/if}

		<!-- Clear -->
		{#if clearable && value && !disabled}
			<button
				type="button"
				class="flex size-6 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-border hover:text-foreground active:scale-90"
				onclick={() => { value = ''; onvalue?.(''); }}
				tabindex="-1" aria-label="Clear"
			>
				<svg class="size-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
					<path d="M6 18L18 6M6 6l12 12"/>
				</svg>
			</button>
		{/if}

		<!-- Password toggle -->
		{#if type === 'password'}
			<button
				type="button"
				class="flex size-6 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-border hover:text-foreground active:scale-90"
				onclick={() => (showPass = !showPass)}
				tabindex="-1" aria-label="Toggle password"
			>
				{#if showPass}
					<svg class="size-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
						<path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
						<path d="M1 1l22 22"/>
					</svg>
				{:else}
					<svg class="size-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
						<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
					</svg>
				{/if}
			</button>
		{/if}

		<!-- End icon -->
		{#if end}
			<span class="flex shrink-0 items-center text-muted-foreground">{@render end()}</span>
		{/if}
	</div>

	{#if error}
		<p class="pl-0.5 text-xs text-destructive">{error}</p>
	{:else if hint}
		<p class="pl-0.5 text-xs text-muted-foreground">{hint}</p>
	{/if}
</div>
