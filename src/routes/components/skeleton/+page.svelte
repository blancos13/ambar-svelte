<script lang="ts">
	import Skeleton from '$lib/components/Skeleton.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import PropsTable from '$lib/components/PropsTable.svelte';

	type Anim = 'shimmer' | 'pulse' | 'wave' | 'blink' | 'glow' | 'none';
	let playAnim = $state<Anim>('shimmer');

	const anims: { value: Anim; label: string; desc: string }[] = [
		{ value: 'shimmer', label: 'Shimmer', desc: 'Shiny sweep'  },
		{ value: 'pulse',   label: 'Pulse',   desc: 'Breathes'    },
		{ value: 'wave',    label: 'Wave',     desc: 'Wave'        },
		{ value: 'blink',   label: 'Blink',    desc: 'Blinks'      },
		{ value: 'glow',    label: 'Glow',     desc: 'Accent glow' },
		{ value: 'none',    label: 'None',     desc: 'Static'      },
	];

	const importCode = `import Skeleton from '$lib/components/Skeleton.svelte';`;

	const usageCode = `<!-- Rectangle (default) -->
<Skeleton shape="rect" height="80px" radius="0.75rem" />

<!-- Circle -->
<Skeleton shape="circle" width="3rem" />

<!-- Multi-line text block -->
<Skeleton shape="text" lines={4} />

<!-- Custom animation -->
<Skeleton shape="rect" height="1rem" animation="pulse" />`;

	const animCode = `<Skeleton animation="shimmer" />   <!-- shiny sweep (default) -->
<Skeleton animation="pulse" />    <!-- breathes in and out -->
<Skeleton animation="wave" />     <!-- gentle wave -->
<Skeleton animation="blink" />    <!-- step blink -->
<Skeleton animation="glow" />     <!-- accent color glow -->
<Skeleton animation="none" />     <!-- static, no animation -->`;

	const delayCode = `<!-- Staggered loading cards -->
{#each [0, 1, 2] as i}
  <Skeleton shape="rect" height="1rem" delay={i * 60} />
{/each}`;

	const props = [
		{ name: 'shape',     type: "'rect' | 'circle' | 'text'",                                        default: "'rect'",     description: "Shape of the skeleton element. rect for blocks, circle for avatars, text for multi-line text blocks." },
		{ name: 'animation', type: "'shimmer' | 'pulse' | 'wave' | 'blink' | 'glow' | 'none'",         default: "'shimmer'",  description: "Loading animation style applied to the skeleton." },
		{ name: 'width',     type: 'string',                                                             default: "'100%'",     description: "CSS width value. For circle shape, also controls the height." },
		{ name: 'height',    type: 'string',                                                             default: "'1rem'",     description: "CSS height value. Ignored when shape is circle or text." },
		{ name: 'radius',    type: 'string',                                                             default: "'0.5rem'",   description: "CSS border-radius value. Ignored when shape is circle." },
		{ name: 'lines',     type: 'number',                                                             default: '3',          description: "Number of text lines to render when shape is text." },
		{ name: 'delay',     type: 'number',                                                             default: '0',          description: "Animation delay in milliseconds. Useful for staggering multiple skeletons." },
		{ name: 'style',     type: 'string',                                                             default: "''",         description: "Additional inline CSS styles passed to the root element." },
		{ name: 'class',     type: 'string',                                                             default: "''",         description: "Additional CSS classes passed to the root element." },
	];
</script>

<div class="comp-header">
	<div class="comp-header-top">
		<h1 class="comp-title">Skeleton</h1>
		<span class="comp-badge">UI Feedback</span>
	</div>
	<p class="comp-desc">Loading placeholder with rect, circle, and text shapes — shimmer, pulse, wave, blink, and glow animations with stagger delay support.</p>
</div>

<section class="doc-section">
	<h2 class="doc-section-title">Import</h2>
	<CodeBlock code={importCode} lang="ts" />
</section>

<section class="doc-section">
	<h2 class="doc-section-title">Usage</h2>
	<div class="preview-box" style="flex-direction:column; align-items:stretch; gap:0.75rem; max-width:28rem; margin:0 auto;">
		<Skeleton shape="rect" height="80px" radius="0.75rem" />
		<Skeleton shape="rect" height="1rem" />
		<Skeleton shape="rect" height="1rem" width="70%" />
		<Skeleton shape="rect" height="1rem" width="45%" />
	</div>
	<CodeBlock code={usageCode} lang="svelte" />
</section>

<section class="doc-section">
	<h2 class="doc-section-title">Shapes</h2>
	<p class="doc-section-desc">Three shapes: <code>rect</code> for blocks and images, <code>circle</code> for avatars, <code>text</code> for multi-line text paragraphs.</p>
	<div class="preview-box" style="align-items:flex-start; gap:2rem; flex-wrap:wrap;">
		<div class="shape-col">
			<span class="shape-label">rect</span>
			<div style="width:180px; display:flex; flex-direction:column; gap:0.5rem;">
				<Skeleton shape="rect" height="80px" radius="0.75rem" />
				<Skeleton shape="rect" height="1rem" />
				<Skeleton shape="rect" height="1rem" width="70%" />
				<Skeleton shape="rect" height="1rem" width="45%" />
			</div>
		</div>
		<div class="shape-col">
			<span class="shape-label">circle</span>
			<div style="display:flex; align-items:flex-end; gap:0.75rem;">
				<Skeleton shape="circle" width="4rem" />
				<Skeleton shape="circle" width="3rem" />
				<Skeleton shape="circle" width="2.25rem" />
				<Skeleton shape="circle" width="1.5rem" />
			</div>
		</div>
		<div class="shape-col">
			<span class="shape-label">text</span>
			<div style="width:180px;">
				<Skeleton shape="text" lines={5} />
			</div>
		</div>
	</div>
