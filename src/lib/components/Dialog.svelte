<script lang="ts">
	import { onMount } from 'svelte';
	import type { Snippet } from 'svelte';

	export type Variant =
		| 'center' | 'bottom-sheet' | 'shrink' | 'fullscreen' | 'alert' | 'dropdown'
		| 'elastic' | 'flip' | 'rotate' | 'zoom'
		| 'slide-left' | 'slide-right' | 'fade-up'
		| 'newspaper' | 'swing' | 'morph';

	type Props = {
		open: boolean;
		onClose: () => void;
		children: Snippet;
		variant?: Variant;
	};

	let { open, onClose, children, variant = 'center' }: Props = $props();

	let portalEl: HTMLDivElement | undefined = $state();
	let mounted = $state(false);
	let visible = $state(false);
	let closing = $state(false);

	/* Which variants use center positioning */
	const centerVariants = new Set([
		'center', 'alert', 'elastic', 'flip', 'rotate', 'zoom',
		'slide-left', 'slide-right', 'fade-up', 'newspaper', 'blur-in', 'swing', 'morph'
	]);
	const bottomVariants = new Set(['bottom-sheet', 'shrink']);
	const topVariants = new Set(['dropdown']);

	/* Animation class mapping */
	const animMap: Record<string, string> = {
		'center': 'dialog-anim-scale',
		'alert': 'dialog-anim-bounce',
		'dropdown': 'dialog-anim-from-top',
		'bottom-sheet': 'dialog-anim-slide-up',
		'shrink': 'dialog-anim-slide-up',
		'fullscreen': 'dialog-anim-fullscreen',
		'elastic': 'dialog-anim-elastic',
		'flip': 'dialog-anim-flip',
		'rotate': 'dialog-anim-rotate',
		'zoom': 'dialog-anim-zoom',
		'slide-left': 'dialog-anim-slide-left',
		'slide-right': 'dialog-anim-slide-right',
		'fade-up': 'dialog-anim-fade-up',
		'newspaper': 'dialog-anim-newspaper',
		'swing': 'dialog-anim-swing',
		'morph': 'dialog-anim-morph',
	};

	/* Close duration mapping */
	const closeDurMap: Record<string, number> = {
		'shrink': 350, 'fullscreen': 300, 'newspaper': 350, 'elastic': 280,
	};

	onMount(() => { mounted = true; });

	function onKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape' && visible) handleClose();
	}

	$effect(() => {
		if (portalEl && mounted && portalEl.parentElement !== document.body) {
			document.body.appendChild(portalEl);
		}
	});

	$effect(() => {
		if (open && mounted) {
			closing = false;
			visible = true;
			// Compensate for scrollbar disappearing so page doesn't shift
			const sw = window.innerWidth - document.documentElement.clientWidth;
			document.body.style.overflow = 'hidden';
			if (sw > 0) document.body.style.paddingRight = `${sw}px`;
		}
	});

	$effect(() => {
		const wrapper = document.getElementById('app-content');
		if (!wrapper) return;
		if (visible && !closing && variant === 'shrink') {
			wrapper.classList.add('dialog-shrink-active');
		} else {
			wrapper.classList.remove('dialog-shrink-active');
		}
	});

	$effect(() => {
		return () => {
			if (portalEl && portalEl.parentElement === document.body) {
				document.body.removeChild(portalEl);
			}
			document.body.style.overflow = '';
			document.body.style.paddingRight = '';
			document.getElementById('app-content')?.classList.remove('dialog-shrink-active');
		};
	});

	function handleClose() {
		closing = true;
		document.body.style.overflow = '';
		document.body.style.paddingRight = '';
		const dur = closeDurMap[variant] ?? 220;
		setTimeout(() => {
			visible = false;
			closing = false;
			onClose();
		}, dur);
	}
</script>

<svelte:window onkeydown={onKeydown} />

