<script lang="ts">
	import Button   from '$lib/components/Button.svelte';
	import Checkbox from '$lib/components/Checkbox.svelte';
	import CodeBlock  from '$lib/components/CodeBlock.svelte';
	import PropsTable from '$lib/components/PropsTable.svelte';
	import { toastStore } from '$lib/stores/toast.svelte';

	let v = $state({
		a: false, b: true, c: false,
		terms: false, marketing: false, notifications: true,
		all: false,
	});

	let fruits = $state([
		{ label: 'Apple',      checked: false },
		{ label: 'Banana',     checked: true  },
		{ label: 'Strawberry', checked: false },
		{ label: 'Mango',      checked: true  },
	]);

	let allChecked   = $derived(fruits.every(f => f.checked));
	let someChecked  = $derived(fruits.some(f => f.checked) && !allChecked);

	function toggleAll() {
		const next = !allChecked;
		fruits = fruits.map(f => ({ ...f, checked: next }));
	}

	const importCode = `import Checkbox from '$lib/components/Checkbox.svelte';`;

	const usageCode = `<Checkbox bind:checked={value} label="Remember me" />`;

	const basicCode = `<Checkbox bind:checked={value} label="Remember me" />
<Checkbox bind:checked={value} label="Enable notifications" hint="New follower and like notifications" />`;

	const statesCode = `<Checkbox checked={false} label="Disabled (unchecked)" disabled />
<Checkbox checked={true}  label="Disabled (checked)"   disabled />
<Checkbox indeterminate   label="Indeterminate" hint="Some items selected" />`;

	const selectAllCode = `<Checkbox
  checked={allChecked}
  indeterminate={someChecked}
  label="Select all"
  onchange={toggleAll}
/>
<div class="ml-8">
  {#each fruits as fruit}
    <Checkbox bind:checked={fruit.checked} label={fruit.label} />
  {/each}
</div>`;

	const props = [
		{ name: 'checked',       type: 'boolean',             default: 'false', description: 'Bindable checked state of the checkbox.' },
		{ name: 'label',         type: 'string',              description: 'Text label displayed next to the checkbox.' },
		{ name: 'hint',          type: 'string',              description: 'Secondary hint text shown below the label.' },
		{ name: 'disabled',      type: 'boolean',             default: 'false', description: 'Prevents interaction and reduces opacity.' },
		{ name: 'indeterminate', type: 'boolean',             default: 'false', description: 'Shows a dash to indicate a partially selected state.' },
		{ name: 'onchange',      type: '(v: boolean) => void', description: 'Callback fired when the checked state changes.' },
	];
</script>

<!-- Header -->
<div class="comp-header">
	<div class="comp-header-top">
		<h1 class="comp-title">Checkbox</h1>
	</div>
	<p class="comp-desc">Animated custom checkbox with label, hint, disabled, and indeterminate states.</p>
</div>

<!-- Import -->
<section class="doc-section">
	<h2 class="doc-section-title">Import</h2>
	<CodeBlock code={importCode} lang="ts" />
</section>

<!-- Usage -->
<section class="doc-section">
	<h2 class="doc-section-title">Usage</h2>
	<div class="preview-box">
		<Checkbox bind:checked={v.a} label="Remember me" />
	</div>
	<CodeBlock code={usageCode} lang="svelte" />
</section>

<!-- Basic -->
<section class="doc-section">
	<h2 class="doc-section-title">Basic</h2>
	<p class="doc-section-desc">With label and optional hint text.</p>
	<div class="preview-box preview-box-left">
		<div class="flex flex-col gap-4 w-full max-w-sm">
			<Checkbox bind:checked={v.a} label="Remember me" />
			<Checkbox bind:checked={v.b} label="Enable notifications" hint="New follower and like notifications" />
			<Checkbox bind:checked={v.c} label="Checkbox only" />
		</div>
	</div>
	<CodeBlock code={basicCode} lang="svelte" />
</section>

<!-- States -->
<section class="doc-section">
	<h2 class="doc-section-title">States</h2>
	<p class="doc-section-desc">Disabled and indeterminate states.</p>
	<div class="preview-box preview-box-left">
		<div class="flex flex-col gap-4 w-full max-w-sm">
			<Checkbox checked={false} label="Disabled (unchecked)" disabled />
			<Checkbox checked={true}  label="Disabled (checked)"   disabled />
			<Checkbox indeterminate   label="Indeterminate" hint="Some items selected" />
		</div>
	</div>
	<CodeBlock code={statesCode} lang="svelte" />
</section>

<!-- Select All -->
<section class="doc-section">
	<h2 class="doc-section-title">Select All</h2>
	<p class="doc-section-desc">Select all with indeterminate state for partial selections.</p>
	<div class="preview-box preview-box-left">
		<div class="flex flex-col gap-3 w-full max-w-sm">
			<Checkbox
				checked={allChecked}
				indeterminate={someChecked}
				label="Select all"
				onchange={toggleAll}
			/>
			<div class="ml-8 flex flex-col gap-3 border-l border-border pl-4">
				{#each fruits as fruit}
					<Checkbox bind:checked={fruit.checked} label={fruit.label} />
				{/each}
			</div>
		</div>
	</div>
	<CodeBlock code={selectAllCode} lang="svelte" />
</section>

<!-- Use Case — Sign Up Form -->
<section class="doc-section">
	<h2 class="doc-section-title">Use Case — Sign Up Form</h2>
	<p class="doc-section-desc">Real-world form example with required field validation.</p>
	<div class="preview-box">
		<form
			class="w-full max-w-sm space-y-4 rounded-2xl border border-border bg-card p-8"
			onsubmit={(e) => {
				e.preventDefault();
				if (!v.terms) { toastStore.show('You must accept the terms.', 'error'); return; }
				toastStore.show('Registration complete!', 'success');
			}}
		>
			<p class="text-lg font-bold text-foreground">Create Account</p>
			<div class="space-y-3 pt-1">
				<Checkbox
					bind:checked={v.terms}
					label="I agree to the terms of service"
					hint="Required to continue"
				/>
				<Checkbox
					bind:checked={v.marketing}
					label="I want to receive promotional emails"
					hint="You can unsubscribe at any time"
				/>
				<Checkbox
					bind:checked={v.notifications}
					label="Push notifications"
					hint="New content and follower notifications"
				/>
			</div>
			<Button type="submit" fullWidth>Sign Up</Button>
		</form>
	</div>
</section>

<!-- API Reference -->
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
	.preview-box-left { align-items: flex-start; justify-content: flex-start; }
</style>
