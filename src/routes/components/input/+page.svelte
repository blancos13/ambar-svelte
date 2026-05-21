<script lang="ts">
	import Input from '$lib/components/Input.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import PropsTable from '$lib/components/PropsTable.svelte';

	let v = $state({
		basic: '',
		email: '',
		pass: '',
		search: '',
		num: '',
		prefix: '',
		suffix: '',
		iconUser: '',
		iconEmail: '',
		iconPass: '',
		iconTel: '',
		errorVal: 'wrong@',
		disabledVal: '@ambarui',
		hint: '',
		loginEmail: '',
		loginPass: '',
	});

	const importCode = `import Input from '$lib/components/Input.svelte';`;

	const usageCode = `<Input bind:value label="Email" placeholder="name@example.com" />`;

	const typesCode = `<Input bind:value label="Username" placeholder="username" clearable />
<Input bind:value label="Email" type="email" placeholder="name@example.com" clearable />
<Input bind:value label="Password" type="password" placeholder="••••••••" />
<Input bind:value type="search" placeholder="Search..." clearable />
<Input bind:value label="Amount" type="number" placeholder="0.00" />`;

	const prefixSuffixCode = `<Input bind:value label="Website" placeholder="site.com" prefix="https://" />
<Input bind:value label="Price" type="number" placeholder="0.00" suffix="USD" />`;

	const iconsCode = `<Input label="Username" placeholder="username">
  {#snippet start()}
    <svg class="size-4" .../>
  {/snippet}
</Input>

<Input label="Phone" type="tel" placeholder="+1 5__ ...">
  {#snippet start()}
    <svg class="size-4" .../>
  {/snippet}
  {#snippet end()}
    <span class="...">US</span>
  {/snippet}
</Input>`;

	const statesCode = `<!-- Error -->
<Input label="Email" type="email" value="wrong@" error="Invalid email address." />

<!-- Disabled -->
<Input label="Username" value="@ambarui" disabled />`;

	const hintCode = `<Input bind:value label="Username" placeholder="username" hint="Visible to everyone" />
<Input bind:value label="Password" type="password" hint="Minimum 8 characters" />`;

	const loginCode = `<form onsubmit={handleSubmit} class="space-y-4">
  <Input bind:value={email} label="Email" type="email" placeholder="name@example.com" clearable>
    {#snippet start()}
      <svg class="size-4" .../>
    {/snippet}
  </Input>

  <Input bind:value={pass} label="Password" type="password" placeholder="••••••••">
    {#snippet start()}
      <svg class="size-4" .../>
    {/snippet}
  </Input>

  <Button type="submit" fullWidth>Sign in</Button>
</form>`;

	const props = [
		{ name: 'value',       type: 'string',                                                                                          default: "''",         description: 'Bindable input value.' },
		{ name: 'type',        type: "'text' | 'email' | 'password' | 'search' | 'url' | 'tel' | 'number'",                            default: "'text'",     description: 'HTML input type.' },
		{ name: 'label',       type: 'string',                                                                                                                 description: 'Floating label text shown above the field.' },
		{ name: 'placeholder', type: 'string',                                                                                          default: "''",         description: 'Placeholder text when the field is empty.' },
		{ name: 'hint',        type: 'string',                                                                                                                 description: 'Helper text shown below the input.' },
		{ name: 'error',       type: 'string',                                                                                                                 description: 'Error message. When set, the field turns red.' },
		{ name: 'disabled',    type: 'boolean',                                                                                         default: 'false',      description: 'Prevents interaction and dims the field.' },
		{ name: 'clearable',   type: 'boolean',                                                                                         default: 'false',      description: 'Shows an X button to clear the value.' },
		{ name: 'prefix',      type: 'string',                                                                                                                 description: 'Text displayed inside the field before the value (e.g. "https://").' },
		{ name: 'suffix',      type: 'string',                                                                                                                 description: 'Text displayed inside the field after the value (e.g. "USD").' },
		{ name: 'start',       type: 'Snippet',                                                                                                                description: 'Snippet rendered at the left side of the input (icon slot).' },
		{ name: 'end',         type: 'Snippet',                                                                                                                description: 'Snippet rendered at the right side of the input (icon slot).' },
		{ name: 'onvalue',     type: '(v: string) => void',                                                                                                    description: 'Called whenever the value changes.' },
	];
