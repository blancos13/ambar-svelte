<script lang="ts">
	import Button    from '$lib/components/Button.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';

	const installCode = `npx ambar-ui@latest add button input select`;

	const usageCode = `<script lang="ts">
  import Button from '$lib/components/Button.svelte';
  import Input  from '$lib/components/Input.svelte';
<\/script>

<Input label="Email" bind:value={email} />
<Button onclick={submit}>Send</Button>`;

	const stats = [
		{ value: '30+', label: 'Components' },
		{ value: '0',   label: 'Dependencies' },
		{ value: 'v5',  label: 'Svelte' },
		{ value: 'MIT', label: 'License' },
	];

	const features = [
		{
			title: 'Svelte 5 Runes',
			desc: 'Fine-grained reactivity with $state, $derived, $effect. No more boilerplate.',
			svg: `<polyline points="2 12 6 12 8 5 12 19 14 9 16 14 18 12 22 12" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`
		},
		{
			title: 'Fully Themeable',
			desc: 'Dark mode, 6 theme styles, 12 accent colors, custom fonts — all via CSS variables.',
			svg: `<circle cx="9" cy="12" r="5"/><circle cx="15" cy="8" r="5"/><circle cx="15" cy="16" r="5"/>`
		},
		{
			title: 'Zero Dependencies',
			desc: 'No runtime deps. Just Svelte + Tailwind CSS v4. Ships lean and fast.',
			svg: `<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" stroke-linecap="round" stroke-linejoin="round"/><polyline points="3.27 6.96 12 12.01 20.73 6.96" stroke-linecap="round"/><line x1="12" y1="22.08" x2="12" y2="12" stroke-linecap="round"/>`
		},
		{
			title: 'Copy & Paste',
			desc: 'Like shadcn/ui for Svelte. Copy source directly into your project — you own it.',
			svg: `<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" stroke-linecap="round" stroke-linejoin="round"/>`
		},
		{
			title: 'Accessible',
			desc: 'ARIA roles, keyboard navigation, and focus management built into every component.',
			svg: `<rect x="2" y="7" width="20" height="14" rx="2" stroke-linecap="round"/><path d="M6 11h.01M10 11h.01M14 11h.01M18 11h.01M6 15h.01M18 15h.01M10 15h4" stroke-linecap="round" stroke-linejoin="round"/>`
		},
		{
			title: 'Smooth Animations',
			desc: 'Spring physics, CSS keyframes, and GPU-accelerated transitions throughout.',
			svg: `<circle cx="12" cy="12" r="3"/><path d="M12 2C6.48 2 2 6.48 2 12" stroke-linecap="round"/><path d="M22 12c0 5.52-4.48 10-10 10" stroke-linecap="round"/><path d="M12 22c5.52 0 10-4.48 10-10" stroke-linecap="round" stroke-dasharray="3 3"/><path d="M2 12C2 6.48 6.48 2 12 2" stroke-linecap="round" stroke-dasharray="3 3"/>`
		},
	];

	const themeAccents = [
		'#6366f1', '#8b5cf6', '#ec4899', '#ef4444',
		'#f97316', '#eab308', '#22c55e', '#14b8a6',
		'#06b6d4', '#3b82f6', '#a855f7', '#64748b',
	];

	const themeFeatures = [
		{
			svg: `<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>`,
			label: 'Light & Dark',
		},
		{
			svg: `<path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>`,
			label: '12 Accent Colors',
		},
		{
			svg: `<rect x="3" y="3" width="18" height="18" rx="4"/><path d="M3 9h18M9 21V9"/>`,
			label: '6 Border Radius',
		},
		{
			svg: `<polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/>`,
			label: 'Custom Fonts',
		},
	];

	const charts = [
		{
			label: 'Bar Chart',
			href: '/components/charts/bar-chart',
			desc: 'Grouped & stacked bars',
			svg: `<rect x="2" y="14" width="4" height="8" rx="1"/><rect x="9" y="8" width="4" height="14" rx="1"/><rect x="16" y="4" width="4" height="18" rx="1"/>`,
		},
		{
			label: 'Line Chart',
			href: '/components/charts/line-chart',
			desc: 'Multi-series smooth lines',
			svg: `<polyline points="2 18 8 10 14 14 20 4" stroke-linecap="round" stroke-linejoin="round"/><polyline points="2 22 8 16 14 18 20 10" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="2 2"/>`,
		},
		{
			label: 'Candlestick',
			href: '/components/charts/candlestick',
			desc: 'OHLCV financial data',
			svg: `<line x1="6" y1="4" x2="6" y2="20"/><rect x="4" y="8" width="4" height="7" rx="0.5"/><line x1="14" y1="4" x2="14" y2="20"/><rect x="12" y="6" width="4" height="9" rx="0.5"/><line x1="20" y1="6" x2="20" y2="20"/><rect x="18" y="10" width="4" height="6" rx="0.5"/>`,
		},
		{
			label: 'Donut Chart',
			href: '/components/charts/donut-chart',
			desc: 'Proportional segments',
			svg: `<circle cx="12" cy="12" r="8" stroke-dasharray="18 32"/><circle cx="12" cy="12" r="8" stroke-dasharray="10 40" stroke-dashoffset="-18"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor"/>`,
		},
		{
			label: 'Heatmap',
			href: '/components/charts/heatmap',
			desc: 'Activity & density matrix',
			svg: `<rect x="2" y="2" width="4" height="4" rx="0.5" opacity="0.3"/><rect x="8" y="2" width="4" height="4" rx="0.5" opacity="0.6"/><rect x="14" y="2" width="4" height="4" rx="0.5" opacity="1"/><rect x="20" y="2" width="4" height="4" rx="0.5" opacity="0.4"/><rect x="2" y="8" width="4" height="4" rx="0.5" opacity="0.8"/><rect x="8" y="8" width="4" height="4" rx="0.5" opacity="0.2"/><rect x="14" y="8" width="4" height="4" rx="0.5" opacity="0.7"/><rect x="20" y="8" width="4" height="4" rx="0.5" opacity="0.5"/><rect x="2" y="14" width="4" height="4" rx="0.5" opacity="0.5"/><rect x="8" y="14" width="4" height="4" rx="0.5" opacity="0.9"/><rect x="14" y="14" width="4" height="4" rx="0.5" opacity="0.3"/><rect x="20" y="14" width="4" height="4" rx="0.5" opacity="0.8"/>`,
		},
		{
			label: 'Realtime',
			href: '/components/charts/realtime',
			desc: 'Live streaming data',
			svg: `<polyline points="2 16 6 10 10 13 14 7 18 10 22 6" stroke-linecap="round" stroke-linejoin="round"/><circle cx="22" cy="6" r="2" fill="currentColor"/><circle cx="22" cy="6" r="4" opacity="0.3"/>`,
		},
		{
			label: 'Sparkline',
			href: '/components/charts/sparkline',
			desc: 'Inline mini charts',
			svg: `<polyline points="2 14 6 10 10 12 14 6 18 9 22 5" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"/><path d="M2 18h20" stroke-width="1" opacity="0.3"/>`,
		},
	];

	const components = [
		{ name: 'Button',         href: '/components/button',      cat: 'Inputs'   },
		{ name: 'Input',          href: '/components/input',       cat: 'Inputs'   },
		{ name: 'Textarea',       href: '/components/textarea',    cat: 'Inputs'   },
		{ name: 'OTP Input',      href: '/components/otp-input',   cat: 'Inputs'   },
		{ name: 'Select',         href: '/components/select',      cat: 'Inputs'   },
		{ name: 'Checkbox',       href: '/components/checkbox',    cat: 'Inputs'   },
		{ name: 'Radio',          href: '/components/radio',       cat: 'Inputs'   },
		{ name: 'Slider',         href: '/components/slider',      cat: 'Inputs'   },
		{ name: 'Switch',         href: '/components/switch',      cat: 'Inputs'   },
		{ name: 'Search',         href: '/components/search',      cat: 'Inputs'   },
		{ name: 'Dialog',         href: '/components/dialog',      cat: 'Overlay'  },
		{ name: 'Drawer',         href: '/components/drawer',      cat: 'Overlay'  },
		{ name: 'Dropdown',       href: '/components/dropdown',    cat: 'Overlay'  },
		{ name: 'Popover',        href: '/components/popover',     cat: 'Overlay'  },
		{ name: 'Sheet',          href: '/components/sheet',       cat: 'Overlay'  },
		{ name: 'Toast',          href: '/components/toast',       cat: 'Overlay'  },
		{ name: 'Tooltip',        href: '/components/tooltip',     cat: 'Overlay'  },
		{ name: 'Accordion',      href: '/components/accordion',   cat: 'Layout'   },
		{ name: 'Avatar',         href: '/components/avatar',      cat: 'Layout'   },
		{ name: 'Breadcrumb',     href: '/components/breadcrumb',  cat: 'Layout'   },
		{ name: 'Sidebar',        href: '/components/sidebar',     cat: 'Layout'   },
		{ name: 'Tabs',           href: '/components/tabs',        cat: 'Layout'   },
		{ name: 'Empty State',    href: '/components/empty-state', cat: 'Display'  },
		{ name: 'Progress',       href: '/components/progress',    cat: 'Display'  },
		{ name: 'Skeleton',       href: '/components/skeleton',    cat: 'Display'  },
		{ name: 'Spinner',        href: '/components/spinner',     cat: 'Display'  },
		{ name: 'Typography',     href: '/components/typography',  cat: 'Display'  },
		{ name: 'Link',           href: '/components/link',        cat: 'Display'  },
		{ name: 'List',           href: '/components/list',        cat: 'Display'  },
		{ name: 'Bar Chart',      href: '/components/charts/bar-chart',   cat: 'Charts'  },
		{ name: 'Line Chart',     href: '/components/charts/line-chart',  cat: 'Charts'  },
		{ name: 'Candlestick',    href: '/components/charts/candlestick', cat: 'Charts'  },
		{ name: 'Donut Chart',    href: '/components/charts/donut-chart', cat: 'Charts'  },
		{ name: 'Heatmap',        href: '/components/charts/heatmap',     cat: 'Charts'  },
		{ name: 'Realtime',       href: '/components/charts/realtime',    cat: 'Charts'  },
		{ name: 'Sparkline',      href: '/components/charts/sparkline',   cat: 'Charts'  },
	];

	const catColor: Record<string, string> = {
		Inputs:  'cat-blue',
		Overlay: 'cat-violet',
		Layout:  'cat-emerald',
		Display: 'cat-amber',
		Charts:  'cat-rose',
	};
