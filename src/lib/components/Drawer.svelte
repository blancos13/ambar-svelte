<script lang="ts">
	import { onMount } from 'svelte';
	import type { Snippet } from 'svelte';

	type Side = 'left' | 'right' | 'top' | 'bottom';
	type Size = 'sm' | 'md' | 'lg' | 'full';

	type Props = {
		open: boolean;
		onClose: () => void;
		side?: Side;
		size?: Size;
		title?: string;
		children: Snippet;
		footer?: Snippet;
	};

	let { open, onClose, side = 'right', size = 'md', title, children, footer }: Props = $props();

	let portalEl: HTMLDivElement | undefined = $state();
	let mounted = $state(false);
	let visible = $state(false);
	let closing = $state(false);

	const closeDur = 260;

	onMount(() => { mounted = true; });

	$effect(() => {
		if (portalEl && mounted && portalEl.parentElement !== document.body) {
			document.body.appendChild(portalEl);
		}
	});

	$effect(() => {
		if (open && mounted) {
			closing = false;
			visible = true;
			const sw = window.innerWidth - document.documentElement.clientWidth;
			document.body.style.overflow = 'hidden';
			if (sw > 0) document.body.style.paddingRight = `${sw}px`;
		}
	});

	$effect(() => {
		return () => {
			if (portalEl && portalEl.parentElement === document.body) {
				document.body.removeChild(portalEl);
			}
			document.body.style.overflow = '';
			document.body.style.paddingRight = '';
		};
	});

	function handleClose() {
		closing = true;
		document.body.style.overflow = '';
		document.body.style.paddingRight = '';
		setTimeout(() => {
			visible = false;
			closing = false;
			onClose();
		}, closeDur);
	}

	function onKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape' && visible) handleClose();
	}

	/* Size → CSS custom property value */
	const sizeMap: Record<Side, Record<Size, string>> = {
		left:   { sm: '260px', md: '320px', lg: '420px', full: '100%' },
		right:  { sm: '260px', md: '320px', lg: '420px', full: '100%' },
		top:    { sm: '220px', md: '320px', lg: '440px', full: '100%' },
		bottom: { sm: '220px', md: '320px', lg: '440px', full: '100%' },
	};
</script>

<svelte:window onkeydown={onKeydown} />