</script>

<!-- Page header -->
<div class="comp-header">
	<div class="comp-header-top">
		<h1 class="comp-title">Input</h1>
	</div>
	<p class="comp-desc">Text input with floating label, clearable, prefix/suffix, icon slots, error and disabled states.</p>
</div>

<!-- ── IMPORT ── -->
<section class="doc-section">
	<h2 class="doc-section-title">Import</h2>
	<CodeBlock code={importCode} lang="ts" />
</section>

<!-- ── USAGE ── -->
<section class="doc-section">
	<h2 class="doc-section-title">Usage</h2>
	<div class="preview-box">
		<div style="width: 100%; max-width: 20rem;">
			<Input bind:value={v.basic} label="Email" placeholder="name@example.com" />
		</div>
	</div>
	<CodeBlock code={usageCode} lang="svelte" />
</section>

<!-- ── TYPES ── -->
<section class="doc-section">
	<h2 class="doc-section-title">Types</h2>
	<p class="doc-section-desc">Supports <code>text</code>, <code>email</code>, <code>password</code>, <code>search</code>, and <code>number</code>. The <code>password</code> type adds a show/hide toggle automatically.</p>
	<div class="preview-box" style="align-items: flex-start;">
		<div class="input-grid">
			<Input bind:value={v.basic}  label="Username"  placeholder="username"           clearable />
			<Input bind:value={v.email}  label="Email"     placeholder="name@example.com"   type="email"  clearable />
			<Input bind:value={v.pass}   label="Password"  placeholder="••••••••"           type="password" />
			<Input bind:value={v.search} type="search"     placeholder="Search..."           clearable />
			<Input bind:value={v.num}    label="Amount"    placeholder="0.00"               type="number" />
		</div>
	</div>
	<CodeBlock code={typesCode} lang="svelte" />
</section>

<!-- ── PREFIX & SUFFIX ── -->
<section class="doc-section">
	<h2 class="doc-section-title">Prefix &amp; Suffix</h2>
	<p class="doc-section-desc">Use <code>prefix</code> and <code>suffix</code> for inline text decorators like units or protocol strings.</p>
	<div class="preview-box" style="align-items: flex-start;">
		<div class="input-grid">
			<Input bind:value={v.prefix} label="Website" placeholder="site.com" prefix="https://" />
			<Input bind:value={v.suffix} label="Price"   placeholder="0.00"     suffix="USD" type="number" />
		</div>
	</div>
	<CodeBlock code={prefixSuffixCode} lang="svelte" />
</section>

