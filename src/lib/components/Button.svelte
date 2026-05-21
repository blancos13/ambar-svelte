<script lang="ts">
	import type { Snippet } from 'svelte';
	import Spinner from './Spinner.svelte';

	type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'icon';
	type Size = 'sm' | 'md' | 'lg' | 'icon';
	type ButtonType = 'button' | 'submit' | 'reset';

	type Props = {
		variant?: Variant;
		size?: Size;
		type?: ButtonType;
		href?: string;
		external?: boolean;
		disabled?: boolean;
		loading?: boolean;
		fullWidth?: boolean;
		ariaLabel?: string;
		ariaPressed?: boolean;
		onclick?: (event: MouseEvent) => void;
		children?: Snippet;
		class?: string;
	};

	let {
		variant = 'primary',
		size = 'md',
		type = 'button',
		href,
		external = false,
		disabled = false,
		loading = false,
		fullWidth = false,
		ariaLabel,
		ariaPressed,
		onclick,
		children,
		class: cls = '',
	}: Props = $props();

	const isIcon = $derived(variant === 'icon' || size === 'icon');
	const variantClass = $derived(isIcon ? 'btn-icon' : `btn-${variant}`);
	const sizeClass = $derived(size === 'sm' ? 'btn-sm' : size === 'lg' ? 'btn-lg' : '');
	const stateClass = $derived([
		sizeClass,
		fullWidth ? 'w-full' : '',
		loading ? 'button-loading' : '',
		cls,
	].filter(Boolean).join(' '));
	const buttonClass = $derived(`${variantClass}${stateClass ? ` ${stateClass}` : ''}`);
	const target = $derived(external && href && !disabled ? '_blank' : undefined);
	const rel = $derived(external && href && !disabled ? 'noreferrer' : undefined);

	function handleClick(event: MouseEvent) {
		if (disabled || loading) {
			event.preventDefault();
			event.stopPropagation();
			return;
		}

		onclick?.(event);
	}
</script>

{#if href}
	<a
		href={disabled || loading ? undefined : href}
		target={target}
		rel={rel}
		aria-label={ariaLabel}
		aria-disabled={disabled || loading ? 'true' : undefined}
		class={buttonClass}
		onclick={handleClick}
	>
		{#if loading}
			<Spinner size="xs" color="currentColor" />
		{/if}

		{#if children}
			{@render children()}
		{/if}
	</a>
{:else}
	<button
		{type}
		disabled={disabled || loading}
		aria-label={ariaLabel}
		aria-pressed={ariaPressed}
		class={buttonClass}
		onclick={handleClick}
	>
		{#if loading}
			<Spinner size="xs" color="currentColor" />
		{/if}

		{#if children}
			{@render children()}
		{/if}
	</button>
{/if}
