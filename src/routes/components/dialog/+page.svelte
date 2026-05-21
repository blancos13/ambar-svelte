<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Dialog, { type Variant } from '$lib/components/Dialog.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import PropsTable from '$lib/components/PropsTable.svelte';
	import { toastStore } from '$lib/stores/toast.svelte';

	/* Each variant gets its own open state */
	let opens: Record<string, boolean> = $state({});

	function toggle(v: string) { opens[v] = !opens[v]; }
	function close(v: string) { opens[v] = false; }

	const animations: { key: Variant; label: string; desc: string }[] = [
		{ key: 'center',       label: 'Center Scale',    desc: 'Scales from center'        },
		{ key: 'elastic',      label: 'Elastic',         desc: 'Spring overshoot'           },
		{ key: 'flip',         label: '3D Flip',         desc: 'Rotates on Y-axis'          },
		{ key: 'rotate',       label: 'Rotate',          desc: 'Enters with slight rotation' },
		{ key: 'zoom',         label: 'Zoom + Blur',     desc: 'Grows from tiny, blur opens' },
		{ key: 'slide-left',   label: 'Slide Left',      desc: 'Slides in from the left'    },
		{ key: 'slide-right',  label: 'Slide Right',     desc: 'Slides in from the right'   },
		{ key: 'fade-up',      label: 'Fade Up',         desc: 'Floats up from below'       },
		{ key: 'newspaper',    label: 'Newspaper',       desc: 'Grows with 720° rotation'   },
		{ key: 'swing',        label: 'Swing',           desc: 'Swings like a pendulum'     },
		{ key: 'morph',        label: 'Morph',           desc: 'Clip-path circle expands'   },
		{ key: 'alert',        label: 'Alert Bounce',    desc: 'Small box, aggressive bounce'},
		{ key: 'bottom-sheet', label: 'Bottom Sheet',    desc: 'Slides up from the bottom'  },
		{ key: 'shrink',       label: 'Shrink',          desc: 'Page shrinks + bottom sheet' },
		{ key: 'dropdown',     label: 'Dropdown',        desc: 'Drops from the top'         },
	];

	/* Use-case states */
	let confirmOpen    = $state(false);
	let formOpen       = $state(false);
	let fullscreenOpen = $state(false);

	const importCode = `import Dialog from '$lib/components/Dialog.svelte';`;

	const usageCode = `<script lang="ts">
  let open = $state(false);
<\/script>

<Button onclick={() => (open = true)}>Open Dialog</Button>

<Dialog {open} onClose={() => (open = false)} variant="elastic">
  <h3>Dialog Title</h3>
  <p>Dialog content goes here.</p>
  <div>
    <Button onclick={() => (open = false)}>Close</Button>
  </div>
</Dialog>`;

	const props = [
		{ name: 'open',     type: 'boolean',                                  default: '—',        description: 'Controls whether the dialog is visible.' },
		{ name: 'onClose',  type: '() => void',                               default: '—',        description: 'Callback fired when the backdrop is clicked or Escape is pressed.' },
		{ name: 'variant',  type: 'Variant',                                  default: "'center'", description: 'Animation variant. One of: center, elastic, flip, rotate, zoom, slide-left, slide-right, fade-up, newspaper, swing, morph, alert, bottom-sheet, shrink, dropdown, fullscreen.' },
		{ name: 'children', type: 'Snippet',                                  default: '—',        description: 'Content rendered inside the dialog panel.' },
	];
</script>

<div class="comp-header">
	<div class="comp-header-top">
		<h1 class="comp-title">Dialog</h1>
		<span class="comp-badge">Overlay</span>
	</div>
	<p class="comp-desc">Modal dialog with 15 animation variants. Portal-based, accessible, and keyboard-dismissible.</p>
</div>

<section class="doc-section">
	<h2 class="doc-section-title">Import</h2>
	<CodeBlock code={importCode} lang="ts" />
</section>

<section class="doc-section">
	<h2 class="doc-section-title">Usage</h2>
	<CodeBlock code={usageCode} lang="svelte" />
</section>