<!-- ── WITH ICONS ── -->
<section class="doc-section">
	<h2 class="doc-section-title">With Icons</h2>
	<p class="doc-section-desc">Use the <code>start</code> and <code>end</code> snippet slots to place icons inside the field.</p>
	<div class="preview-box" style="align-items: flex-start;">
		<div class="input-grid">
			<Input bind:value={v.iconUser} label="Username" placeholder="username">
				{#snippet start()}
					<svg class="size-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
						<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
					</svg>
				{/snippet}
			</Input>

			<Input bind:value={v.iconPass} label="Password" type="password" placeholder="••••••••">
				{#snippet start()}
					<svg class="size-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
						<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
					</svg>
				{/snippet}
			</Input>

			<Input bind:value={v.iconEmail} label="Email" type="email" placeholder="name@example.com" clearable>
				{#snippet start()}
					<svg class="size-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
						<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
					</svg>
				{/snippet}
			</Input>

			<Input bind:value={v.iconTel} label="Phone" type="tel" placeholder="+1 5__ ___ __ __">
				{#snippet start()}
					<svg class="size-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
						<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
					</svg>
				{/snippet}
				{#snippet end()}
					<span class="rounded-md bg-accent px-2 py-0.5 text-xs font-bold text-accent-foreground">US</span>
				{/snippet}
			</Input>
		</div>
	</div>
	<CodeBlock code={iconsCode} lang="svelte" />
</section>

<!-- ── STATES ── -->
<section class="doc-section">
	<h2 class="doc-section-title">States</h2>
	<p class="doc-section-desc">Pass <code>error</code> to show an inline error message. <code>disabled</code> prevents interaction.</p>
	<div class="preview-box" style="align-items: flex-start;">
		<div class="input-grid">
			<Input label="Email" type="email" value={v.errorVal} error="Invalid email address." />
			<Input label="Username" value={v.disabledVal} disabled />
		</div>
	</div>
	<CodeBlock code={statesCode} lang="svelte" />
</section>

<!-- ── HINT ── -->
<section class="doc-section">
	<h2 class="doc-section-title">Hint</h2>
	<p class="doc-section-desc">The <code>hint</code> prop shows helper text below the field when there is no error.</p>
	<div class="preview-box" style="align-items: flex-start;">
		<div class="input-grid">
			<Input bind:value={v.hint} label="Username" placeholder="username" hint="Visible to everyone" />
			<Input label="Password" type="password" placeholder="••••••••" hint="Minimum 8 characters" />
		</div>
	</div>
	<CodeBlock code={hintCode} lang="svelte" />
</section>

<!-- ── USE CASE ── -->
<section class="doc-section">
	<h2 class="doc-section-title">Use Case — Sign-in Form</h2>
	<p class="doc-section-desc">A realistic sign-in form combining icon slots, types, and a submit button.</p>
	<div class="preview-box">
		<form class="form-card" onsubmit={(e) => e.preventDefault()}>
			<div class="form-card-header">
				<p class="form-card-title">Sign in</p>
				<p class="form-card-sub">Welcome back</p>
			</div>

			<Input bind:value={v.loginEmail} label="Email" type="email" placeholder="name@example.com" clearable>
				{#snippet start()}
					<svg class="size-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
						<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
					</svg>
				{/snippet}
			</Input>

			<Input bind:value={v.loginPass} label="Password" type="password" placeholder="••••••••">
				{#snippet start()}
					<svg class="size-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
						<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
					</svg>
				{/snippet}
			</Input>

			<button type="submit" class="form-submit-btn">Sign in</button>
		</form>
	</div>
	<CodeBlock code={loginCode} lang="svelte" />
</section>

<!-- ── API REFERENCE ── -->
<section class="doc-section">
	<h2 class="doc-section-title">API Reference</h2>
	<PropsTable {props} />
</section>

<style>
	.comp-header { margin-bottom: 2.5rem; padding-bottom: 1.5rem; border-bottom: 1px solid var(--border); }
	.comp-header-top { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.5rem; }
	.comp-title { font-size: 1.875rem; font-weight: 800; letter-spacing: -0.025em; color: var(--foreground); }
	.comp-desc { color: var(--muted-foreground); font-size: 0.9375rem; line-height: 1.6; margin-bottom: 1rem; }
	.doc-section { margin-bottom: 2.5rem; display: flex; flex-direction: column; gap: 1rem; }
	.doc-section-title { font-size: 1.125rem; font-weight: 700; color: var(--foreground); letter-spacing: -0.01em; }
	.doc-section-desc { font-size: 0.875rem; color: var(--muted-foreground); margin-top: -0.5rem; }
	.doc-section-desc code { font-family: ui-monospace, monospace; font-size: 0.8em; background: var(--muted); padding: 0.1rem 0.35rem; border-radius: 0.25rem; color: var(--accent); }
	.preview-box { padding: 2rem; border: 1px solid var(--border); border-radius: 0.875rem; background: var(--card); display: flex; align-items: center; justify-content: center; min-height: 6rem; flex-wrap: wrap; gap: 0.75rem; }

	.input-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(16rem, 1fr));
		gap: 1rem;
		width: 100%;
	}

	.form-card {
		width: 100%;
		max-width: 22rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		border: 1px solid var(--border);
		border-radius: 1rem;
		background: var(--background);
		padding: 2rem;
	}

	.form-card-header {
		text-align: center;
		margin-bottom: 0.25rem;
	}

	.form-card-title {
		font-size: 1.125rem;
		font-weight: 700;
		color: var(--foreground);
	}

	.form-card-sub {
		font-size: 0.875rem;
		color: var(--muted-foreground);
		margin-top: 0.125rem;
	}

	.form-submit-btn {
		width: 100%;
		padding: 0.625rem 1rem;
		border-radius: 0.625rem;
		background: var(--accent);
		color: var(--accent-foreground);
		font-weight: 600;
		font-size: 0.875rem;
		border: none;
		cursor: pointer;
		transition: opacity 0.15s;
	}

	.form-submit-btn:hover {
		opacity: 0.9;
	}
</style>
