<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Switch from '$lib/components/Switch.svelte';
	import CodeBlock  from '$lib/components/CodeBlock.svelte';
	import PropsTable from '$lib/components/PropsTable.svelte';
	import { toastStore } from '$lib/stores/toast.svelte';

	let v = $state({
		a: false, b: true, c: false,
		notif: true, sound: false, vibrate: true, darkmode: false, privacy: true,
	});

	const importCode = `import Switch from '$lib/components/Switch.svelte';`;

	const usageCode = `<Switch bind:checked={value} label="Enable notifications" />`;

	const basicCode = `<Switch bind:checked={value} label="Enable notifications" />
<Switch bind:checked={value} label="Dark mode" hint="Switch to dark theme" />
<Switch bind:checked={value} />`;

	const sizesCode = `<Switch bind:checked={value} size="sm" label="Small"  />
<Switch bind:checked={value} size="md" label="Medium" />
<Switch bind:checked={value} size="lg" label="Large"  />`;

	const disabledCode = `<Switch checked={false} label="Disabled (off)" disabled />
<Switch checked={true}  label="Disabled (on)"  disabled />`;

	const props = [
		{ name: 'checked',  type: 'boolean',              default: 'false', description: 'Bindable checked (on/off) state of the switch.' },
		{ name: 'label',    type: 'string',               description: 'Text label displayed next to the switch.' },
		{ name: 'hint',     type: 'string',               description: 'Secondary hint text shown below the label.' },
		{ name: 'size',     type: "'sm' | 'md' | 'lg'",   default: "'md'",  description: 'Size preset affecting the track and thumb dimensions.' },
		{ name: 'disabled', type: 'boolean',              default: 'false', description: 'Prevents interaction and reduces opacity.' },
		{ name: 'onchange', type: '(v: boolean) => void', description: 'Callback fired when the switch state changes.' },
	];
</script>

<!-- Header -->
<div class="comp-header">
	<div class="comp-header-top">
		<h1 class="comp-title">Switch</h1>
	</div>
	<p class="comp-desc">Toggle switch with spring animation, 3 sizes, label, hint, and disabled state.</p>
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
		<Switch bind:checked={v.a} label="Enable notifications" />
	</div>
	<CodeBlock code={usageCode} lang="svelte" />
</section>

<!-- Basic -->
<section class="doc-section">
	<h2 class="doc-section-title">Basic</h2>
	<p class="doc-section-desc">With label and optional hint text.</p>
	<div class="preview-box preview-box-left">
		<div class="flex flex-col gap-4 w-full max-w-sm">
			<Switch bind:checked={v.a} label="Enable notifications" />
			<Switch bind:checked={v.b} label="Dark mode" hint="Switch to dark theme" />
			<Switch bind:checked={v.c} />
		</div>
	</div>
	<CodeBlock code={basicCode} lang="svelte" />
</section>

<!-- Sizes -->
<section class="doc-section">
	<h2 class="doc-section-title">Sizes</h2>
	<p class="doc-section-desc">sm · md · lg</p>
	<div class="preview-box">
		<div class="flex items-center gap-6">
			<Switch bind:checked={v.a} size="sm" label="Small" />
			<Switch bind:checked={v.a} size="md" label="Medium" />
			<Switch bind:checked={v.a} size="lg" label="Large" />
		</div>
	</div>
	<CodeBlock code={sizesCode} lang="svelte" />
</section>

<!-- Disabled -->
<section class="doc-section">
	<h2 class="doc-section-title">Disabled</h2>
	<p class="doc-section-desc">Prevents interaction in both on and off states.</p>
	<div class="preview-box preview-box-left">
		<div class="flex flex-col gap-4 w-full max-w-sm">
			<Switch checked={false} label="Disabled (off)" disabled />
			<Switch checked={true}  label="Disabled (on)"  disabled />
		</div>
	</div>
	<CodeBlock code={disabledCode} lang="svelte" />
</section>

<!-- Use Case — Notification Settings -->
<section class="doc-section">
	<h2 class="doc-section-title">Use Case — Notification Settings</h2>
	<p class="doc-section-desc">Real-world settings panel with dependent controls.</p>
	<div class="preview-box">
		<div class="w-full max-w-sm overflow-hidden rounded-2xl border border-border bg-card">

			<div class="border-b border-border px-5 py-4">
				<p class="font-semibold text-foreground">Notifications</p>
			</div>

			<div class="divide-y divide-border">
				<div class="flex items-center justify-between px-5 py-4">
					<div>
						<p class="text-sm font-medium text-foreground">Push Notifications</p>
						<p class="text-xs text-muted-foreground">Enable or disable all notifications</p>
					</div>
					<Switch bind:checked={v.notif} />
				</div>

				<div class="flex items-center justify-between px-5 py-4 {!v.notif ? 'opacity-40 pointer-events-none' : ''}">
					<div>
						<p class="text-sm font-medium text-foreground">Notification Sound</p>
						<p class="text-xs text-muted-foreground">Play notification sound</p>
					</div>
					<Switch bind:checked={v.sound} disabled={!v.notif} />
				</div>

				<div class="flex items-center justify-between px-5 py-4 {!v.notif ? 'opacity-40 pointer-events-none' : ''}">
					<div>
						<p class="text-sm font-medium text-foreground">Vibration</p>
						<p class="text-xs text-muted-foreground">Vibrate in silent mode</p>
					</div>
					<Switch bind:checked={v.vibrate} disabled={!v.notif} />
				</div>
			</div>

			<div class="border-t border-border px-5 py-4">
				<p class="font-semibold text-foreground">Privacy</p>
			</div>

			<div class="divide-y divide-border">
				<div class="flex items-center justify-between px-5 py-4">
					<div>
						<p class="text-sm font-medium text-foreground">Dark Mode</p>
						<p class="text-xs text-muted-foreground">Switch to dark theme</p>
					</div>
					<Switch bind:checked={v.darkmode} />
				</div>

				<div class="flex items-center justify-between px-5 py-4">
					<div>
						<p class="text-sm font-medium text-foreground">Private Profile</p>
						<p class="text-xs text-muted-foreground">Hide your profile from others</p>
					</div>
					<Switch bind:checked={v.privacy} />
				</div>
			</div>

			<div class="border-t border-border px-5 py-4">
				<Button fullWidth onclick={() => toastStore.show('Settings saved!', 'success')}>
					Save
				</Button>
			</div>
		</div>
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
