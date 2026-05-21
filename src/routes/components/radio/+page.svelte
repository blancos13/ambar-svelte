<script lang="ts">
	import Radio      from '$lib/components/Radio.svelte';
	import RadioGroup from '$lib/components/RadioGroup.svelte';
	import CodeBlock  from '$lib/components/CodeBlock.svelte';
	import PropsTable from '$lib/components/PropsTable.svelte';

	/* ── demo state ── */
	let single      = $state<string | undefined>(undefined);
	let notify      = $state('all');
	let privacy     = $state('followers');
	let gender      = $state<string | undefined>(undefined);
	let plan        = $state('pro');
	let period      = $state('month');
	let viewMode    = $state('grid');
	let formPlan    = $state('pro');
	let formBilling = $state('annual');

	/* ── code snippets ── */
	const importCode = `import Radio      from '$lib/components/Radio.svelte';
import RadioGroup from '$lib/components/RadioGroup.svelte';`;

	const usageCode = `<script lang="ts">
  let picked = $state('email');
<\/script>

<Radio bind:group={picked} value="email" label="Email" hint="Sent to your address" />
<Radio bind:group={picked} value="sms"   label="SMS"   hint="Sent to your phone" />`;

	const groupCode = `<script lang="ts">
  let notify = $state('all');
<\/script>

<RadioGroup
  bind:value={notify}
  options={[
    { value: 'all',      label: 'All activity',  hint: 'Every like, comment and follow' },
    { value: 'mentions', label: 'Mentions only', hint: 'When someone tags you' },
    { value: 'none',     label: 'None',           hint: 'Completely silent' },
  ]}
/>`;

	const horizontalCode = `<RadioGroup
  bind:value={gender}
  orientation="horizontal"
  options={[
    { value: 'm',    label: 'Male' },
    { value: 'f',    label: 'Female' },
    { value: 'nb',   label: 'Non-binary' },
    { value: 'skip', label: 'Prefer not to say' },
  ]}
/>`;

	const cardCode = `<RadioGroup
  bind:value={plan}
  variant="card"
  options={[
    { value: 'free',     label: 'Free',     hint: '3 posts/day · basic analytics' },
    { value: 'pro',      label: 'Pro',      hint: 'Unlimited posts · advanced analytics' },
    { value: 'business', label: 'Business', hint: 'Everything in Pro · team workspace' },
  ]}
/>`;

	const buttonCode = `<RadioGroup
  bind:value={period}
  variant="button"
  options={[
    { value: 'day',   label: 'Day'   },
    { value: 'week',  label: 'Week'  },
    { value: 'month', label: 'Month' },
    { value: 'year',  label: 'Year'  },
  ]}
/>`;

	const disabledCode = `<RadioGroup
  value="standard"
  options={[
    { value: 'free',     label: 'Free',     disabled: true },
    { value: 'standard', label: 'Standard' },
    { value: 'business', label: 'Business', disabled: true },
  ]}
/>`;

	const radioProps = [
		{ name: 'value',    type: 'unknown',              description: 'The value this radio represents.' },
		{ name: 'group',    type: 'unknown',              default: 'undefined', description: 'Bindable — currently selected value. Matches checked state when equal to value.' },
		{ name: 'label',    type: 'string',               description: 'Label text rendered next to the radio circle.' },
		{ name: 'hint',     type: 'string',               description: 'Secondary helper text below the label.' },
		{ name: 'disabled', type: 'boolean',              default: 'false',     description: 'Prevents interaction and reduces opacity.' },
		{ name: 'onchange', type: '(v: unknown) => void', description: 'Callback fired when this radio is selected.' },
	];

	const radioGroupProps = [
		{ name: 'options',      type: 'Option[]',                               description: 'Array of { value, label, hint?, disabled? } objects.' },
		{ name: 'value',        type: 'unknown',                                default: 'undefined', description: 'Bindable — the currently selected value.' },
		{ name: 'variant',      type: "'default' | 'card' | 'button'",          default: "'default'", description: 'Visual style of the group.' },
		{ name: 'orientation',  type: "'vertical' | 'horizontal'",              default: "'vertical'", description: 'Layout direction of the options.' },
		{ name: 'onchange',     type: '(v: unknown) => void',                   description: 'Callback fired when selection changes.' },
		{ name: 'class',        type: 'string',                                 description: 'Extra CSS classes applied to the wrapper.' },
	];
</script>

<!-- Page header -->
<div class="comp-header">
	<div class="comp-header-top">
		<h1 class="comp-title">Radio / RadioGroup</h1>
	</div>
	<p class="comp-desc">
		Single-item radio button and a convenience RadioGroup component — supports default, card and button variants with vertical or horizontal orientation.
	</p>
</div>

<!-- ── IMPORT ── -->
<section class="doc-section">
	<h2 class="doc-section-title">Import</h2>
	<CodeBlock code={importCode} lang="ts" />
</section>

