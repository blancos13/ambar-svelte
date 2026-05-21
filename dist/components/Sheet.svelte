<script lang="ts">
	import { onMount } from 'svelte';
	import type { Snippet } from 'svelte';

	type Size = 'sm' | 'md' | 'lg' | 'full';

	type Props = {
		open:      boolean;
		onClose:   () => void;
		title?:    string;
		size?:     Size;
		children:  Snippet;
		footer?:   Snippet;
	};

	let { open, onClose, title, size = 'md', children, footer }: Props = $props();

	const heightMap: Record<Size, string> = {
		sm:   '38vh',
		md:   '56vh',
		lg:   '78vh',
		full: '96vh',
	};

	let portalEl: HTMLDivElement | undefined = $state();
	let mounted  = $state(false);
	let visible  = $state(false);
	let closing  = $state(false);

	/* drag state */
	let dragY     = $state(0);   // current drag offset (px, downward positive)
	let dragging  = false;
	let startY    = 0;
	const DISMISS = 110;         // drag threshold to dismiss

	const closeDur = 300;

	onMount(() => { mounted = true; });

	$effect(() => {
		if (portalEl && mounted && portalEl.parentElement !== document.body) {
			document.body.appendChild(portalEl);
		}
	});

	$effect(() => {
		return () => {
			if (portalEl?.parentElement === document.body) document.body.removeChild(portalEl);
			document.body.style.overflow = '';
		};
	});

	$effect(() => {
		if (open && mounted) {
			closing = false;
			dragY   = 0;
			visible = true;
			const sw = window.innerWidth - document.documentElement.clientWidth;
			document.body.style.overflow = 'hidden';
			if (sw > 0) document.body.style.paddingRight = `${sw}px`;
		}
	});

	function close() {
		closing = true;
		document.body.style.overflow = '';
		document.body.style.paddingRight = '';
		setTimeout(() => { visible = false; closing = false; dragY = 0; onClose(); }, closeDur);
	}

	function onKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape' && visible) close();
	}

	/* drag handle interaction */
	function onDragStart(e: MouseEvent | TouchEvent) {
		dragging = true;
		startY   = 'touches' in e ? e.touches[0].clientY : e.clientY;
	}

	function onDragMove(e: MouseEvent | TouchEvent) {
		if (!dragging) return;
		const y = 'touches' in e ? e.touches[0].clientY : e.clientY;
		dragY = Math.max(0, y - startY);
	}

	function onDragEnd() {
		if (!dragging) return;
		dragging = false;
		if (dragY >= DISMISS) {
			close();
		} else {
			dragY = 0; // snap back
		}
	}

	/* opacity of backdrop reduces as you drag */
	const backdropOpacity = $derived(Math.max(0, 1 - dragY / 300));
</script>

<svelte:window onkeydown={onKeydown} />

<div bind:this={portalEl} style="display: contents;">
	{#if visible}
		<!-- backdrop -->
		<!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
		<div
			class="sheet-backdrop"
			style:opacity={closing ? 0 : backdropOpacity}
			onclick={close}
		></div>

		<!-- panel -->
		<div
			class="sheet-panel"
			class:sheet-open={!closing}
			class:sheet-close={closing}
			style:height={heightMap[size]}
			style:transform="translateY({dragY}px)"
			style:transition={dragging ? 'none' : undefined}
		>
			<!-- drag handle -->
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div
				class="sheet-handle-area"
				onmousedown={onDragStart}
				onmousemove={onDragMove}
				onmouseup={onDragEnd}
				onmouseleave={onDragEnd}
				ontouchstart={onDragStart}
				ontouchmove={onDragMove}
				ontouchend={onDragEnd}
			>
				<div class="sheet-handle"></div>
			</div>

			<!-- header -->
			{#if title}
				<div class="sheet-header">
					<h2 class="sheet-title">{title}</h2>
					<button class="sheet-close-btn" onclick={close} aria-label="Close">
						<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
							<path d="M18 6 6 18M6 6l12 12"/>
						</svg>
					</button>
				</div>
			{/if}

			<!-- body -->
			<div class="sheet-body">
				{@render children()}
			</div>

			<!-- footer -->
			{#if footer}
				<div class="sheet-footer">
					{@render footer()}
				</div>
			{/if}
		</div>
	{/if}
</div>

<style>
	.sheet-backdrop {
		position: fixed;
		inset: 0;
		background: rgba(0,0,0,0.5);
		z-index: 49;
		transition: opacity 0.3s ease;
	}

	.sheet-panel {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		z-index: 50;
		background: var(--card);
		border-top: 1px solid var(--border);
		border-radius: 20px 20px 0 0;
		display: flex;
		flex-direction: column;
		overflow: hidden;
		transition: transform 0.3s cubic-bezier(0.32, 0.72, 0, 1);
		will-change: transform;
	}

	.sheet-open {
		animation: sheetSlideUp 0.35s cubic-bezier(0.32, 0.72, 0, 1) forwards;
	}
	.sheet-close {
		animation: sheetSlideDown 0.3s cubic-bezier(0.4, 0, 1, 1) forwards;
	}

	@keyframes sheetSlideUp {
		from { transform: translateY(100%); }
		to   { transform: translateY(0);    }
	}
	@keyframes sheetSlideDown {
		from { transform: translateY(0);    }
		to   { transform: translateY(100%); }
	}

	.sheet-handle-area {
		padding: 12px 0 6px;
		display: flex;
		justify-content: center;
		cursor: grab;
		flex-shrink: 0;
	}
	.sheet-handle-area:active { cursor: grabbing; }

	.sheet-handle {
		width: 36px;
		height: 4px;
		border-radius: 99px;
		background: var(--border);
	}

	.sheet-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 4px 20px 12px;
		border-bottom: 1px solid var(--border);
		flex-shrink: 0;
	}

	.sheet-title {
		font-size: 1rem;
		font-weight: 600;
		color: var(--foreground);
	}

	.sheet-close-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 28px;
		height: 28px;
		border-radius: 8px;
		color: var(--muted-foreground);
		transition: background 0.15s, color 0.15s;
	}
	.sheet-close-btn:hover {
		background: var(--muted);
		color: var(--foreground);
	}

	.sheet-body {
		flex: 1;
		overflow-y: auto;
		padding: 20px;
	}

	.sheet-footer {
		padding: 12px 20px 20px;
		border-top: 1px solid var(--border);
		flex-shrink: 0;
	}
</style>