</section>

<section class="doc-section">
	<h2 class="doc-section-title">Animations</h2>
	<p class="doc-section-desc">Choose an animation style with the <code>animation</code> prop. Use the buttons below to preview each option live.</p>
	<div class="preview-box preview-box-accent" style="flex-direction:column; align-items:stretch; gap:1rem;">
		<div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem; width:100%; max-width:32rem; margin:0 auto;">
			<div style="display:flex; flex-direction:column; gap:0.5rem;">
				<div style="display:flex; align-items:center; gap:0.75rem;">
					<Skeleton shape="circle" width="3rem" animation={playAnim} />
					<div style="flex:1; display:flex; flex-direction:column; gap:0.4rem;">
						<Skeleton shape="rect" height="0.875rem" width="55%" animation={playAnim} />
						<Skeleton shape="rect" height="0.75rem" width="38%" animation={playAnim} delay={40} />
					</div>
				</div>
				<Skeleton shape="rect" height="120px" radius="0.75rem" animation={playAnim} />
				<Skeleton shape="text" lines={3} animation={playAnim} />
			</div>
			<div style="display:flex; flex-direction:column; gap:0.5rem;">
				<div style="display:grid; grid-template-columns:repeat(3,1fr); gap:0.5rem;">
					{#each Array(6) as _, i}
						<Skeleton shape="rect" animation={playAnim} delay={i * 30} style="aspect-ratio:1; height:auto; width:100%;" />
					{/each}
				</div>
				{#each [0, 1, 2, 3] as i}
					<div style="display:flex; align-items:center; gap:0.5rem;">
						<Skeleton shape="circle" width="1.75rem" animation={playAnim} delay={i * 50} />
						<Skeleton shape="rect" height="0.75rem" animation={playAnim} delay={i * 50 + 20} />
					</div>
				{/each}
			</div>
		</div>
		<div style="display:flex; flex-wrap:wrap; gap:0.5rem; border-top:1px solid var(--border); padding-top:1rem; width:100%; max-width:32rem; margin:0 auto;">
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
	<CodeBlock code={animCode} lang="svelte" />
</section>

<section class="doc-section">
	<h2 class="doc-section-title">Stagger Delay</h2>
	<p class="doc-section-desc">Use the <code>delay</code> prop (milliseconds) to stagger animations across multiple skeletons for a wave-like effect.</p>
	<div class="preview-box" style="flex-direction:column; align-items:stretch; max-width:24rem; margin:0 auto; gap:0.5rem;">
		{#each [0, 1, 2, 3] as i}
			<Skeleton shape="rect" height="1rem" width="{100 - i * 12}%" delay={i * 60} />
		{/each}
	</div>
	<CodeBlock code={delayCode} lang="svelte" />
</section>

<section class="doc-section">
	<h2 class="doc-section-title">Example — Profile Card</h2>
	<p class="doc-section-desc">A realistic profile loading state combining all three shapes.</p>
	<div class="preview-box" style="align-items:flex-start;">
		<div style="width:100%; max-width:22rem; border:1px solid var(--border); border-radius:1rem; overflow:hidden;">
			<Skeleton shape="rect" height="160px" radius="0" animation={playAnim} />
			<div style="padding:1.25rem; display:flex; flex-direction:column; gap:1rem;">
				<div style="display:flex; align-items:flex-end; justify-content:space-between; margin-top:-2.5rem;">
					<Skeleton shape="circle" width="5rem" animation={playAnim} style="box-shadow:0 0 0 4px var(--card);" />
					<Skeleton shape="rect" height="2.25rem" width="100px" radius="9999px" animation={playAnim} />
				</div>
				<div style="display:flex; flex-direction:column; gap:0.4rem;">
					<Skeleton shape="rect" height="1.1rem" width="40%" animation={playAnim} />
					<Skeleton shape="rect" height="0.8rem" width="28%" animation={playAnim} />
				</div>
				<Skeleton shape="text" lines={2} animation={playAnim} />
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
	.shape-col { display: flex; flex-direction: column; gap: 0.5rem; }
	.shape-label { font-size: 0.7rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; color: var(--muted-foreground); }
	.anim-btn { border-radius: 0.75rem; padding: 0.5rem 1rem; font-size: 0.875rem; border: none; cursor: pointer; transition: all 0.1s; background: var(--muted); color: var(--muted-foreground); display: flex; align-items: center; gap: 0; }
	.anim-btn:hover { background: var(--border); }
	.anim-btn:active { transform: scale(0.95); }
	.anim-btn-active { background: var(--accent); color: var(--accent-foreground); font-weight: 600; }
	.anim-btn-label { font-weight: 500; }
	.anim-btn-desc { font-size: 0.75rem; opacity: 0.7; margin-left: 0.375rem; }
</style>