<!-- ── USAGE ── -->
<section class="doc-section">
	<h2 class="doc-section-title">Usage</h2>
	<p class="doc-section-desc">
		Use <code>Radio</code> directly with <code>bind:group</code>, or use <code>RadioGroup</code> for an options array.
	</p>
	<div class="preview-box" style="justify-content: flex-start;">
		<div class="flex flex-col gap-3">
			<Radio bind:group={single} value="email" label="Email"            hint="Sent to your registered address" />
			<Radio bind:group={single} value="sms"   label="SMS"              hint="Sent to your phone number" />
			<Radio bind:group={single} value="push"  label="Push notification" />
		</div>
	</div>
	<CodeBlock code={usageCode} lang="svelte" />
</section>

<!-- ── RADIOGROUP DEFAULT ── -->
<section class="doc-section">
	<h2 class="doc-section-title">RadioGroup — default variant</h2>
	<p class="doc-section-desc">Pass an <code>options</code> array and <code>bind:value</code>.</p>
	<div class="preview-box" style="justify-content: flex-start; gap: 3rem; flex-wrap: wrap;">
		<div>
			<p class="group-label">Notifications</p>
			<RadioGroup
				bind:value={notify}
				options={[
					{ value: 'all',      label: 'All activity',  hint: 'Every like, comment and follow' },
					{ value: 'mentions', label: 'Mentions only', hint: 'When someone tags you' },
					{ value: 'none',     label: 'None',          hint: 'Completely silent' },
				]}
			/>
		</div>
		<div>
			<p class="group-label">Who can see posts</p>
			<RadioGroup
				bind:value={privacy}
				options={[
					{ value: 'everyone',  label: 'Everyone' },
					{ value: 'followers', label: 'Followers' },
					{ value: 'private',   label: 'Only me' },
				]}
			/>
		</div>
	</div>
	<CodeBlock code={groupCode} lang="svelte" />
</section>

<!-- ── HORIZONTAL ── -->
<section class="doc-section">
	<h2 class="doc-section-title">Horizontal orientation</h2>
	<p class="doc-section-desc">Add <code>orientation="horizontal"</code> to lay options side by side.</p>
	<div class="preview-box" style="justify-content: flex-start;">
		<RadioGroup
			bind:value={gender}
			orientation="horizontal"
			options={[
				{ value: 'm',    label: 'Male' },
				{ value: 'f',    label: 'Female' },
				{ value: 'nb',   label: 'Non-binary' },
				{ value: 'skip', label: 'Prefer not to say' },
			]}
		/>
	</div>
	<CodeBlock code={horizontalCode} lang="svelte" />
</section>

<!-- ── DISABLED ── -->
<section class="doc-section">
	<h2 class="doc-section-title">Disabled</h2>
	<p class="doc-section-desc">Set <code>disabled: true</code> on individual options to prevent selection.</p>
	<div class="preview-box" style="justify-content: flex-start;">
		<RadioGroup
			value="standard"
			options={[
				{ value: 'free',     label: 'Free',     hint: 'Up to 3 posts/day',  disabled: true },
				{ value: 'standard', label: 'Standard', hint: 'Unlimited posts' },
				{ value: 'business', label: 'Business', hint: 'Team features',       disabled: true },
			]}
		/>
	</div>
	<CodeBlock code={disabledCode} lang="svelte" />
</section>

<!-- ── CARD VARIANT ── -->
<section class="doc-section">
	<h2 class="doc-section-title">Card variant</h2>
	<p class="doc-section-desc">Full-width cards with accent border when selected — great for plan pickers.</p>
	<div class="preview-box" style="justify-content: flex-start;">
		<div style="width: 100%; max-width: 22rem;">
			<RadioGroup
				bind:value={plan}
				variant="card"
				options={[
					{ value: 'free',     label: 'Free',     hint: '3 posts/day · basic analytics' },
					{ value: 'pro',      label: 'Pro',      hint: 'Unlimited posts · advanced analytics · scheduling' },
					{ value: 'business', label: 'Business', hint: 'Everything in Pro · team workspace · API access' },
				]}
			/>
		</div>
	</div>
	<CodeBlock code={cardCode} lang="svelte" />
</section>

<!-- ── CARD HORIZONTAL ── -->
<section class="doc-section">
	<h2 class="doc-section-title">Card — horizontal</h2>
	<p class="doc-section-desc">Cards laid side by side with <code>orientation="horizontal"</code>.</p>
	<div class="preview-box">
		<RadioGroup
			value="weekly"
			variant="card"
			orientation="horizontal"
			options={[
				{ value: 'daily',   label: 'Daily',   hint: 'Every day' },
				{ value: 'weekly',  label: 'Weekly',  hint: 'Once a week' },
				{ value: 'monthly', label: 'Monthly', hint: 'Once a month' },
			]}
		/>
	</div>
</section>

