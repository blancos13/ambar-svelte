<script lang="ts">
	import Button     from '$lib/components/Button.svelte';
	import Select     from '$lib/components/Select.svelte';
	import CodeBlock  from '$lib/components/CodeBlock.svelte';
	import PropsTable from '$lib/components/PropsTable.svelte';
	import { toastStore } from '$lib/stores/toast.svelte';

	let v = $state({
		basic: '', icon: '', search: '', country: '',
		role: '', sort: '', lang: '',
	});

	const roles = [
		{ value: 'creator',   label: 'Creator'   },
		{ value: 'moderator', label: 'Moderator' },
		{ value: 'viewer',    label: 'Viewer'    },
		{ value: 'admin',     label: 'Admin', disabled: true },
	];

	const sorts = [
		{ value: 'trending',  label: 'Trending'   },
		{ value: 'latest',    label: 'Latest'     },
		{ value: 'top',       label: 'Most Liked' },
		{ value: 'following', label: 'Following'  },
	];

	const categories = [
		{
			group: 'Entertainment',
			options: [
				{ value: 'music',   label: 'Music',   icon: '🎵' },
				{ value: 'dance',   label: 'Dance',   icon: '💃' },
				{ value: 'comedy',  label: 'Comedy',  icon: '😂' },
				{ value: 'gaming',  label: 'Gaming',  icon: '🎮' },
			],
		},
		{
			group: 'Knowledge',
			options: [
				{ value: 'science', label: 'Science', icon: '🔬' },
				{ value: 'history', label: 'History', icon: '📜' },
				{ value: 'tech',    label: 'Tech',    icon: '💻' },
			],
		},
		{
			group: 'Lifestyle',
			options: [
				{ value: 'food',    label: 'Food',    icon: '🍜' },
				{ value: 'travel',  label: 'Travel',  icon: '✈️' },
				{ value: 'fitness', label: 'Fitness', icon: '💪' },
			],
		},
	];

	const countries = [
		{ value: 'tr', label: 'Turkey',         icon: '🇹🇷' },
		{ value: 'us', label: 'United States',  icon: '🇺🇸' },
		{ value: 'gb', label: 'United Kingdom', icon: '🇬🇧' },
		{ value: 'de', label: 'Germany',        icon: '🇩🇪' },
		{ value: 'fr', label: 'France',         icon: '🇫🇷' },
		{ value: 'jp', label: 'Japan',          icon: '🇯🇵' },
		{ value: 'kr', label: 'South Korea',    icon: '🇰🇷' },
		{ value: 'br', label: 'Brazil',         icon: '🇧🇷' },
		{ value: 'in', label: 'India',          icon: '🇮🇳' },
		{ value: 'ca', label: 'Canada',         icon: '🇨🇦' },
		{ value: 'au', label: 'Australia',      icon: '🇦🇺' },
		{ value: 'mx', label: 'Mexico',         icon: '🇲🇽' },
	];

	const languages = [
		{ value: 'tr', label: 'Turkish'   },
		{ value: 'en', label: 'English'   },
		{ value: 'de', label: 'Deutsch'   },
		{ value: 'fr', label: 'Français'  },
		{ value: 'es', label: 'Español'   },
		{ value: 'ja', label: '日本語'     },
		{ value: 'ko', label: '한국어'     },
		{ value: 'zh', label: '中文'       },
		{ value: 'ar', label: 'العربية'   },
		{ value: 'pt', label: 'Português' },
	];

	const importCode = `import Select from '$lib/components/Select.svelte';`;

	const basicUsageCode = `<script lang="ts">
  let value = $state('');
  const options = [
    { value: 'creator',   label: 'Creator'   },
    { value: 'moderator', label: 'Moderator' },
    { value: 'viewer',    label: 'Viewer'    },
    { value: 'admin',     label: 'Admin', disabled: true },
  ];
<\/script>

<Select bind:value label="Account Type" {options} placeholder="Select..." />`;

	const groupedCode = `const categories = [
  {
    group: 'Entertainment',
    options: [
      { value: 'music',  label: 'Music',  icon: '🎵' },
      { value: 'gaming', label: 'Gaming', icon: '🎮' },
    ],
  },
  {
    group: 'Knowledge',
    options: [
      { value: 'science', label: 'Science', icon: '🔬' },
    ],
  },
];

<Select bind:value label="Category" options={categories} placeholder="Select category..." />`;

	const searchableCode = `<Select
  bind:value
  label="Country"
  options={countries}
  searchable
  placeholder="Search countries..."
/>`;

	const animationCode = `<Select options={roles} animation="slide"   label="Slide (default)" />
<Select options={roles} animation="scale"   label="Scale" />
<Select options={roles} animation="elastic" label="Elastic" />
<Select options={roles} animation="fade"    label="Fade" />
<Select options={roles} animation="flip"    label="Flip" />`;

	const statesCode = `<!-- Error state -->
<Select label="Role" {options} value="" error="Please select a role." />

<!-- Disabled state -->
<Select label="Language" {options} value="tr" disabled />`;

	const props = [
		{ name: 'value',       type: 'string',    default: "''",       description: 'Bindable selected value.', required: false },
		{ name: 'options',     type: 'Option[] | OptionGroup[]', default: '—', description: 'Flat option list or grouped options.', required: true },
		{ name: 'label',       type: 'string',    default: 'undefined', description: 'Field label rendered above the control.' },
		{ name: 'placeholder', type: 'string',    default: 'undefined', description: 'Placeholder text when no value is selected.' },
		{ name: 'hint',        type: 'string',    default: 'undefined', description: 'Helper text shown below the control.' },
		{ name: 'error',       type: 'string',    default: 'undefined', description: 'Error message; puts the control in error state.' },
		{ name: 'disabled',    type: 'boolean',   default: 'false',     description: 'Disables the select.' },
		{ name: 'searchable',  type: 'boolean',   default: 'false',     description: 'Shows a search field inside the dropdown.' },
		{ name: 'animation',   type: "'slide'|'scale'|'elastic'|'fade'|'flip'", default: "'slide'", description: 'Dropdown opening animation.' },
		{ name: 'class',       type: 'string',    default: "''",        description: 'Additional CSS classes for the root element.' },
	];
