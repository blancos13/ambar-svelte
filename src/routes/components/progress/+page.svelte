<script lang="ts">
	import Progress from '$lib/components/Progress.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import PropsTable from '$lib/components/PropsTable.svelte';

	const importCode = `import Progress from '$lib/components/Progress.svelte';`;

	const usageCode = `<Progress value={68} />`;

	const variantsCode = `<Progress value={68} variant="accent"  label="Accent"  showValue />
<Progress value={82} variant="success" label="Success" showValue />
<Progress value={55} variant="warning" label="Warning" showValue />
<Progress value={34} variant="danger"  label="Danger"  showValue />
<Progress value={76} variant="info"    label="Info"    showValue />`;

	const stripedCode = `<Progress value={72} striped />
<Progress value={72} striped variant="success" />`;

	const indeterminateCode = `<Progress indeterminate />
<Progress indeterminate variant="info" size="sm" />`;

	const animationCode = `<Progress value={sliderVal} animation="smooth" label="Smooth" showValue />
<Progress value={sliderVal} animation="spring" label="Spring" showValue />
<Progress value={sliderVal} animation="bounce" label="Bounce" showValue />
<Progress value={sliderVal} animation="none"   label="None"   showValue />`;

	type Anim    = 'smooth' | 'spring' | 'bounce' | 'none';
	type Variant = 'accent' | 'success' | 'warning' | 'danger' | 'info';

	let sliderVal = $state(68);
	let playAnim  = $state<Anim>('smooth');

	const anims: { value: Anim; label: string; desc: string }[] = [
		{ value: 'smooth', label: 'Smooth', desc: 'Default'    },
		{ value: 'spring', label: 'Spring', desc: 'Overshoot'  },
		{ value: 'bounce', label: 'Bounce', desc: 'Hard bounce' },
		{ value: 'none',   label: 'None',   desc: 'Instant'    },
	];

	const variants: { value: Variant; label: string }[] = [
		{ value: 'accent',  label: 'Accent'  },
		{ value: 'success', label: 'Success' },
		{ value: 'warning', label: 'Warning' },
		{ value: 'danger',  label: 'Danger'  },
		{ value: 'info',    label: 'Info'    },
	];

	const props = [
		{ name: 'value', type: 'number', default: '0', description: 'Current progress value.' },
		{ name: 'max', type: 'number', default: '100', description: 'Maximum value. The fill percentage is value/max * 100.' },
		{ name: 'size', type: "'xs' | 'sm' | 'md' | 'lg'", default: "'md'", description: 'Track height.' },
		{ name: 'variant', type: "'accent' | 'success' | 'warning' | 'danger' | 'info'", default: "'accent'", description: 'Color theme of the fill.' },
		{ name: 'animation', type: "'smooth' | 'spring' | 'bounce' | 'none'", default: "'smooth'", description: 'Easing applied when the value changes.' },
		{ name: 'striped', type: 'boolean', default: 'false', description: 'Adds an animated diagonal stripe pattern to the fill.' },
		{ name: 'indeterminate', type: 'boolean', default: 'false', description: 'Shows an infinite looping animation. Ignores value.' },
		{ name: 'label', type: 'string', default: 'undefined', description: 'Accessible label rendered above the bar.' },
		{ name: 'showValue', type: 'boolean', default: 'false', description: 'Show the numeric percentage next to the label.' },
		{ name: 'class', type: 'string', default: 'undefined', description: 'Extra CSS classes for the root element.' },
	];
</script>

<div class="comp-header">
	<div class="comp-header-top">
		<h1 class="comp-title">Progress</h1>
		<span class="comp-badge">Display</span>
	</div>
	<p class="comp-desc">Progress bar with 5 color variants, 4 sizes, animated stripe pattern, indeterminate mode, and 3 value-change animations.</p>
</div>

<section class="doc-section">
	<h2 class="doc-section-title">Import</h2>
	<CodeBlock code={importCode} lang="ts" />
</section>

<section class="doc-section">
	<h2 class="doc-section-title">Usage</h2>
	<div class="preview-box preview-box-accent">
		<div class="progress-col">
			<Progress value={68} />
		</div>
	</div>
	<CodeBlock code={usageCode} lang="svelte" />
</section>