<div bind:this={portalEl} style="display: contents;">
{#if visible}
	<div
		class="dialog-root"
		class:dialog-closing={closing}
		data-variant={variant}
		role="dialog"
		aria-modal="true"
	>
		<!-- Backdrop (all except fullscreen) -->
		{#if variant !== 'fullscreen'}
			<button
				class="dialog-backdrop"
				aria-label="Close"
				onclick={handleClose}
			></button>
		{/if}

		<!-- FULLSCREEN -->
		{#if variant === 'fullscreen'}
			<div class="dialog-panel dialog-panel-fullscreen dialog-anim-fullscreen">
				<div class="dialog-fs-header">
					<button class="btn-ghost" onclick={handleClose}>
						<svg class="size-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12"/></svg>
					</button>
					<span class="dialog-fs-title">Details</span>
					<div style="width:2.5rem"></div>
				</div>
				<div class="dialog-fs-body">
					{@render children()}
				</div>
			</div>

		<!-- BOTTOM variants (bottom-sheet, shrink) -->
		{:else if bottomVariants.has(variant)}
			<div class="dialog-positioner dialog-pos-bottom">
				<div
					class="dialog-panel {variant === 'shrink' ? 'dialog-panel-shrink' : 'dialog-panel-sheet'} {animMap[variant]}"
				>
					<div class="dialog-handle"></div>
					{@render children()}
				</div>
			</div>

		<!-- TOP variant (dropdown) -->
		{:else if topVariants.has(variant)}
			<div class="dialog-positioner dialog-pos-top">
				<div class="dialog-panel dialog-panel-dropdown {animMap[variant]}">
					{@render children()}
				</div>
			</div>

		<!-- CENTER variants (all others) -->
		{:else}
			<div class="dialog-positioner dialog-pos-center">
				<div class="dialog-panel {variant === 'alert' ? 'dialog-panel-alert' : ''} {animMap[variant] ?? 'dialog-anim-scale'}">
					{@render children()}
				</div>
			</div>
		{/if}
	</div>
{/if}
</div>

<style>
	.dialog-root {
		position: fixed;
		inset: 0;
		z-index: 9999;
	}

	/* ── Backdrop ── */
	.dialog-backdrop {
		position: fixed;
		inset: 0;
		border: none;
		cursor: default;
		background: rgba(0, 0, 0, 0.55);
		animation: dialog-fade-in 0.25s ease-out forwards;
	}
	[data-variant="shrink"] > .dialog-backdrop { background: rgba(0, 0, 0, 0.85); }
	[data-variant="dropdown"] > .dialog-backdrop { background: rgba(0, 0, 0, 0.35); }
	.dialog-closing .dialog-backdrop {
		animation: dialog-fade-out 0.22s ease-in forwards;
	}

	/* ── Positioner ── */
	.dialog-positioner {
		position: fixed;
		inset: 0;
		z-index: 1;
		display: flex;
		pointer-events: none;
	}
	.dialog-pos-center { align-items: center; justify-content: center; padding: 1rem; }
	.dialog-pos-bottom { align-items: flex-end; justify-content: center; }
	.dialog-pos-top { align-items: flex-start; justify-content: center; padding-top: 5rem; }

	/* ── Panel ── */
	.dialog-panel {
		pointer-events: auto;
		background: var(--card);
		color: var(--card-foreground);
		box-shadow: 0 25px 60px -12px rgba(0, 0, 0, 0.45);
		width: 100%;
		max-width: 28rem;
		border-radius: 1rem;
		padding: 1.5rem;
	}
	.dialog-panel-sheet {
		max-width: 32rem; max-height: 85vh; overflow-y: auto;
		border-radius: 1.5rem 1.5rem 0 0;
	}
	.dialog-panel-shrink {
		max-width: 100%; max-height: 75vh; overflow-y: auto;
		border-radius: 1.5rem 1.5rem 0 0; padding-bottom: 2rem;
	}
	.dialog-panel-alert {
		max-width: 20rem; text-align: center; padding: 1.25rem;
	}
	.dialog-panel-dropdown { max-width: 24rem; }
	.dialog-panel-fullscreen {
		position: fixed; inset: 0; z-index: 1;
		max-width: none; border-radius: 0; padding: 0;
		display: flex; flex-direction: column;
		background: var(--card); color: var(--foreground); pointer-events: auto;
	}
	.dialog-fs-header {
		display: flex; align-items: center; justify-content: space-between;
		border-bottom: 1px solid var(--border); padding: 0.75rem 1rem;
	}
	.dialog-fs-title { font-size: 0.875rem; font-weight: 600; }
	.dialog-fs-body { flex: 1; overflow-y: auto; padding: 1.5rem; }
	.dialog-handle {
		width: 2.5rem; height: 0.25rem; border-radius: 9999px;
		background: var(--muted-foreground); opacity: 0.3; margin: 0 auto 1rem;
	}

	/* ═══════════════════════════════════════
	   OPEN animations
	   ═══════════════════════════════════════ */
	.dialog-anim-scale     { animation: dialog-scale-in 0.28s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
	.dialog-anim-slide-up  { animation: dialog-slide-up 0.38s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
	.dialog-anim-bounce    { animation: dialog-bounce-in 0.4s ease-out forwards; }
	.dialog-anim-from-top  { animation: dialog-slide-from-top 0.32s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
	.dialog-anim-fullscreen{ animation: dialog-fullscreen-in 0.38s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
	.dialog-anim-elastic   { animation: dialog-elastic-in 0.55s ease-out forwards; }
	.dialog-anim-flip      { animation: dialog-flip-in 0.45s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
	.dialog-anim-rotate    { animation: dialog-rotate-in 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
	.dialog-anim-zoom      { animation: dialog-zoom-in 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
	.dialog-anim-slide-left  { animation: dialog-slide-left-in 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
	.dialog-anim-slide-right { animation: dialog-slide-right-in 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
	.dialog-anim-fade-up   { animation: dialog-fade-up-in 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
	.dialog-anim-newspaper { animation: dialog-newspaper-in 0.6s ease-out forwards; }
	.dialog-anim-swing     { animation: dialog-swing-in 0.55s ease-out forwards; }
	.dialog-anim-morph     { animation: dialog-morph-in 0.45s cubic-bezier(0.16, 1, 0.3, 1) forwards; }

	/* ═══════════════════════════════════════
	   CLOSE animations
	   ═══════════════════════════════════════ */
	.dialog-closing .dialog-anim-scale      { animation: dialog-scale-out 0.2s ease-in forwards; }
	.dialog-closing .dialog-anim-slide-up   { animation: dialog-slide-down 0.3s ease-in forwards; }
	.dialog-closing .dialog-anim-bounce     { animation: dialog-scale-out 0.18s ease-in forwards; }
	.dialog-closing .dialog-anim-from-top   { animation: dialog-scale-out 0.2s ease-in forwards; }
	.dialog-closing .dialog-anim-fullscreen { animation: dialog-slide-down 0.3s ease-in forwards; }
	.dialog-closing .dialog-anim-elastic    { animation: dialog-elastic-out 0.25s ease-in forwards; }
	.dialog-closing .dialog-anim-flip       { animation: dialog-flip-out 0.3s ease-in forwards; }
	.dialog-closing .dialog-anim-rotate     { animation: dialog-rotate-out 0.25s ease-in forwards; }
	.dialog-closing .dialog-anim-zoom       { animation: dialog-zoom-out 0.3s ease-in forwards; }
	.dialog-closing .dialog-anim-slide-left { animation: dialog-slide-left-out 0.25s ease-in forwards; }
	.dialog-closing .dialog-anim-slide-right{ animation: dialog-slide-right-out 0.25s ease-in forwards; }
	.dialog-closing .dialog-anim-fade-up    { animation: dialog-fade-up-out 0.25s ease-in forwards; }
	.dialog-closing .dialog-anim-newspaper  { animation: dialog-newspaper-out 0.35s ease-in forwards; }
	.dialog-closing .dialog-anim-swing      { animation: dialog-swing-out 0.25s ease-in forwards; }
	.dialog-closing .dialog-anim-morph      { animation: dialog-morph-out 0.3s ease-in forwards; }
</style>
