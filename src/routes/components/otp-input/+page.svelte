<script lang="ts">
	import OtpInput from '$lib/components/OtpInput.svelte';
	import Button from '$lib/components/Button.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import PropsTable from '$lib/components/PropsTable.svelte';
	import { toastStore } from '$lib/stores/toast.svelte';

	let otp1 = $state('');
	let otp2 = $state('');
	let otp2Error = $state('');
	let otp3 = $state('');

	function verify() {
		if (otp2.length < 6) { otp2Error = 'Please enter all 6 digits.'; return; }
		if (otp2 !== '123456') { otp2Error = 'Incorrect code. Please try again.'; return; }
		otp2Error = '';
		toastStore.show('Phone verified!', 'success');
	}

	const importCode = `import OtpInput from '$lib/components/OtpInput.svelte';`;

	const usageCode = `<script lang="ts">
  let otp = $state('');
<\/script>

<OtpInput bind:value={otp} />`;

	const verifyCode = `<script lang="ts">
  let otp = $state('');
  let error = $state('');

  function verify() {
    if (otp !== '123456') {
      error = 'Incorrect code.';
      return;
    }
    error = '';
    // success!
  }
<\/script>

<OtpInput bind:value={otp} {error} onComplete={() => error = ''} />
<Button onclick={verify}>Verify</Button>`;

	const props = [
		{ name: 'value',      type: 'string',              default: "''",    description: 'Bindable 6-digit OTP value.' },
		{ name: 'error',      type: 'string',              description: 'Error message shown below the input. Adds red ring.' },
		{ name: 'onComplete', type: '() => void',          description: 'Called when all 6 digits are filled.' },
		{ name: 'disabled',   type: 'boolean',             default: 'false', description: 'Disables all digit inputs.' },
		{ name: 'class',      type: 'string',              description: 'Extra CSS classes on the wrapper.' },
	];
</script>

<div class="comp-header">
	<div class="comp-header-top">
		<h1 class="comp-title">OTP Input</h1>
	</div>
	<p class="comp-desc">One-time password input with 6 individual digit fields. Auto-advances on input, supports paste, keyboard navigation, and error states.</p>
	<div class="comp-links">
		<a href="https://github.com/blancos13/ambar-svelte/blob/main/src/lib/components/OtpInput.svelte" target="_blank" rel="noreferrer" class="comp-link">
			<svg viewBox="0 0 24 24" fill="currentColor" class="size-3.5"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/></svg>
			Source
		</a>
	</div>
</div>

<section class="doc-section">
	<h2 class="doc-section-title">Import</h2>
	<CodeBlock code={importCode} lang="ts" />
</section>

<section class="doc-section">
	<h2 class="doc-section-title">Usage</h2>
	<div class="preview-box">
		<OtpInput bind:value={otp1} />
	</div>
	<CodeBlock code={usageCode} lang="svelte" />
</section>

<section class="doc-section">
	<h2 class="doc-section-title">Verification Flow</h2>
	<p class="doc-desc">The correct code is <code class="accent-code">123456</code>. Try an incorrect code to see the error state.</p>
	<div class="preview-box">
		<div class="flex flex-col items-center gap-5 w-full max-w-xs">
			<div class="text-center">
				<p class="text-base font-semibold text-foreground">Enter verification code</p>
				<p class="mt-1 text-sm text-muted-foreground">Sent to +1 (555) *** **42</p>
			</div>
			<OtpInput bind:value={otp2} error={otp2Error} onComplete={() => otp2Error = ''} />
			<Button fullWidth onclick={verify}>Verify</Button>
			<Button variant="ghost" size="sm" onclick={() => toastStore.show('Code resent', 'info')}>
				Resend code
			</Button>
		</div>
	</div>
	<CodeBlock code={verifyCode} lang="svelte" />
</section>

<section class="doc-section">
	<h2 class="doc-section-title">Error State</h2>
	<div class="preview-box">
		<OtpInput value="" error="Incorrect code. Please try again." />
	</div>
</section>

<section class="doc-section">
	<h2 class="doc-section-title">API Reference</h2>
	<PropsTable {props} />
</section>

<style>
	.comp-header {
		margin-bottom: 2.5rem;
		padding-bottom: 1.5rem;
		border-bottom: 1px solid var(--border);
	}
	.comp-header-top {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		margin-bottom: 0.5rem;
	}
	.comp-title {
		font-size: 1.875rem;
		font-weight: 800;
		letter-spacing: -0.025em;
		color: var(--foreground);
	}
	.comp-desc {
		color: var(--muted-foreground);
		font-size: 0.9375rem;
		line-height: 1.6;
		margin-bottom: 1rem;
	}
	.comp-links { display: flex; gap: 0.5rem; flex-wrap: wrap; }
	.comp-link {
		display: inline-flex;
		align-items: center;
		gap: 0.375rem;
		font-size: 0.78rem;
		font-weight: 600;
		color: var(--muted-foreground);
		background: var(--secondary);
		border: 1px solid var(--border);
		padding: 0.3rem 0.75rem;
		border-radius: 0.5rem;
		text-decoration: none;
		transition: color 0.15s, border-color 0.15s;
	}
	.comp-link:hover { color: var(--foreground); border-color: var(--foreground); }

	.doc-section {
		margin-bottom: 2.5rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
	.doc-section-title {
		font-size: 1.125rem;
		font-weight: 700;
		color: var(--foreground);
	}
	.doc-desc {
		font-size: 0.875rem;
		color: var(--muted-foreground);
		margin-top: -0.5rem;
	}
	.accent-code {
		font-family: ui-monospace, monospace;
		font-size: 0.85em;
		font-weight: 700;
		color: var(--accent);
	}
	.preview-box {
		padding: 2.5rem 2rem;
		border: 1px solid var(--border);
		border-radius: 0.875rem;
		background: var(--card);
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 6rem;
	}
</style>