<section class="doc-section">
	<h2 class="doc-section-title">Sizes</h2>
	<p class="doc-section-desc">Four track heights: <code>xs</code>, <code>sm</code>, <code>md</code> (default), <code>lg</code>.</p>
	<div class="preview-box">
		<div class="progress-col">
			{#each ['xs','sm','md','lg'] as size}
				<div class="progress-row">
					<span class="progress-label-side">{size}</span>
					<Progress value={72} size={size as any} class="flex-1" />
				</div>
			{/each}
		</div>
	</div>
</section>

<section class="doc-section">
	<h2 class="doc-section-title">Variants</h2>
	<p class="doc-section-desc">Five semantic color variants: <code>accent</code>, <code>success</code>, <code>warning</code>, <code>danger</code>, <code>info</code>.</p>
	<div class="preview-box">
		<div class="progress-col">
			{#each variants as v}
				<Progress
					value={[68,82,55,34,76][variants.indexOf(v)]}
					variant={v.value}
					size="md"
					label={v.label}
					showValue
				/>
			{/each}
		</div>
	</div>
	<CodeBlock code={variantsCode} lang="svelte" />
</section>

<section class="doc-section">
	<h2 class="doc-section-title">Striped</h2>
	<p class="doc-section-desc">Add <code>striped</code> for an animated diagonal stripe pattern.</p>
	<div class="preview-box">
		<div class="progress-col">
			{#each variants as v}
				<Progress
					value={[68,82,55,34,76][variants.indexOf(v)]}
					variant={v.value}
					size="lg"
					striped
					label={v.label}
					showValue
				/>
			{/each}
		</div>
	</div>
	<CodeBlock code={stripedCode} lang="svelte" />
</section>

<section class="doc-section">
	<h2 class="doc-section-title">Indeterminate</h2>
	<p class="doc-section-desc">Use <code>indeterminate</code> when the total progress is unknown. Ignores <code>value</code>.</p>
	<div class="preview-box">
		<div class="progress-col">
			{#each variants as v}
				<div class="progress-row">
					<span class="progress-label-side w16">{v.label}</span>
					<Progress variant={v.value} size="md" indeterminate class="flex-1" />
				</div>
			{/each}
		</div>
	</div>
	<CodeBlock code={indeterminateCode} lang="svelte" />
</section>

<section class="doc-section">
	<h2 class="doc-section-title">Animations</h2>
	<p class="doc-section-desc">Drag the slider to see how each <code>animation</code> value behaves when the progress changes.</p>
	<div class="preview-box" style="flex-direction: column; align-items: stretch;">
		<div class="anim-col">
			<Progress value={sliderVal} animation={playAnim} size="lg" label="View rate" showValue />
			<Progress value={sliderVal} animation={playAnim} size="md" variant="success" striped label="Completed tasks" showValue />
			<Progress value={100 - sliderVal} animation={playAnim} size="md" variant="warning" label="Storage used" showValue />
		</div>
		<div class="anim-controls">
			<div class="anim-slider-row">
				<span class="ctrl-label">Value</span>
				<input type="range" min="0" max="100" bind:value={sliderVal} class="anim-slider" />
				<span class="ctrl-value">{sliderVal}</span>
			</div>
			<div class="anim-btn-row">
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
	<CodeBlock code={animationCode} lang="svelte" />
</section>

<section class="doc-section">
	<h2 class="doc-section-title">Use Cases</h2>
	<p class="doc-section-desc">Real-world examples of Progress in common UI patterns.</p>
	<div class="use-case-grid">

		<div class="use-case-card">
			<p class="use-case-title">File Upload</p>
			{#each [
				{ name: 'video_final.mp4', size: '248 MB', pct: 84, variant: 'accent'  },
				{ name: 'thumbnail.png',   size: '1.2 MB', pct: 100, variant: 'success' },
				{ name: 'subtitle.srt',    size: '42 KB',  pct: 38, variant: 'accent'  },
			] as f}
				<div class="file-row">
					<div class="file-meta">
						<span class="file-name">{f.name}</span>
						<span class="file-size">{f.size}</span>
					</div>
					<Progress value={f.pct} variant={f.variant as any} size="sm" showValue />
				</div>
			{/each}
		</div>

		<div class="use-case-card">
			<p class="use-case-title">Profile Stats</p>
			{#each [
				{ label: 'Follower goal',    pct: 73, variant: 'accent'  },
				{ label: 'Like rate',         pct: 91, variant: 'success' },
				{ label: 'Comment engagement',pct: 44, variant: 'warning' },
				{ label: 'Storage used',      pct: 58, variant: 'info'    },
			] as s}
				<Progress value={s.pct} variant={s.variant as any} size="sm" label={s.label} showValue />
			{/each}
		</div>

		<div class="use-case-card">
			<p class="use-case-title">Skill Bars</p>
			{#each [
				{ label: 'Video Editing', pct: 92 },
				{ label: 'Motion Design', pct: 78 },
				{ label: 'Color Grading', pct: 85 },
				{ label: 'Sound Design',  pct: 61 },
			] as s}
				<Progress value={s.pct} size="md" label={s.label} showValue striped />
			{/each}
		</div>

		<div class="use-case-card">
			<p class="use-case-title">Loading States</p>
			<div class="loading-col">
				<div class="loading-item">
					<span class="loading-label">Processing video...</span>
					<Progress indeterminate size="md" variant="accent" />
				</div>
				<div class="loading-item">
					<span class="loading-label">Uploading to server...</span>
					<Progress indeterminate size="sm" variant="info" />
				</div>
				<div class="loading-item">
					<span class="loading-label">AI analyzing...</span>
					<Progress indeterminate size="xs" variant="warning" />
				</div>
			</div>
		</div>

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

	.progress-col { display: flex; flex-direction: column; gap: 1.25rem; width: 100%; max-width: 42rem; }
	.progress-row { display: flex; align-items: center; gap: 1rem; }
	.progress-label-side { flex-shrink: 0; width: 2rem; font-size: 0.75rem; color: var(--muted-foreground); font-family: ui-monospace, monospace; }
	.w16 { width: 4rem; }

	.anim-col { display: flex; flex-direction: column; gap: 1.25rem; width: 100%; max-width: 42rem; }
	.anim-controls { display: flex; flex-direction: column; gap: 1rem; border-top: 1px solid var(--border); padding-top: 1.25rem; margin-top: 0.5rem; }
	.anim-slider-row { display: flex; align-items: center; gap: 1rem; }
	.ctrl-label { font-size: 0.75rem; color: var(--muted-foreground); flex-shrink: 0; }
	.ctrl-value { width: 2rem; text-align: right; font-size: 0.75rem; font-family: ui-monospace, monospace; color: var(--muted-foreground); flex-shrink: 0; }
	.anim-slider { flex: 1; accent-color: var(--accent); }
	.anim-btn-row { display: flex; flex-wrap: wrap; gap: 0.5rem; }
	.anim-btn { border-radius: 0.75rem; padding: 0.5rem 1rem; font-size: 0.875rem; border: none; cursor: pointer; background: var(--muted); color: var(--muted-foreground); transition: background 0.1s, transform 0.1s; display: flex; align-items: center; gap: 0.375rem; }
	.anim-btn:hover { background: var(--border); }
	.anim-btn:active { transform: scale(0.95); }
	.anim-btn-active { background: var(--accent); color: var(--accent-foreground); font-weight: 600; }
	.anim-btn-label { font-weight: 500; }
	.anim-btn-desc { font-size: 0.75rem; opacity: 0.7; }

	.use-case-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(18rem, 1fr)); gap: 1rem; }
	.use-case-card { border-radius: 1rem; border: 1px solid var(--border); background: var(--card); padding: 1.25rem; display: flex; flex-direction: column; gap: 1rem; }
	.use-case-title { font-size: 0.75rem; font-weight: 500; color: var(--muted-foreground); }

	.file-row { display: flex; flex-direction: column; gap: 0.375rem; }
	.file-meta { display: flex; justify-content: space-between; }
	.file-name { font-size: 0.75rem; font-weight: 500; color: var(--foreground); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
	.file-size { font-size: 0.75rem; color: var(--muted-foreground); flex-shrink: 0; margin-left: 0.5rem; }

	.loading-col { display: flex; flex-direction: column; gap: 0.75rem; }
	.loading-item { display: flex; flex-direction: column; gap: 0.375rem; }
	.loading-label { font-size: 0.75rem; color: var(--muted-foreground); }
</style>