<section class="doc-section">
	<h2 class="doc-section-title">Animations</h2>
	<p class="doc-section-desc">Each button opens a dialog with a different entrance animation. Try them all.</p>
	<div class="preview-box preview-box-accent">
		{#each animations as anim}
			<Button onclick={() => toggle(anim.key)}>
				{anim.label}
			</Button>
		{/each}
	</div>
</section>

<section class="doc-section">
	<h2 class="doc-section-title">Use Cases</h2>
	<p class="doc-section-desc">Real-world dialog patterns: confirmation, form, and fullscreen.</p>
	<div class="preview-box">
		<Button variant="danger" onclick={() => (confirmOpen = true)}>Delete Account</Button>
		<Button variant="secondary" onclick={() => (formOpen = true)}>Create Project</Button>
		<Button variant="outline" onclick={() => (fullscreenOpen = true)}>Fullscreen</Button>
	</div>
</section>

<section class="doc-section">
	<h2 class="doc-section-title">API Reference</h2>
	<PropsTable {props} />
</section>

<!-- ════════════════════════════════════════════════════
     ANIMATION DIALOGS — each with same demo content
     ════════════════════════════════════════════════════ -->
{#each animations as anim}
	<Dialog open={opens[anim.key] ?? false} onClose={() => close(anim.key)} variant={anim.key}>
		<h3 class="text-xl font-bold text-card-foreground">{anim.label}</h3>
		<p class="mt-2 text-sm text-muted-foreground">{anim.desc}</p>
		<p class="mt-3 text-sm text-muted-foreground">
			This dialog opened with the <span class="font-semibold text-foreground">{anim.key}</span> animation.
			Click the backdrop or press Escape to close.
		</p>
		<div class="mt-5 flex justify-end gap-2">
			<Button variant="ghost" onclick={() => close(anim.key)}>Cancel</Button>
			<Button onclick={() => { close(anim.key); toastStore.show(`${anim.label} closed`, 'success'); }}>
				Got it
			</Button>
		</div>
	</Dialog>
{/each}

<!-- CONFIRM (alert variant) -->
<Dialog open={confirmOpen} onClose={() => (confirmOpen = false)} variant="elastic">
	<div class="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-destructive/20">
		<svg class="size-6 text-destructive" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
			<path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"/>
		</svg>
	</div>
	<h3 class="text-center text-lg font-bold text-card-foreground">Delete Account?</h3>
	<p class="mt-1 text-center text-sm text-muted-foreground">This action cannot be undone. All your data will be deleted.</p>
	<div class="mt-4 flex gap-2">
		<Button variant="secondary" class="flex-1" onclick={() => (confirmOpen = false)}>Cancel</Button>
		<Button variant="danger" class="flex-1" onclick={() => { confirmOpen = false; toastStore.show('Account deleted', 'error'); }}>Delete</Button>
	</div>
</Dialog>

<!-- FORM (bottom sheet) -->
<Dialog open={formOpen} onClose={() => (formOpen = false)} variant="bottom-sheet">
	<h3 class="text-xl font-bold text-card-foreground">Create Project</h3>
	<form class="mt-4 space-y-3" onsubmit={(e) => { e.preventDefault(); formOpen = false; toastStore.show('Project created!', 'success'); }}>
		<div>
			<label for="name" class="mb-1 block text-sm font-medium text-foreground">Name</label>
			<input id="name" type="text" placeholder="My project"
				class="w-full rounded-xl bg-muted px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
			/>
		</div>
		<div>
			<label for="desc" class="mb-1 block text-sm font-medium text-foreground">Description</label>
			<textarea id="desc" rows="3" placeholder="Optional"
				class="w-full resize-none rounded-xl bg-muted px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
			></textarea>
		</div>
		<div class="flex gap-2 pt-2">
			<Button type="button" variant="secondary" class="flex-1" onclick={() => (formOpen = false)}>Cancel</Button>
			<Button type="submit" class="flex-1">Create</Button>
		</div>
	</form>
</Dialog>

<!-- FULLSCREEN -->
<Dialog open={fullscreenOpen} onClose={() => (fullscreenOpen = false)} variant="fullscreen">
	<h3 class="text-2xl font-bold text-foreground">Product Details</h3>
	<div class="mt-6 space-y-4">
		<div class="aspect-video w-full rounded-xl bg-muted"></div>
		<p class="text-muted-foreground">
			Fullscreen dialog — slides up from the bottom, covers the entire screen.
		</p>
		<div class="flex gap-3">
			<Button class="flex-1" onclick={() => { fullscreenOpen = false; toastStore.show('Purchased!', 'success'); }}>Buy Now</Button>
			<Button variant="outline" class="flex-1" onclick={() => (fullscreenOpen = false)}>Cancel</Button>
		</div>
	</div>
</Dialog>

<style>
	.comp-header { margin-bottom: 2.5rem; padding-bottom: 1.5rem; border-bottom: 1px solid var(--border); }
	.comp-header-top { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.5rem; }
	.comp-title { font-size: 1.875rem; font-weight: 800; letter-spacing: -0.025em; color: var(--foreground); }
	.comp-badge { font-size: 0.65rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; background: color-mix(in srgb, var(--accent) 15%, transparent); color: var(--accent); border: 1px solid color-mix(in srgb, var(--accent) 30%, transparent); padding: 0.15rem 0.5rem; border-radius: 9999px; }
	.comp-desc { color: var(--muted-foreground); font-size: 0.9375rem; line-height: 1.6; margin-bottom: 1rem; }
	.doc-section { margin-bottom: 2.5rem; display: flex; flex-direction: column; gap: 1rem; }
	.doc-section-title { font-size: 1.125rem; font-weight: 700; color: var(--foreground); letter-spacing: -0.01em; }
	.doc-section-desc { font-size: 0.875rem; color: var(--muted-foreground); margin-top: -0.5rem; }
	.doc-section-desc code { font-family: ui-monospace, monospace; font-size: 0.8em; background: var(--muted); padding: 0.1rem 0.35rem; border-radius: 0.25rem; color: var(--accent); }
	.preview-box { padding: 2rem; border: 1px solid var(--border); border-radius: 0.875rem; background: var(--card); display: flex; align-items: center; justify-content: center; min-height: 6rem; flex-wrap: wrap; gap: 0.75rem; }
	.preview-box-accent { background: radial-gradient(ellipse 80% 60% at 50% 0%, color-mix(in srgb, var(--accent) 8%, transparent), transparent); }
</style>
