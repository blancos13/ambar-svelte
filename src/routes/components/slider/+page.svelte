<script lang="ts">
	import Slider from '$lib/components/Slider.svelte';
	import Button from '$lib/components/Button.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import PropsTable from '$lib/components/PropsTable.svelte';

	type Anim = 'none' | 'smooth' | 'spring' | 'elastic' | 'bounce' | 'snappy';

	let v = $state({
		basic: 40, volume: 72, step: 25, decimal: 3.5,
		brightness: 80, contrast: 50, saturation: 60, speed: 1,
		anim: 50,
	});

	let playAnim = $state<Anim>('none');

	const anims: { value: Anim; label: string; desc: string }[] = [
		{ value: 'none',    label: 'None',    desc: 'Instant'         },
		{ value: 'smooth',  label: 'Smooth',  desc: 'Smooth'          },
		{ value: 'snappy',  label: 'Snappy',  desc: 'Fast & sharp'    },
		{ value: 'spring',  label: 'Spring',  desc: 'Slight overshoot'},
		{ value: 'elastic', label: 'Elastic', desc: 'Bounces back'    },
		{ value: 'bounce',  label: 'Bounce',  desc: 'Hard bounce'     },
	];

	const importCode = `import Slider from '$lib/components/Slider.svelte';`;

	const usageCode = `<script lang="ts">
  let volume = $state(50);
<\/script>

<Slider bind:value={volume} label="Volume" />`;

	const stepsCode = `<Slider bind:value={step} label="Step 25" min={0} max={100} step={25} />
<Slider bind:value={decimal} label="Decimal" min={0} max={10} step={0.1} />
<Slider bind:value={speed} label="Speed" min={0.5} max={3} step={0.5} hint="0.5x — 3x" />`;

	const animCode = `<!-- Release the thumb to see overshoot/bounce behavior -->
<Slider bind:value animation="spring" />
<Slider bind:value animation="elastic" />
<Slider bind:value animation="bounce" />`;

	const onchangeCode = `<Slider
  bind:value={volume}
  label="Volume"
  onchange={(v) => console.log('new value:', v)}
/>`;

	const disabledCode = `<Slider value={65} label="Disabled" disabled />`;

	const props = [
		{ name: 'value',     type: 'number',                                                                   default: '0',          description: "Current value. Supports $bindable — use bind:value for two-way binding." },
		{ name: 'min',       type: 'number',                                                                   default: '0',          description: "Minimum value of the range." },
		{ name: 'max',       type: 'number',                                                                   default: '100',        description: "Maximum value of the range." },
		{ name: 'step',      type: 'number',                                                                   default: '1',          description: "Increment step. Supports decimals." },
		{ name: 'label',     type: 'string',                                                                   default: '—',          description: "Label displayed above the slider track." },
		{ name: 'hint',      type: 'string',                                                                   default: '—',          description: "Helper text shown below the slider track." },
		{ name: 'showValue', type: 'boolean',                                                                  default: 'true',       description: "Whether to display the current numeric value next to the label." },
		{ name: 'disabled',  type: 'boolean',                                                                  default: 'false',      description: "Disables all interaction and applies reduced opacity." },
		{ name: 'animation', type: "'none' | 'smooth' | 'spring' | 'elastic' | 'bounce' | 'snappy'",         default: "'none'",     description: "Easing animation applied to the fill track and thumb after releasing drag." },
		{ name: 'onchange',  type: '(v: number) => void',                                                     default: '—',          description: "Callback fired whenever the value changes." },
	];
</script>

<div class="comp-header">
	<div class="comp-header-top">
		<h1 class="comp-title">Slider</h1>
		<span class="comp-badge">Form</span>
	</div>
	<p class="comp-desc">Range input with a draggable thumb, value tooltip, step support, keyboard navigation, and six track animation styles.</p>
</div>

<section class="doc-section">
	<h2 class="doc-section-title">Import</h2>
	<CodeBlock code={importCode} lang="ts" />
</section>

<section class="doc-section">
	<h2 class="doc-section-title">Usage</h2>
	<div class="preview-box">
		<div style="width:100%; max-width:24rem; display:flex; flex-direction:column; gap:1.5rem;">
			<Slider bind:value={v.basic} label="Basic" />
			<Slider bind:value={v.volume} label="Volume" hint="0 — 100" />
			<Slider bind:value={v.basic} label="Hidden value" showValue={false} />
		</div>
	</div>
	<CodeBlock code={usageCode} lang="svelte" />
</section>

<section class="doc-section">
	<h2 class="doc-section-title">Steps & Range</h2>
	<p class="doc-section-desc">Control snapping granularity with <code>step</code>. Supports integers and decimals. Use <code>min</code> / <code>max</code> to set the range.</p>
	<div class="preview-box">
		<div style="width:100%; max-width:24rem; display:flex; flex-direction:column; gap:1.5rem;">
			<Slider bind:value={v.step}    label="Step 25"  min={0}   max={100} step={25} />
			<Slider bind:value={v.decimal} label="Decimal"  min={0}   max={10}  step={0.1} />
			<Slider bind:value={v.speed}   label="Speed"    min={0.5} max={3}   step={0.5} hint="0.5x — 3x" />
		</div>
	</div>
	<CodeBlock code={stepsCode} lang="svelte" />