<!-- ── BUTTON / SEGMENTED ── -->
<section class="doc-section">
	<h2 class="doc-section-title">Button / Segmented</h2>
	<p class="doc-section-desc">Tab-bar style selector with <code>variant="button"</code>.</p>
	<div class="preview-box" style="flex-direction: column; align-items: flex-start; gap: 1rem;">
		<RadioGroup
			bind:value={period}
			variant="button"
			options={[
				{ value: 'day',   label: 'Day'   },
				{ value: 'week',  label: 'Week'  },
				{ value: 'month', label: 'Month' },
				{ value: 'year',  label: 'Year'  },
			]}
		/>
		<RadioGroup
			bind:value={viewMode}
			variant="button"
			options={[
				{ value: 'grid', label: 'Grid' },
				{ value: 'list', label: 'List' },
			]}
		/>
	</div>
	<CodeBlock code={buttonCode} lang="svelte" />
</section>

<!-- ── USE CASE ── -->
<section class="doc-section">
	<h2 class="doc-section-title">Example — plan selection form</h2>
	<p class="doc-section-desc">Combining card and button variants in a subscription upgrade form.</p>
	<div class="preview-box preview-box-accent">
		<div class="plan-card">
			<div>
				<p class="plan-title">Choose your plan</p>
				<p class="plan-sub">Upgrade or downgrade any time.</p>
			</div>
			<div>
				<p class="group-label">Billing</p>
				<RadioGroup
					bind:value={formBilling}
					variant="button"
					options={[
						{ value: 'monthly', label: 'Monthly' },
						{ value: 'annual',  label: 'Annual · 20% off' },
					]}
				/>
			</div>
			<div>
				<p class="group-label">Plan</p>
				<RadioGroup
					bind:value={formPlan}
					variant="card"
					options={[
						{ value: 'starter', label: 'Starter', hint: formBilling === 'annual' ? '$0 / year'    : '$0 / month'  },
						{ value: 'pro',     label: 'Pro',     hint: formBilling === 'annual' ? '$96 / year'   : '$10 / month' },
						{ value: 'team',    label: 'Team',    hint: formBilling === 'annual' ? '$240 / year'  : '$25 / month' },
					]}
				/>
			</div>
			<button class="plan-cta">
				Continue with {formPlan}
			</button>
		</div>
	</div>
</section>

<!-- ── API: Radio ── -->
<section class="doc-section">
	<h2 class="doc-section-title">API Reference — Radio</h2>
	<PropsTable props={radioProps} />
</section>

<!-- ── API: RadioGroup ── -->
<section class="doc-section">
	<h2 class="doc-section-title">API Reference — RadioGroup</h2>
	<PropsTable props={radioGroupProps} />
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
	.comp-badge {
		font-size: 0.65rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		background: color-mix(in srgb, var(--accent) 15%, transparent);
		color: var(--accent);
		border: 1px solid color-mix(in srgb, var(--accent) 30%, transparent);
		padding: 0.15rem 0.5rem;
		border-radius: 9999px;
	}
	.comp-desc {
		color: var(--muted-foreground);
		font-size: 0.9375rem;
		line-height: 1.6;
		margin-bottom: 1rem;
	}
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
		letter-spacing: -0.01em;
	}
	.doc-section-desc {
		font-size: 0.875rem;
		color: var(--muted-foreground);
		margin-top: -0.5rem;
	}
	.doc-section-desc code {
		font-family: ui-monospace, monospace;
		font-size: 0.8em;
		background: var(--muted);
		padding: 0.1rem 0.35rem;
		border-radius: 0.25rem;
		color: var(--accent);
	}
	.preview-box {
		padding: 2rem;
		border: 1px solid var(--border);
		border-radius: 0.875rem;
		background: var(--card);
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 6rem;
		flex-wrap: wrap;
		gap: 0.75rem;
	}
	.preview-box-accent {
		background: radial-gradient(ellipse 80% 60% at 50% 0%, color-mix(in srgb, var(--accent) 8%, transparent), transparent);
	}

	/* helpers */
	.group-label {
		font-size: 0.7rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.07em;
		color: var(--muted-foreground);
		margin-bottom: 0.6rem;
	}

	/* plan card */
	.plan-card {
		width: 100%;
		max-width: 22rem;
		border-radius: 1rem;
		border: 1px solid var(--border);
		background: var(--card);
		padding: 1.5rem;
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
	}
	.plan-title {
		font-size: 1rem;
		font-weight: 700;
		color: var(--foreground);
	}
	.plan-sub {
		font-size: 0.8125rem;
		color: var(--muted-foreground);
		margin-top: 0.15rem;
	}
	.plan-cta {
		width: 100%;
		border-radius: 0.5rem;
		background: var(--accent);
		color: var(--accent-foreground);
		padding: 0.625rem 1rem;
		font-size: 0.875rem;
		font-weight: 600;
		cursor: pointer;
		border: none;
		transition: opacity 0.15s;
		text-transform: capitalize;
	}
	.plan-cta:hover { opacity: 0.9; }
	.plan-cta:active { transform: scale(0.98); }
</style>