<div bind:this={portalEl} style="display: contents;">
{#if visible}
	<div
		class="drawer-root"
		class:drawer-closing={closing}
		data-side={side}
		role="dialog"
		aria-modal="true"
	>
		<!-- Backdrop -->
		<button
			class="drawer-backdrop"
			aria-label="Close"
			onclick={handleClose}
		></button>

		<!-- Panel -->
		<div
			class="drawer-panel drawer-panel-{side}"
			style="--drawer-size: {sizeMap[side][size]}"
		>
			<!-- Handle (bottom/top only) -->
			{#if side === 'bottom' || side === 'top'}
				<div class="drawer-handle"></div>
			{/if}

			<!-- Header -->
			{#if title}
				<div class="drawer-header">
					<span class="drawer-title">{title}</span>
					<button class="btn-icon drawer-close" onclick={handleClose} aria-label="Close">
						<svg class="size-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
							<path d="M6 18L18 6M6 6l12 12"/>
						</svg>
					</button>
				</div>
			{/if}

			<!-- Body -->
			<div class="drawer-body">
				{@render children()}
			</div>

			<!-- Footer -->
			{#if footer}
				<div class="drawer-footer">
					{@render footer()}
				</div>
			{/if}
		</div>
	</div>
{/if}
</div>

<style>
	.drawer-root {
		position: fixed;
		inset: 0;
		z-index: 9999;
	}

	/* ── Backdrop ── */
	.drawer-backdrop {
		position: fixed;
		inset: 0;
		border: none;
		cursor: default;
		background: rgba(0, 0, 0, 0.55);
		animation: drawer-fade-in 0.22s ease-out forwards;
	}
	.drawer-closing .drawer-backdrop {
		animation: drawer-fade-out 0.22s ease-in forwards;
	}

	/* ── Panel base ── */
	.drawer-panel {
		position: fixed;
		z-index: 1;
		background: var(--card);
		color: var(--card-foreground);
		box-shadow: 0 25px 60px -12px rgba(0, 0, 0, 0.4);
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}

	/* LEFT */
	.drawer-panel-left {
		top: 0; left: 0; bottom: 0;
		width: var(--drawer-size);
		border-radius: 0 1.25rem 1.25rem 0;
		animation: drawer-slide-from-left 0.32s cubic-bezier(0.16, 1, 0.3, 1) forwards;
	}
	.drawer-closing .drawer-panel-left {
		animation: drawer-slide-to-left 0.24s cubic-bezier(0.4, 0, 1, 1) forwards;
	}

	/* RIGHT */
	.drawer-panel-right {
		top: 0; right: 0; bottom: 0;
		width: var(--drawer-size);
		border-radius: 1.25rem 0 0 1.25rem;
		animation: drawer-slide-from-right 0.32s cubic-bezier(0.16, 1, 0.3, 1) forwards;
	}
	.drawer-closing .drawer-panel-right {
		animation: drawer-slide-to-right 0.24s cubic-bezier(0.4, 0, 1, 1) forwards;
	}

	/* TOP */
	.drawer-panel-top {
		top: 0; left: 0; right: 0;
		height: var(--drawer-size);
		border-radius: 0 0 1.25rem 1.25rem;
		animation: drawer-slide-from-top 0.32s cubic-bezier(0.16, 1, 0.3, 1) forwards;
	}
	.drawer-closing .drawer-panel-top {
		animation: drawer-slide-to-top 0.24s cubic-bezier(0.4, 0, 1, 1) forwards;
	}

	/* BOTTOM */
	.drawer-panel-bottom {
		bottom: 0; left: 0; right: 0;
		height: var(--drawer-size);
		border-radius: 1.25rem 1.25rem 0 0;
		animation: drawer-slide-from-bottom 0.32s cubic-bezier(0.16, 1, 0.3, 1) forwards;
	}
	.drawer-closing .drawer-panel-bottom {
		animation: drawer-slide-to-bottom 0.24s cubic-bezier(0.4, 0, 1, 1) forwards;
	}

	/* ── Handle ── */
	.drawer-handle {
		flex-shrink: 0;
		width: 2.5rem;
		height: 0.25rem;
		border-radius: 9999px;
		background: var(--muted-foreground);
		opacity: 0.3;
		margin: 0.875rem auto 0;
	}

	/* ── Header ── */
	.drawer-header {
		flex-shrink: 0;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 1rem 1.25rem 0.75rem;
		border-bottom: 1px solid var(--border);
	}
	.drawer-title {
		font-size: 1rem;
		font-weight: 700;
		color: var(--card-foreground);
	}
	.drawer-close {
		color: var(--muted-foreground);
	}

	/* ── Body ── */
	.drawer-body {
		flex: 1;
		overflow-y: auto;
		padding: 1.25rem;
	}

	/* ── Footer ── */
	.drawer-footer {
		flex-shrink: 0;
		padding: 1rem 1.25rem;
		border-top: 1px solid var(--border);
	}

	/* ════════════════════════════════
	   Keyframes
	   ════════════════════════════════ */
	@keyframes drawer-fade-in  { from { opacity: 0; } to { opacity: 1; } }
	@keyframes drawer-fade-out { from { opacity: 1; } to { opacity: 0; } }

	@keyframes drawer-slide-from-left   { from { transform: translateX(-100%); } to { transform: translateX(0); } }
	@keyframes drawer-slide-to-left     { from { transform: translateX(0); } to { transform: translateX(-100%); } }

	@keyframes drawer-slide-from-right  { from { transform: translateX(100%); } to { transform: translateX(0); } }
	@keyframes drawer-slide-to-right    { from { transform: translateX(0); } to { transform: translateX(100%); } }

	@keyframes drawer-slide-from-top    { from { transform: translateY(-100%); } to { transform: translateY(0); } }
	@keyframes drawer-slide-to-top      { from { transform: translateY(0); } to { transform: translateY(-100%); } }

	@keyframes drawer-slide-from-bottom { from { transform: translateY(100%); } to { transform: translateY(0); } }
	@keyframes drawer-slide-to-bottom   { from { transform: translateY(0); } to { transform: translateY(100%); } }
</style>