</section>

<section class="doc-section">
	<h2 class="doc-section-title">Animations</h2>
	<p class="doc-section-desc">Drag the slider to one side and release to see the easing style. <code>spring</code>, <code>elastic</code>, and <code>bounce</code> produce visible overshoot effects.</p>
	<div class="preview-box preview-box-accent" style="flex-direction:column; align-items:stretch;">
		<div style="width:100%; max-width:28rem; margin:0 auto; display:flex; flex-direction:column; gap:1.25rem;">
			<Slider bind:value={v.anim} label={playAnim} animation={playAnim} />
			<div style="display:flex; flex-wrap:wrap; gap:0.5rem; border-top:1px solid var(--border); padding-top:1.25rem;">
				{#each anims as a}
					<button
						type="button"
						class="anim-btn {playAnim === a.value ? 'anim-btn-active' : ''}"
						onclick={() => (playAnim = a.value)}
					>
						<span class="anim-btn-label">{a.label}</span>
						<span class="anim-btn-desc">{a.desc}</span>
					</button>
				{/each}
			</div>
		</div>
	</div>
	<CodeBlock code={animCode} lang="svelte" />
</section>

<section class="doc-section">
	<h2 class="doc-section-title">Disabled</h2>
	<p class="doc-section-desc">Pass <code>disabled</code> to disable all pointer and keyboard interaction.</p>
	<div class="preview-box">
		<div style="width:100%; max-width:24rem;">
			<Slider value={65} label="Disabled" disabled />
		</div>
	</div>
	<CodeBlock code={disabledCode} lang="svelte" />
</section>

<section class="doc-section">
	<h2 class="doc-section-title">onChange Callback</h2>
	<p class="doc-section-desc">Use <code>onchange</code> to react to value changes without two-way binding.</p>
	<CodeBlock code={onchangeCode} lang="svelte" />
</section>

<section class="doc-section">
	<h2 class="doc-section-title">Example — Image Settings</h2>
	<p class="doc-section-desc">A realistic use case with multiple sliders and action buttons.</p>
	<div class="preview-box">
		<div style="width:100%; max-width:22rem; display:flex; flex-direction:column; gap:1.25rem; padding:1.5rem; border:1px solid var(--border); border-radius:1rem; background:var(--card);">
			<span style="font-weight:600; color:var(--foreground);">Image Settings</span>
			<Slider bind:value={v.brightness} label="Brightness" min={0} max={200} />
			<Slider bind:value={v.contrast}   label="Contrast"   min={0} max={200} />
			<Slider bind:value={v.saturation} label="Saturation" min={0} max={200} />
			<div style="display:flex; gap:0.5rem; padding-top:0.25rem;">
				<Button class="flex-1"
					onclick={() => { v.brightness = 80; v.contrast = 50; v.saturation = 60; }}>
					Apply
				</Button>
				<Button variant="secondary"
					onclick={() => { v.brightness = 100; v.contrast = 100; v.saturation = 100; }}>
					Reset
				</Button>
			</div>
		</div>
	</div>
</section>

<section class="doc-section">
	<h2 class="doc-section-title">Keyboard Navigation</h2>
	<p class="doc-section-desc">The slider track is fully keyboard accessible. Focus it and use the keys below.</p>
	<div class="kbd-table">
		<div class="kbd-row"><kbd>→</kbd> / <kbd>↑</kbd><span>Increment by one step</span></div>
		<div class="kbd-row"><kbd>←</kbd> / <kbd>↓</kbd><span>Decrement by one step</span></div>
		<div class="kbd-row"><kbd>Page Up</kbd><span>Increment by 10% of range</span></div>
		<div class="kbd-row"><kbd>Page Down</kbd><span>Decrement by 10% of range</span></div>
		<div class="kbd-row"><kbd>Home</kbd><span>Jump to minimum</span></div>
		<div class="kbd-row"><kbd>End</kbd><span>Jump to maximum</span></div>
	</div>
</section>

<section class="doc-section">
	<h2 class="doc-section-title">API Reference</h2>
	<PropsTable {props} />
</section>

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
	.anim-btn { border-radius: 0.75rem; padding: 0.5rem 1rem; font-size: 0.875rem; border: none; cursor: pointer; transition: all 0.1s; background: var(--muted); color: var(--muted-foreground); display: flex; align-items: center; }
	.anim-btn:hover { background: var(--border); }
	.anim-btn:active { transform: scale(0.95); }
	.anim-btn-active { background: var(--accent); color: var(--accent-foreground); font-weight: 600; }
	.anim-btn-label { font-weight: 500; }
	.anim-btn-desc { font-size: 0.75rem; opacity: 0.7; margin-left: 0.375rem; }
	.kbd-table { display: flex; flex-direction: column; gap: 0.5rem; border: 1px solid var(--border); border-radius: 0.75rem; padding: 1rem 1.25rem; background: var(--card); }
	.kbd-row { display: flex; align-items: center; gap: 0.75rem; font-size: 0.875rem; color: var(--muted-foreground); }
	.kbd-row kbd { font-family: ui-monospace, monospace; font-size: 0.75rem; background: var(--muted); border: 1px solid var(--border); border-radius: 0.375rem; padding: 0.15rem 0.4rem; color: var(--foreground); white-space: nowrap; }
</style>