</script>

<div class="home">

<!-- ══════════════════════════════════════
     1 · HERO
     ══════════════════════════════════════ -->
<section class="hero">
	<div class="hero-glow" aria-hidden="true"></div>
	<div class="page-inner hero-inner">
		<a href="/components/button" class="hero-badge">
			<span class="hero-badge-dot"></span>
			Svelte 5 · Tailwind v4 · MIT
			<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
				style="width:.75rem;height:.75rem;margin-left:.2rem">
				<path d="M5 12h14M12 5l7 7-7 7"/>
			</svg>
		</a>

		<h1 class="hero-title">
			Beautiful UI for<br/>
			<span class="hero-accent">Svelte 5</span> apps
		</h1>

		<p class="hero-desc">
			A copy-paste component library — fully themeable, zero runtime dependencies,
			built for production.
		</p>

		<div class="hero-actions">
			<Button href="/components/installation" size="lg">
				Get started
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
					style="width:1rem;height:1rem">
					<path d="M5 12h14M12 5l7 7-7 7"/>
				</svg>
			</Button>
			<Button href="/components/button" variant="outline" size="lg">
				Browse components
			</Button>
		</div>

		<div class="hero-stats">
			{#each stats as s}
				<div class="hero-stat">
					<span class="hero-stat-value">{s.value}</span>
					<span class="hero-stat-label">{s.label}</span>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- ══════════════════════════════════════
     2 · FEATURES
     ══════════════════════════════════════ -->
<section class="section">
	<div class="page-inner">
		<div class="section-label">Why Ambar UI</div>
		<h2 class="section-title">Everything you need to ship</h2>
		<p class="section-sub">Production-ready components built on modern standards.</p>

		<div class="features-grid">
			{#each features as f}
				<div class="feature-card">
					<div class="feature-icon-wrap">
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
							stroke-width="1.75" class="feature-svg">
							{@html f.svg}
						</svg>
					</div>
					<h3 class="feature-title">{f.title}</h3>
					<p class="feature-desc">{f.desc}</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- ══════════════════════════════════════
     3 · THEMING
     ══════════════════════════════════════ -->
<section class="section section-alt">
	<div class="page-inner">
		<div class="section-label">Theming</div>
		<h2 class="section-title">One token, infinite styles</h2>
		<p class="section-sub">
			Every color, radius, and font is a CSS variable.
			Switch themes at runtime — no build step, no class toggling.
		</p>

		<div class="theme-body">
			<div class="theme-features">
				{#each themeFeatures as tf}
					<div class="theme-feature-row">
						<div class="theme-feature-icon">
							<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
								stroke-width="1.75" style="width:1rem;height:1rem;color:var(--accent)">
								{@html tf.svg}
							</svg>
						</div>
						<span class="theme-feature-label">{tf.label}</span>
					</div>
				{/each}
			</div>

			<div class="theme-swatches-wrap">
				<p class="swatch-label">12 accent colors</p>
				<div class="swatches">
					{#each themeAccents as color}
						<div class="swatch" style:background={color}></div>
					{/each}
				</div>
			</div>
		</div>
	</div>
</section>

<!-- ══════════════════════════════════════
     4 · QUICK START
     ══════════════════════════════════════ -->
<section class="section">
	<div class="page-inner section-split">
		<div class="split-text">
			<div class="section-label">Quick start</div>
			<h2 class="section-title">Up and running<br/>in seconds</h2>
			<p class="section-sub">
				Pick the components you need. Copy them into your project.
				Customize freely — you own the source.
			</p>
			<div class="split-actions">
				<Button href="/components/installation">Read the docs</Button>
				<Button href="/components/button" variant="outline">Browse all</Button>
			</div>
		</div>
		<div class="split-code">
			<CodeBlock code={installCode} lang="bash" collapsible={false} />
			<CodeBlock code={usageCode} lang="svelte" collapsible={false} />
		</div>
	</div>
</section>

<!-- ══════════════════════════════════════
     5 · COMPONENT GRID
     ══════════════════════════════════════ -->
<section class="section section-alt">
	<div class="page-inner">
		<div class="section-label">Components</div>
		<h2 class="section-title">35+ ready-to-use components</h2>
		<p class="section-sub">Every building block you need for modern UIs.</p>

		<div class="comp-grid">
			{#each components as c}
				<a href={c.href} class="comp-card">
					<span class="comp-name">{c.name}</span>
					<span class="comp-cat {catColor[c.cat] ?? ''}">{c.cat}</span>
				</a>
			{/each}
		</div>
	</div>
</section>

<!-- ══════════════════════════════════════
     6 · CHARTS
     ══════════════════════════════════════ -->
<section class="section">
	<div class="page-inner">
		<div class="section-label">Data visualization</div>
		<h2 class="section-title">7 chart components<br/>built for Svelte 5</h2>
		<p class="section-sub">
			From financial candlesticks to real-time streaming — all reactive, all themeable.
		</p>

		<div class="charts-grid">
			{#each charts as ch}
				<a href={ch.href} class="chart-card">
					<div class="chart-icon-wrap">
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
							stroke-width="1.6" class="chart-svg">
							{@html ch.svg}
						</svg>
					</div>
					<div class="chart-card-text">
						<span class="chart-card-label">{ch.label}</span>
						<span class="chart-card-desc">{ch.desc}</span>
					</div>
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
						style="width:.875rem;height:.875rem;flex-shrink:0;color:var(--muted-foreground)">
						<path d="M5 12h14M12 5l7 7-7 7"/>
					</svg>
				</a>
			{/each}
		</div>
	</div>
</section>

<!-- ══════════════════════════════════════
     7 · OPEN SOURCE CTA
     ══════════════════════════════════════ -->
<section class="section cta-section">
	<div class="page-inner cta-inner">
		<div class="cta-icon">
			<svg viewBox="0 0 24 24" fill="currentColor" style="width:2rem;height:2rem;color:var(--accent-foreground)">
				<path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/>
			</svg>
		</div>
		<h2 class="cta-title">Open source & free, forever</h2>
		<p class="cta-desc">
			Ambar UI is MIT licensed. Copy, fork, customize — no attribution required.
			Built in public, improved by the community.
		</p>
		<div class="cta-actions">
			<a href="https://github.com" target="_blank" rel="noreferrer" class="cta-btn-primary">
				<svg viewBox="0 0 24 24" fill="currentColor" style="width:1rem;height:1rem">
					<path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/>
				</svg>
				Star on GitHub
			</a>
			<Button href="/components/installation" variant="outline" size="lg">
				Get started free
			</Button>
		</div>
		<div class="cta-meta">
			<span class="cta-chip">MIT License</span>
			<span class="cta-chip">Svelte 5</span>
			<span class="cta-chip">Tailwind v4</span>
			<span class="cta-chip">TypeScript</span>
		</div>
	</div>
</section>

<!-- ══════════════════════════════════════
     8 · FOOTER
     ══════════════════════════════════════ -->
<footer class="footer">
	<div class="page-inner footer-inner">
		<div class="footer-brand">
			<div class="footer-logo">
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
					stroke-linecap="round" stroke-linejoin="round" style="width:1rem;height:1rem">
					<path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
				</svg>
			</div>
			<span class="footer-name">ambar<span style="color:var(--accent)">ui</span></span>
		</div>
		<p class="footer-copy">Built with Svelte 5 + Tailwind CSS v4 · MIT License</p>
		<a href="https://github.com" target="_blank" rel="noreferrer" class="footer-link">GitHub →</a>
	</div>
</footer>

</div>

<style>
.home { min-height: 100vh; }

/* ── Shared page inner (mirrors navbar max-width) ── */
.page-inner {
	max-width: 1280px;
	margin: 0 auto;
	padding-left: 1.5rem;
	padding-right: 1.5rem;
}

/* ════════════════════════════════════════
   HERO
   ════════════════════════════════════════ */
.hero {
	position: relative;
	overflow: hidden;
	padding: 5rem 0 0;
	text-align: center;
	border-bottom: 1px solid var(--border);
}

.hero-glow {
	position: absolute;
	top: -30%;
	left: 50%;
	transform: translateX(-50%);
	width: 80vw;
	height: 60vh;
	max-width: 900px;
	background: radial-gradient(ellipse, color-mix(in srgb, var(--accent) 18%, transparent) 0%, transparent 70%);
	pointer-events: none;
	z-index: 0;
}

.hero-inner {
	position: relative;
	z-index: 1;
	text-align: center;
}

.hero-badge {
	display: inline-flex;
	align-items: center;
	gap: 0.5rem;
	font-size: 0.72rem;
	font-weight: 600;
	color: var(--muted-foreground);
	background: var(--card);
	border: 1px solid var(--border);
	padding: 0.3rem 0.875rem;
	border-radius: 9999px;
	margin-bottom: 2rem;
	text-decoration: none;
	transition: color 0.15s, border-color 0.15s;
}
.hero-badge:hover {
	color: var(--foreground);
	border-color: color-mix(in srgb, var(--accent) 40%, var(--border));
}

.hero-badge-dot {
	width: 0.45rem; height: 0.45rem;
	border-radius: 9999px;
	background: var(--accent);
	box-shadow: 0 0 8px 2px color-mix(in srgb, var(--accent) 60%, transparent);
	animation: pulse-dot 2.4s ease-in-out infinite;
}
@keyframes pulse-dot {
	0%, 100% { opacity: 1; }
	50%       { opacity: 0.4; }
}

.hero-title {
	font-size: clamp(2.25rem, 6vw, 3.75rem);
	font-weight: 800;
	line-height: 1.1;
	letter-spacing: -0.035em;
	color: var(--foreground);
	margin-bottom: 1.25rem;
}
.hero-accent { color: var(--accent); }

.hero-desc {
	font-size: 1.0625rem;
	color: var(--muted-foreground);
	line-height: 1.7;
	margin-bottom: 2rem;
	max-width: 34rem;
	margin-left: auto;
	margin-right: auto;
}

.hero-actions {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 0.75rem;
	flex-wrap: wrap;
	margin-bottom: 3.5rem;
}

.hero-stats {
	display: flex;
	justify-content: center;
	border-top: 1px solid var(--border);
	gap: 0;
}

.hero-stat {
	flex: 1;
	max-width: 9rem;
	padding: 1.25rem 1rem;
	border-right: 1px solid var(--border);
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 0.2rem;
}
.hero-stat:last-child { border-right: none; }

.hero-stat-value {
	font-size: 1.5rem;
	font-weight: 800;
	color: var(--foreground);
	letter-spacing: -0.03em;
}

.hero-stat-label {
	font-size: 0.68rem;
	font-weight: 500;
	text-transform: uppercase;
	letter-spacing: 0.08em;
	color: var(--muted-foreground);
}

/* ════════════════════════════════════════
   SECTIONS
   ════════════════════════════════════════ */
.section { padding: 5rem 0; }

.section-alt {
	background: color-mix(in srgb, var(--muted) 40%, var(--background));
	border-top: 1px solid var(--border);
	border-bottom: 1px solid var(--border);
}

.section-label {
	font-size: 0.72rem;
	font-weight: 700;
	text-transform: uppercase;
	letter-spacing: 0.1em;
	color: var(--accent);
	margin-bottom: 0.75rem;
}

.section-title {
	font-size: clamp(1.5rem, 3vw, 2.25rem);
	font-weight: 800;
	letter-spacing: -0.03em;
	color: var(--foreground);
	margin-bottom: 0.5rem;
}

.section-sub {
	color: var(--muted-foreground);
	font-size: 1rem;
	margin-bottom: 3rem;
}

/* ════════════════════════════════════════
   FEATURES
   ════════════════════════════════════════ */
.features-grid {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	gap: 1px;
	background: var(--border);
	border: 1px solid var(--border);
	border-radius: 1rem;
	overflow: hidden;
}

.feature-card {
	padding: 1.75rem;
	background: var(--card);
	display: flex;
	flex-direction: column;
	gap: 0.75rem;
	transition: background 0.15s;
}
.feature-card:hover {
	background: color-mix(in srgb, var(--accent) 5%, var(--card));
}

.feature-icon-wrap {
	width: 2.5rem; height: 2.5rem;
	border-radius: 0.625rem;
	background: color-mix(in srgb, var(--accent) 12%, transparent);
	border: 1px solid color-mix(in srgb, var(--accent) 25%, transparent);
	display: flex; align-items: center; justify-content: center;
	flex-shrink: 0;
}

.feature-svg {
	width: 1.125rem; height: 1.125rem;
	color: var(--accent);
}

.feature-title {
	font-size: 0.9375rem;
	font-weight: 700;
	color: var(--foreground);
}

.feature-desc {
	font-size: 0.8125rem;
	color: var(--muted-foreground);
	line-height: 1.6;
}

@media (max-width: 768px)  { .features-grid { grid-template-columns: 1fr; } }
@media (min-width: 769px) and (max-width: 1024px) {
	.features-grid { grid-template-columns: repeat(2, 1fr); }
}

/* ════════════════════════════════════════
   THEMING
   ════════════════════════════════════════ */
.theme-body {
	display: flex;
	align-items: flex-start;
	gap: 4rem;
}

.theme-features {
	display: flex;
	flex-direction: column;
	gap: 0.75rem;
	flex: 1;
}

.theme-feature-row {
	display: flex;
	align-items: center;
	gap: 0.75rem;
}

.theme-feature-icon {
	width: 2rem; height: 2rem;
	border-radius: 0.5rem;
	background: color-mix(in srgb, var(--accent) 10%, transparent);
	display: flex; align-items: center; justify-content: center;
	flex-shrink: 0;
}

.theme-feature-label {
	font-size: 0.875rem;
	font-weight: 500;
	color: var(--foreground);
}

.theme-swatches-wrap { flex-shrink: 0; }

.swatch-label {
	font-size: 0.68rem;
	font-weight: 700;
	text-transform: uppercase;
	letter-spacing: 0.08em;
	color: var(--muted-foreground);
	margin-bottom: 0.75rem;
}

.swatches {
	display: grid;
	grid-template-columns: repeat(6, 1fr);
	gap: 0.5rem;
}

.swatch {
	width: 2rem; height: 2rem;
	border-radius: 0.5rem;
	box-shadow: 0 1px 4px rgba(0,0,0,0.15);
	transition: transform 0.12s;
	cursor: pointer;
}
.swatch:hover { transform: scale(1.15); }

@media (max-width: 640px) {
	.theme-body { flex-direction: column; gap: 2rem; }
	.swatches { grid-template-columns: repeat(6, 1fr); }
}

/* ════════════════════════════════════════
   QUICK START SPLIT
   ════════════════════════════════════════ */
.section-split {
	display: grid;
	grid-template-columns: 1fr 1.6fr;
	gap: 4rem;
	align-items: start;
}

.split-text .section-sub { margin-bottom: 1.5rem; }

.split-actions {
	display: flex;
	gap: 0.625rem;
	flex-wrap: wrap;
}

.split-code {
	display: flex;
	flex-direction: column;
	gap: 0.875rem;
}

@media (max-width: 720px) {
	.section-split { grid-template-columns: 1fr; gap: 2rem; }
}

/* ════════════════════════════════════════
   COMPONENT GRID
   ════════════════════════════════════════ */
.comp-grid {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(10rem, 1fr));
	gap: 0.5rem;
}

.comp-card {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 0.5rem;
	padding: 0.6rem 0.875rem;
	border: 1px solid var(--border);
	border-radius: 0.625rem;
	background: var(--card);
	text-decoration: none;
	transition: border-color 0.15s, transform 0.15s, box-shadow 0.15s;
}
.comp-card:hover {
	border-color: color-mix(in srgb, var(--accent) 50%, var(--border));
	transform: translateY(-1px);
	box-shadow: 0 4px 12px color-mix(in srgb, var(--accent) 8%, transparent);
}

.comp-name {
	font-size: 0.8rem;
	font-weight: 600;
	color: var(--foreground);
}

.comp-cat {
	font-size: 0.58rem;
	font-weight: 700;
	text-transform: uppercase;
	letter-spacing: 0.05em;
	padding: 0.1rem 0.375rem;
	border-radius: 9999px;
	flex-shrink: 0;
}

.cat-blue    { background: #dbeafe; color: #1d4ed8; }
.cat-violet  { background: #ede9fe; color: #6d28d9; }
.cat-emerald { background: #d1fae5; color: #065f46; }
.cat-amber   { background: #fef3c7; color: #92400e; }
.cat-rose    { background: #ffe4e6; color: #9f1239; }

:global(html.dark) .cat-blue    { background: #1e3a5f; color: #93c5fd; }
:global(html.dark) .cat-violet  { background: #2e1065; color: #c4b5fd; }
:global(html.dark) .cat-emerald { background: #064e3b; color: #6ee7b7; }
:global(html.dark) .cat-amber   { background: #78350f; color: #fcd34d; }
:global(html.dark) .cat-rose    { background: #881337; color: #fda4af; }

/* ════════════════════════════════════════
   CHARTS
   ════════════════════════════════════════ */
.charts-grid {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(16rem, 1fr));
	gap: 0.75rem;
}

.chart-card {
	display: flex;
	align-items: center;
	gap: 1rem;
	padding: 1rem 1.125rem;
	border: 1px solid var(--border);
	border-radius: 0.75rem;
	background: var(--card);
	text-decoration: none;
	transition: border-color 0.15s, transform 0.15s, box-shadow 0.15s;
}
.chart-card:hover {
	border-color: color-mix(in srgb, var(--accent) 50%, var(--border));
	transform: translateY(-1px);
	box-shadow: 0 4px 16px color-mix(in srgb, var(--accent) 8%, transparent);
}

.chart-icon-wrap {
	width: 2.5rem; height: 2.5rem;
	border-radius: 0.625rem;
	background: color-mix(in srgb, var(--accent) 12%, transparent);
	border: 1px solid color-mix(in srgb, var(--accent) 20%, transparent);
	display: flex; align-items: center; justify-content: center;
	flex-shrink: 0;
}

.chart-svg {
	width: 1.125rem; height: 1.125rem;
	color: var(--accent);
}

.chart-card-text {
	display: flex;
	flex-direction: column;
	gap: 0.15rem;
	flex: 1;
	min-width: 0;
}

.chart-card-label {
	font-size: 0.875rem;
	font-weight: 600;
	color: var(--foreground);
}

.chart-card-desc {
	font-size: 0.75rem;
	color: var(--muted-foreground);
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

/* ════════════════════════════════════════
   CTA
   ════════════════════════════════════════ */
.cta-section {
	background: var(--accent);
	border-top: none;
	border-bottom: none;
}

.cta-inner {
	text-align: center;
}

.cta-icon {
	width: 4rem; height: 4rem;
	border-radius: 1.25rem;
	background: color-mix(in srgb, var(--accent-foreground) 15%, transparent);
	display: flex; align-items: center; justify-content: center;
	margin: 0 auto 1.5rem;
}

.cta-title {
	font-size: clamp(1.5rem, 3vw, 2.25rem);
	font-weight: 800;
	letter-spacing: -0.03em;
	color: var(--accent-foreground);
	margin-bottom: 0.75rem;
}

.cta-desc {
	font-size: 1rem;
	color: color-mix(in srgb, var(--accent-foreground) 80%, transparent);
	max-width: 36rem;
	margin: 0 auto 2rem;
	line-height: 1.7;
}

.cta-actions {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 0.75rem;
	flex-wrap: wrap;
	margin-bottom: 1.5rem;
}

.cta-btn-primary {
	display: inline-flex;
	align-items: center;
	gap: 0.5rem;
	padding: 0.75rem 1.5rem;
	border-radius: 0.625rem;
	background: var(--accent-foreground);
	color: var(--accent);
	font-size: 0.9375rem;
	font-weight: 700;
	text-decoration: none;
	transition: opacity 0.15s;
}
.cta-btn-primary:hover { opacity: 0.88; }

.cta-meta {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 0.5rem;
	flex-wrap: wrap;
}

.cta-chip {
	font-size: 0.7rem;
	font-weight: 600;
	padding: 0.25rem 0.625rem;
	border-radius: 9999px;
	background: color-mix(in srgb, var(--accent-foreground) 15%, transparent);
	color: color-mix(in srgb, var(--accent-foreground) 90%, transparent);
	border: 1px solid color-mix(in srgb, var(--accent-foreground) 25%, transparent);
}

/* ════════════════════════════════════════
   FOOTER
   ════════════════════════════════════════ */
.footer {
	border-top: 1px solid var(--border);
	padding: 2rem 0;
}

.footer-inner {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 1rem;
	flex-wrap: wrap;
}

.footer-brand {
	display: flex;
	align-items: center;
	gap: 0.5rem;
}

.footer-logo {
	width: 1.5rem; height: 1.5rem;
	border-radius: 0.375rem;
	background: var(--accent);
	color: var(--accent-foreground);
	display: flex; align-items: center; justify-content: center;
}

.footer-name {
	font-weight: 700;
	font-size: 0.9375rem;
	color: var(--foreground);
}

.footer-copy {
	font-size: 0.8rem;
	color: var(--muted-foreground);
}

.footer-link {
	font-size: 0.8rem;
	color: var(--muted-foreground);
	text-decoration: none;
	transition: color 0.15s;
}
.footer-link:hover { color: var(--foreground); }

/* ════════════════════════════════════════
   MOBILE
   ════════════════════════════════════════ */
@media (max-width: 600px) {
	.section { padding: 3.5rem 0; }
	.hero { padding: 3.5rem 0 0; }
	.charts-grid { grid-template-columns: 1fr; }
}
</style>