</script>

<div class="comp-header">
	<div class="comp-header-top">
		<h1 class="comp-title">Select</h1>
	</div>
	<p class="comp-desc">Custom dropdown with grouped options, icon support, built-in search, 5 animations, and full keyboard navigation.</p>
</div>

<!-- Import -->
<section class="doc-section">
	<h2 class="doc-section-title">Import</h2>
	<CodeBlock code={importCode} lang="ts" />
</section>

<!-- Usage -->
<section class="doc-section">
	<h2 class="doc-section-title">Usage</h2>
	<div class="preview-box" style="align-items: flex-end; flex-wrap: wrap;">
		<Select bind:value={v.role} label="Account Type" options={roles} placeholder="Select..." />
		<Select bind:value={v.sort} label="Sort" options={sorts} hint="Feed sorting" />
	</div>
	<CodeBlock code={basicUsageCode} lang="svelte" />
</section>

<!-- Animations -->
<section class="doc-section">
	<h2 class="doc-section-title">Animations</h2>
	<p class="doc-section-desc">5 opening animations — set with <code>animation</code> prop.</p>
	<div class="preview-box" style="align-items: flex-end; flex-wrap: wrap; gap: 1rem;">
		<Select bind:value={v.basic} label="Slide (default)" options={roles} animation="slide" />
		<Select bind:value={v.basic} label="Scale"           options={roles} animation="scale" />
		<Select bind:value={v.basic} label="Elastic"         options={roles} animation="elastic" />
		<Select bind:value={v.basic} label="Fade"            options={roles} animation="fade" />
		<Select bind:value={v.basic} label="Flip"            options={roles} animation="flip" />
		<Select bind:value={v.sort}  label="Sort"            options={sorts} hint="Feed sorting" />
	</div>
	<CodeBlock code={animationCode} lang="svelte" />
</section>

<!-- Searchable -->
<section class="doc-section">
	<h2 class="doc-section-title">Searchable</h2>
	<p class="doc-section-desc">Add <code>searchable</code> for a built-in filter field inside the dropdown.</p>
	<div class="preview-box" style="align-items: flex-end; flex-wrap: wrap; gap: 1rem;">
		<Select bind:value={v.lang}    label="Language" options={languages} searchable placeholder="Select language..." />
		<Select bind:value={v.country} label="Country"  options={countries} searchable placeholder="Search countries..." />
	</div>
	<CodeBlock code={searchableCode} lang="svelte" />
</section>

<!-- Grouped with icons -->
<section class="doc-section">
	<h2 class="doc-section-title">Grouped Options with Icons</h2>
	<p class="doc-section-desc">Pass an array of <code>OptionGroup</code> objects and add an <code>icon</code> string to each option.</p>
	<div class="preview-box" style="align-items: flex-end; flex-wrap: wrap; gap: 1rem;">
		<Select bind:value={v.icon}    label="Category" options={categories} placeholder="Select category..." />
		<Select bind:value={v.country} label="Country"  options={countries}  searchable placeholder="Search countries..." />
	</div>
	<CodeBlock code={groupedCode} lang="svelte" />
</section>

<!-- States -->
<section class="doc-section">
	<h2 class="doc-section-title">States</h2>
	<p class="doc-section-desc">Error and disabled states.</p>
	<div class="preview-box" style="align-items: flex-end; flex-wrap: wrap; gap: 1rem;">
		<Select label="Role"     options={roles}     value=""   error="Please select a role." />
		<Select label="Language" options={languages} value="tr" disabled />
	</div>
	<CodeBlock code={statesCode} lang="svelte" />
</section>

<!-- Use case -->
<section class="doc-section">
	<h2 class="doc-section-title">Use Case — Profile Settings</h2>
	<p class="doc-section-desc">Real-world form example.</p>
	<div class="preview-box">
		<form
			class="w-full max-w-sm space-y-4 rounded-2xl border border-border bg-card p-8"
			onsubmit={(e) => {
				e.preventDefault();
				toastStore.show('Saved!', 'success');
			}}
		>
			<p class="text-lg font-bold text-foreground">Profile Settings</p>

			<Select bind:value={v.role}    label="Account Type" options={roles}     placeholder="Select..." />
			<Select bind:value={v.country} label="Country"      options={countries} searchable placeholder="Search countries..." />
			<Select bind:value={v.lang}    label="Language"     options={languages} searchable placeholder="Select language..." />
			<Select bind:value={v.sort}    label="Feed Order"   options={sorts}     placeholder="Select..." />

			<Button type="submit" fullWidth>Save</Button>
		</form>
	</div>
</section>

<!-- API Reference -->
<section class="doc-section">
	<h2 class="doc-section-title">API Reference</h2>
	<p class="doc-section-desc"><code>Option</code>: <code>{'{ value, label, icon?, disabled? }'}</code> — <code>OptionGroup</code>: <code>{'{ group, options: Option[] }'}</code></p>
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
</style>
