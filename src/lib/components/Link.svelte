<script lang="ts">
	import type { Snippet } from 'svelte';

	type Variant =
		| 'inline'
		| 'accent'
		| 'muted'
		| 'underline'
		| 'double'
		| 'dotted'
		| 'dashed'
		| 'wavy'
		| 'overline'
		| 'over-under'
		| 'strike'
		| 'strike-soft'
		| 'mark'
		| 'reveal'
		| 'pill'
		| 'button'
		| 'icon';
	type Size = 'sm' | 'md' | 'lg';
	type IconSide = 'left' | 'right';
	type Motion = 'none' | 'line' | 'scan' | 'dash' | 'pulse' | 'glint' | 'highlight';

	type Props = {
		href?: string;
		variant?: Variant;
		size?: Size;
		external?: boolean;
		disabled?: boolean;
		animated?: boolean;
		motion?: Motion;
		icon?: string;
		iconSide?: IconSide;
		ariaLabel?: string;
		onclick?: (event: MouseEvent) => void;
		children?: Snippet;
		class?: string;
	};

	let {
		href = '#',
		variant = 'inline',
		size = 'md',
		external = false,
		disabled = false,
		animated = true,
		motion = 'none',
		icon,
		iconSide = 'left',
		ariaLabel,
		onclick,
		children,
		class: cls = '',
	}: Props = $props();

	const target = $derived(external && !disabled ? '_blank' : undefined);
	const rel = $derived(external && !disabled ? 'noreferrer' : undefined);

	function handleClick(event: MouseEvent) {
		if (disabled) {
			event.preventDefault();
			event.stopPropagation();
			return;
		}

		onclick?.(event);
	}
</script>

<a
	href={disabled ? undefined : href}
	target={target}
	rel={rel}
	aria-label={ariaLabel}
	aria-disabled={disabled ? 'true' : undefined}
	class="link link-{variant} link-{size} {cls}"
	class:link-disabled={disabled}
	class:link-animated={animated}
	class:link-motion-line={motion === 'line'}
	class:link-motion-scan={motion === 'scan'}
	class:link-motion-dash={motion === 'dash'}
	class:link-motion-pulse={motion === 'pulse'}
	class:link-motion-glint={motion === 'glint'}
	class:link-motion-highlight={motion === 'highlight'}
	onclick={handleClick}
