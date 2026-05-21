<script lang="ts">
	import { fade, scale } from 'svelte/transition';
	import { expoOut } from 'svelte/easing';
	import {
		themeStore,
		THEME_STYLE_PRESETS,
		ACCENT_PRESETS,
		FONT_PRESETS,
	} from '../stores/theme.svelte';

	type Props = { open?: boolean };
	let { open = $bindable(false) }: Props = $props();

	function close() { open = false; }
	function onKeydown(e: KeyboardEvent) { if (e.key === 'Escape') close(); }
</script>

<svelte:window onkeydown={onKeydown} />

{#if open}
	<!-- svelte-ignore a11y_no_static_element_interactions a11y_click_events_have_key_events -->
	<div class="fixed inset-0 z-40 cursor-default" onclick={close} transition:fade={{ duration: 100 }}></div>

	<div
		class="settings-panel"
		transition:scale={{ duration: 180, start: 0.95, easing: expoOut }}
		style="transform-origin: top right"
	>
		<!-- Mode -->
		<div class="s-group">
			<p class="s-label">Mode</p>
			<div class="s-seg">
				{#each (['light','dark'] as const) as m}
					<button class="s-seg-btn" class:s-seg-on={themeStore.mode === m}
						onclick={() => themeStore.setMode(m)}>
						{m === 'light' ? '☀︎ Light' : '◐ Dark'}
					</button>
				{/each}
			</div>
		</div>

		<!-- Theme style -->
		<div class="s-group">
			<p class="s-label">Theme</p>
			<div class="s-themes">
				{#each THEME_STYLE_PRESETS as preset}
					<button
						class="s-theme-btn"
						class:s-theme-on={themeStore.styleId === preset.id}
						onclick={() => themeStore.setStyle(preset.id)}
					>
						<span class="s-swatch"
							style="background: linear-gradient(135deg, {preset.swatch.from}, {preset.swatch.to})"
						></span>
						<span class="s-theme-label">{preset.label}</span>
					</button>
				{/each}
			</div>
		</div>

		<!-- Accent -->
		<div class="s-group">
			<p class="s-label">Accent</p>
			<div class="s-dots">
				{#each ACCENT_PRESETS as preset}
					<button
						class="s-dot"
						class:s-dot-on={themeStore.accentId === preset.id}
						style="background:{preset.base}"
						title={preset.label}
						onclick={() => themeStore.setAccent(preset.id)}
					>
						{#if themeStore.accentId === preset.id}
							<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"
								stroke-linecap="round" style="width:55%;height:55%">
								<path d="M20 6L9 17l-5-5"/>
							</svg>
						{/if}
					</button>
				{/each}
			</div>
		</div>

		<!-- Font -->
		<div class="s-group">
			<p class="s-label">Font</p>
			<div class="s-font-list">
				{#each FONT_PRESETS as preset}
					<button
						class="s-font-btn"
						class:s-font-on={themeStore.fontId === preset.id}
						onclick={() => themeStore.setFont(preset.id)}
					>{preset.label}</button>
				{/each}
			</div>
		</div>
	</div>
{/if}

<style>
.settings-panel {
	position: fixed;
	right: 1rem;
	top: 3.75rem;
	z-index: 50;
	width: 20rem;
	background: var(--card);
	border: 1px solid var(--border);
	border-radius: 0.875rem;
	padding: 1.125rem;
	box-shadow: 0 24px 64px rgba(0,0,0,0.18);
	display: flex;
	flex-direction: column;
	gap: 1.125rem;
	max-height: calc(100vh - 5rem);
	overflow-y: auto;
	scrollbar-width: thin;
	scrollbar-color: var(--border) transparent;
}

.s-group { display: flex; flex-direction: column; gap: 0.5rem; }

.s-label {
	font-size: 0.625rem;
	font-weight: 700;
	text-transform: uppercase;
	letter-spacing: 0.1em;
	color: var(--muted-foreground);
	margin: 0;
}

/* ── Mode segmented ── */
.s-seg {
	display: flex; gap: 0.2rem;
	background: var(--muted); padding: 0.2rem; border-radius: 0.5rem;
}
.s-seg-btn {
	flex: 1; padding: 0.375rem; border-radius: 0.35rem;
	border: none; background: none;
	font-size: 0.8rem; font-weight: 500; color: var(--muted-foreground);
	cursor: pointer; transition: background 0.12s, color 0.12s;
}
.s-seg-on {
	background: var(--card); color: var(--foreground); font-weight: 600;
	box-shadow: 0 1px 4px rgba(0,0,0,0.08);
}

/* ── Theme swatches ── */
.s-themes {
	display: grid;
	grid-template-columns: repeat(6, 1fr);
	gap: 0.5rem;
}
.s-theme-btn {
	display: flex; flex-direction: column; align-items: center; gap: 0.4rem;
	padding: 0.5rem 0.25rem 0.4rem;
	border-radius: 0.625rem;
	border: none;
	background: none;
	cursor: pointer;
	transition: background 0.12s;
	position: relative;
}
.s-theme-btn:hover { background: var(--muted); }
.s-swatch {
	width: 2rem; height: 2rem;
	border-radius: 50%;
	flex-shrink: 0;
	transition: transform 0.15s;
}
.s-theme-btn:hover .s-swatch { transform: scale(1.08); }
.s-theme-on .s-swatch {
	transform: scale(1.1);
	box-shadow: 0 0 0 2.5px var(--background), 0 0 0 4.5px var(--foreground);
}
.s-theme-label {
	font-size: 0.6rem;
	color: var(--muted-foreground);
	white-space: nowrap;
	transition: color 0.12s;
}
.s-theme-on .s-theme-label { color: var(--foreground); font-weight: 600; }

/* ── Accent dots ── */
.s-dots { display: flex; flex-wrap: wrap; gap: 0.5rem; }
.s-dot {
	width: 1.75rem; height: 1.75rem;
	border-radius: 50%;
	border: none;
	cursor: pointer;
	display: flex; align-items: center; justify-content: center;
	transition: transform 0.15s;
	color: #fff;
	flex-shrink: 0;
}
.s-dot:hover  { transform: scale(1.15); }
.s-dot-on {
	transform: scale(1.18);
	outline: 2.5px solid var(--foreground);
	outline-offset: 2.5px;
}

/* ── Font list ── */
.s-font-list {
	display: flex;
	flex-wrap: wrap;
	gap: 0;
}
.s-font-btn {
	padding: 0.3rem 0.5rem;
	border: none;
	background: none;
	font-size: 0.8rem;
	font-weight: 450;
	color: var(--muted-foreground);
	cursor: pointer;
	border-bottom: 2px solid transparent;
	transition: color 0.12s, border-color 0.12s;
	white-space: nowrap;
}
.s-font-btn:hover { color: var(--foreground); }
.s-font-on {
	color: var(--foreground);
	font-weight: 600;
	border-bottom-color: var(--accent);
}
</style>