>
	{#if icon && iconSide === 'left'}
		<svg class="link-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
			<path d={icon} />
		</svg>
	{/if}

	{#if children}
		<span class="link-label">
			{@render children()}
		</span>
	{/if}

	{#if external}
		<svg class="link-external" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
			<path d="M7 17 17 7M9 7h8v8" />
		</svg>
	{:else if icon && iconSide === 'right'}
		<svg class="link-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
			<path d={icon} />
		</svg>
	{/if}
</a>

<style>
	.link {
		position: relative;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.375rem;
		width: fit-content;
		max-width: 100%;
		border: 0;
		border-radius: 9999px;
		color: var(--foreground);
		font-weight: 650;
		line-height: 1.35;
		text-decoration: none;
		outline: none;
		cursor: pointer;
		user-select: none;
		-webkit-tap-highlight-color: transparent;
		transition:
			background-color 0.15s ease,
			color 0.15s ease,
			box-shadow 0.15s ease,
			transform 0.1s var(--ease-out-expo);
	}

	.link::after {
		position: absolute;
		right: 0;
		bottom: -2px;
		left: 0;
		height: 2px;
		border-radius: 9999px;
		background: var(--accent);
		content: '';
		opacity: 0;
		transform: scaleX(0.35);
		transform-origin: left center;
		transition:
			opacity 0.15s ease,
			transform 0.2s var(--ease-out-expo);
	}

	.link:hover::after,
	.link:focus-visible::after {
		opacity: 1;
		transform: scaleX(1);
	}

	.link:active {
		transform: scale(0.94);
	}

	.link:focus-visible {
		box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 40%, transparent);
	}

	.link-label {
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.link-svg,
	.link-external {
		width: 1em;
		height: 1em;
		flex: 0 0 auto;
	}

	.link-sm {
		font-size: 0.75rem;
	}

	.link-md {
		font-size: 0.875rem;
	}

	.link-lg {
		font-size: 1rem;
	}

	.link-pill.link-sm,
	.link-button.link-sm {
		min-height: 1.625rem;
	}

	.link-pill.link-md,
	.link-button.link-md {
		min-height: 2rem;
	}

	.link-pill.link-lg,
	.link-button.link-lg {
		min-height: 2.375rem;
	}

	.link-inline {
		border-radius: 0.375rem;
		color: var(--foreground);
	}

	.link-accent {
		color: color-mix(in srgb, var(--accent) 82%, var(--foreground));
	}

	.link-muted {
		color: var(--muted-foreground);
	}

	.link-muted:hover,
	.link-muted:focus-visible {
		color: var(--foreground);
	}

	.link-underline,
	.link-double,
	.link-dotted,
	.link-dashed,
	.link-wavy,
	.link-overline,
	.link-over-under,
	.link-strike,
	.link-strike-soft,
	.link-mark,
	.link-reveal {
		border-radius: 0.375rem;
		color: var(--foreground);
	}

	.link-underline,
	.link-double,
	.link-dotted,
	.link-dashed,
	.link-wavy {
		text-decoration: underline;
		text-decoration-color: color-mix(in srgb, var(--accent) 72%, transparent);
		text-decoration-thickness: 2px;
		text-underline-offset: 0.22em;
		transition:
			color 0.15s ease,
			text-decoration-color 0.15s ease,
			text-decoration-thickness 0.18s var(--ease-out-expo),
			text-underline-offset 0.18s var(--ease-out-expo),
			box-shadow 0.15s ease,
			transform 0.1s var(--ease-out-expo);
	}

	.link-double {
		text-decoration-style: double;
		text-decoration-thickness: 1.5px;
		text-underline-offset: 0.24em;
	}

	.link-dotted {
		text-decoration-style: dotted;
		text-decoration-thickness: 2.5px;
		text-underline-offset: 0.26em;
	}

	.link-dashed {
		text-decoration-style: dashed;
		text-underline-offset: 0.28em;
	}

	.link-wavy {
		text-decoration-style: wavy;
		text-decoration-thickness: 1.5px;
		text-underline-offset: 0.22em;
	}

	.link-overline {
		text-decoration: overline;
		text-decoration-color: color-mix(in srgb, var(--accent) 76%, transparent);
		text-decoration-thickness: 2px;
		transition:
			color 0.15s ease,
			text-decoration-color 0.15s ease,
			text-decoration-thickness 0.18s var(--ease-out-expo),
			box-shadow 0.15s ease,
			transform 0.1s var(--ease-out-expo);
	}

	.link-over-under {
		text-decoration-line: underline overline;
		text-decoration-color: color-mix(in srgb, var(--accent) 70%, transparent);
		text-decoration-thickness: 1.5px;
		text-underline-offset: 0.22em;
		transition:
			color 0.15s ease,
			text-decoration-color 0.15s ease,
			text-decoration-thickness 0.18s var(--ease-out-expo),
			text-underline-offset 0.18s var(--ease-out-expo),
			box-shadow 0.15s ease,
			transform 0.1s var(--ease-out-expo);
	}

	.link-strike {
		color: var(--muted-foreground);
		text-decoration: line-through;
		text-decoration-color: color-mix(in srgb, var(--destructive) 72%, transparent);
		text-decoration-thickness: 2px;
		transition:
			color 0.15s ease,
			text-decoration-color 0.15s ease,
			text-decoration-thickness 0.18s var(--ease-out-expo),
			box-shadow 0.15s ease,
			transform 0.1s var(--ease-out-expo);
	}

	.link-strike-soft {
		color: var(--muted-foreground);
		text-decoration-line: underline line-through;
		text-decoration-color: color-mix(in srgb, var(--accent) 60%, transparent);
		text-decoration-thickness: 1.5px;
		text-underline-offset: 0.22em;
		transition:
			color 0.15s ease,
			text-decoration-color 0.15s ease,
			text-decoration-thickness 0.18s var(--ease-out-expo),
			text-underline-offset 0.18s var(--ease-out-expo),
			box-shadow 0.15s ease,
			transform 0.1s var(--ease-out-expo);
	}

	.link-mark {
		padding-right: 0.0625rem;
		padding-left: 0.0625rem;
		background:
			linear-gradient(
				to top,
				color-mix(in srgb, var(--accent) 34%, transparent) 0 34%,
				transparent 34% 100%
			);
		transition:
			background-size 0.22s var(--ease-out-expo),
			background-position 0.22s var(--ease-out-expo),
			color 0.15s ease,
			box-shadow 0.15s ease,
			transform 0.1s var(--ease-out-expo);
	}

	.link-reveal {
		padding-right: 0.0625rem;
		padding-left: 0.0625rem;
		background:
			linear-gradient(
				to right,
				color-mix(in srgb, var(--accent) 34%, transparent),
				color-mix(in srgb, var(--accent) 34%, transparent)
			)
			0 86% / 0 0.28em no-repeat;
		transition:
			background-size 0.22s var(--ease-out-expo),
			color 0.15s ease,
			box-shadow 0.15s ease,
			transform 0.1s var(--ease-out-expo);
	}

	.link-underline:hover,
	.link-underline:focus-visible,
	.link-double:hover,
	.link-double:focus-visible,
	.link-dotted:hover,
	.link-dotted:focus-visible,
	.link-dashed:hover,
	.link-dashed:focus-visible,
	.link-wavy:hover,
	.link-wavy:focus-visible,
	.link-overline:hover,
	.link-overline:focus-visible,
	.link-over-under:hover,
	.link-over-under:focus-visible {
		color: color-mix(in srgb, var(--accent) 78%, var(--foreground));
		text-decoration-color: var(--accent);
	}

	.link-strike:hover,
	.link-strike:focus-visible,
	.link-strike-soft:hover,
	.link-strike-soft:focus-visible {
		color: var(--foreground);
		text-decoration-color: var(--destructive);
	}

	.link-mark:hover,
	.link-mark:focus-visible {
		background:
			linear-gradient(
				to top,
				color-mix(in srgb, var(--accent) 44%, transparent) 0 44%,
				transparent 44% 100%
			);
	}

	.link-reveal:hover,
	.link-reveal:focus-visible {
		background-size: 100% 0.28em;
	}

	.link-animated.link-underline:hover,
	.link-animated.link-underline:focus-visible,
	.link-animated.link-double:hover,
	.link-animated.link-double:focus-visible,
	.link-animated.link-dotted:hover,
	.link-animated.link-dotted:focus-visible,
	.link-animated.link-dashed:hover,
	.link-animated.link-dashed:focus-visible,
	.link-animated.link-wavy:hover,
	.link-animated.link-wavy:focus-visible {
		text-decoration-thickness: 3px;
		text-underline-offset: 0.34em;
	}

	.link-animated.link-overline:hover,
	.link-animated.link-overline:focus-visible,
	.link-animated.link-over-under:hover,
	.link-animated.link-over-under:focus-visible {
		text-decoration-thickness: 2.5px;
		text-underline-offset: 0.34em;
	}

	.link-animated.link-strike:hover,
	.link-animated.link-strike:focus-visible,
	.link-animated.link-strike-soft:hover,
	.link-animated.link-strike-soft:focus-visible {
		text-decoration-thickness: 3px;
		text-underline-offset: 0.34em;
	}

	.link-animated.link-mark {
		background-size: 100% 100%;
		background-position: 0 0;
	}

	.link-animated.link-mark:hover,
	.link-animated.link-mark:focus-visible {
		background-position: 0 -0.08em;
	}

	.link-animated.link-wavy:hover,
	.link-animated.link-wavy:focus-visible {
		animation: link-wavy-pop 0.42s var(--ease-out-expo);
	}

	.link-animated.link-dashed:hover,
	.link-animated.link-dashed:focus-visible,
	.link-animated.link-dotted:hover,
	.link-animated.link-dotted:focus-visible {
		animation: link-line-pop 0.34s var(--ease-out-expo);
	}

	@keyframes link-wavy-pop {
		0% { transform: translateY(0) scale(1); }
		45% { transform: translateY(-1px) scale(1.025); }
		100% { transform: translateY(0) scale(1); }
	}

	@keyframes link-line-pop {
		0% { transform: scale(1); }
		45% { transform: scale(1.035); }
		100% { transform: scale(1); }
	}

	.link-pill,
	.link-button,
	.link-icon {
		padding-right: 0.875rem;
		padding-left: 0.875rem;
	}

	.link-pill {
		background: var(--secondary);
		color: var(--secondary-foreground);
	}

	.link-pill:hover,
	.link-pill:focus-visible {
		background: var(--muted);
		color: var(--foreground);
	}

	.link-button {
		background: var(--accent);
		color: var(--accent-foreground);
	}

	.link-button:hover,
	.link-button:focus-visible {
		background: var(--accent-hover);
	}

	.link-icon {
		aspect-ratio: 1;
		padding: 0;
		background: transparent;
		color: var(--muted-foreground);
	}

	.link-icon.link-sm {
		width: 1.625rem;
		height: 1.625rem;
	}

	.link-icon.link-md {
		width: 2rem;
		height: 2rem;
	}

	.link-icon.link-lg {
		width: 2.375rem;
		height: 2.375rem;
	}

	.link-icon:hover,
	.link-icon:focus-visible {
		background: var(--secondary);
		color: var(--foreground);
	}

	.link-pill::after,
	.link-button::after,
	.link-icon::after,
	.link-underline::after,
	.link-double::after,
	.link-dotted::after,
	.link-dashed::after,
	.link-wavy::after,
	.link-overline::after,
	.link-over-under::after,
	.link-strike::after,
	.link-strike-soft::after,
	.link-mark::after,
	.link-reveal::after {
		display: none;
	}

	.link-motion-line::after,
	.link-motion-scan::after,
	.link-motion-dash::after,
	.link-motion-pulse::after {
		display: block;
		bottom: -0.28em;
		height: 2px;
		border-radius: 9999px;
		opacity: 1;
		transition: none;
	}

	.link-motion-line,
	.link-motion-scan,
	.link-motion-dash,
	.link-motion-pulse {
		text-decoration: none;
	}

	.link-motion-line::after {
		background:
			linear-gradient(
				90deg,
				transparent 0 10%,
				color-mix(in srgb, var(--accent) 34%, transparent) 34%,
				var(--accent) 50%,
				color-mix(in srgb, var(--accent) 34%, transparent) 66%,
				transparent 90% 100%
			);
		background-size: 240% 100%;
		background-position: 112% 0;
		transform: scaleX(1);
		animation: link-motion-sweep 1.05s ease-in-out infinite alternate;
	}

	.link-motion-scan::after {
		background:
			linear-gradient(
				90deg,
				transparent 0 12%,
				color-mix(in srgb, var(--accent) 28%, transparent) 34%,
				var(--accent) 50%,
				color-mix(in srgb, var(--accent) 28%, transparent) 66%,
				transparent 88% 100%
			);
		background-size: 230% 100%;
		background-position: 112% 0;
		transform: scaleX(1);
		animation: link-motion-sweep 1.22s ease-in-out infinite alternate;
	}

	.link-motion-dash::after {
		background:
			repeating-linear-gradient(
				90deg,
				var(--accent) 0 0.5rem,
				transparent 0.5rem 0.78rem
			);
		background-size: 1.28rem 100%;
		background-position: 0 0;
		transform: scaleX(1);
		animation: link-motion-dash 0.68s linear infinite;
	}

	.link-motion-pulse::after {
		background: var(--accent);
		opacity: 0.36;
		transform: scaleX(0.42);
		transform-origin: center;
		animation: link-motion-pulse 0.72s ease-in-out infinite alternate;
	}

	.link-motion-glint .link-label {
		background:
			linear-gradient(
				90deg,
				currentColor 0 36%,
				var(--accent) 48%,
				currentColor 60% 100%
			);
		background-size: 230% 100%;
		background-position: 112% 0;
		background-clip: text;
		color: transparent;
		animation: link-motion-sweep 1.55s ease-in-out infinite alternate;
	}

	.link-motion-highlight {
		background:
			linear-gradient(
				to top,
				color-mix(in srgb, var(--accent) 34%, transparent) 0 0.34em,
				transparent 0.34em 100%
			)
			0 100% / 38% 100% no-repeat;
		animation: link-motion-highlight 0.95s ease-in-out infinite alternate;
	}

	.link-motion-highlight:hover,
	.link-motion-highlight:focus-visible {
		background-size: 100% 100%;
	}

	@keyframes link-motion-sweep {
		to { background-position: -112% 0; }
	}

	@keyframes link-motion-dash {
		to { background-position: 1.28rem 0; }
	}

	@keyframes link-motion-pulse {
		to {
			opacity: 1;
			transform: scaleX(1);
		}
	}

	@keyframes link-motion-highlight {
		to { background-position: 100% 100%; }
	}

	@media (prefers-reduced-motion: reduce) {
		.link-motion-line::after,
		.link-motion-scan::after,
		.link-motion-dash::after {
			animation: none;
			transform: scaleX(1);
		}

		.link-motion-pulse::after {
			animation: none;
			opacity: 1;
			transform: scaleX(1);
		}

		.link-motion-glint .link-label,
		.link-motion-highlight {
			animation: none;
		}
	}

	.link-disabled {
		opacity: 0.42;
		pointer-events: none;
		cursor: not-allowed;
	}
</style>
