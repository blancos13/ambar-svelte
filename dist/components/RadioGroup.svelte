<script lang="ts">
	type Option = {
		value:     unknown;
		label:     string;
		hint?:     string;
		disabled?: boolean;
	};

	type Variant     = 'default' | 'card' | 'button';
	type Orientation = 'vertical' | 'horizontal';

	type Props = {
		options:      Option[];
		value?:       unknown;   // $bindable
		variant?:     Variant;
		orientation?: Orientation;
		onchange?:    (v: unknown) => void;
		class?:       string;
	};

	let {
		options,
		value       = $bindable<unknown>(undefined),
		variant     = 'default',
		orientation = 'vertical',
		onchange,
		class: cls  = '',
	}: Props = $props();

	function select(v: unknown) {
		value = v;
		onchange?.(v);
	}
</script>

<!-- ── default: plain radio list ── -->
{#if variant === 'default'}
	<div
		class="flex {orientation === 'horizontal' ? 'flex-row flex-wrap gap-x-6 gap-y-3' : 'flex-col gap-3'} {cls}"
		role="radiogroup"
	>
		{#each options as opt}
			{@const checked = value === opt.value}
			<button
				type="button"
				role="radio"
				aria-checked={checked}
				disabled={opt.disabled}
				onclick={() => select(opt.value)}
				onkeydown={(e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); select(opt.value); } }}
				class="group flex items-start gap-3 text-left {opt.disabled ? 'pointer-events-none opacity-50' : ''}"
			>
				<span class="
					relative mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full
					transition-all duration-150 active:scale-90
					{checked
						? 'bg-accent'
						: 'bg-muted group-hover:bg-[color-mix(in_srgb,var(--muted)_80%,var(--border))]'}
				">
					{#if checked}
						<span class="rg-dot size-2 rounded-full bg-accent-foreground"></span>
					{/if}
				</span>
				<span class="flex flex-col gap-0.5">
					<span class="text-sm font-medium leading-snug text-foreground">{opt.label}</span>
					{#if opt.hint}
						<span class="text-xs text-muted-foreground">{opt.hint}</span>
					{/if}
				</span>
			</button>
		{/each}
	</div>

<!-- ── card: bordered card per option ── -->
{:else if variant === 'card'}
	<div
		class="flex {orientation === 'horizontal' ? 'flex-row flex-wrap' : 'flex-col'} gap-2 {cls}"
		role="radiogroup"
	>
		{#each options as opt}
			{@const checked = value === opt.value}
			<button
				type="button"
				role="radio"
				aria-checked={checked}
				disabled={opt.disabled}
				onclick={() => select(opt.value)}
				onkeydown={(e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); select(opt.value); } }}
				class="
					group relative flex w-full items-start gap-3 rounded-xl border p-4 text-left
					transition-all duration-150 active:scale-[0.99]
					{checked
						? 'border-accent bg-accent/8 shadow-sm'
						: 'border-border bg-card hover:border-muted-foreground/40 hover:bg-muted/40'}
					{opt.disabled ? 'pointer-events-none opacity-50' : ''}
				"
			>
				<!-- radio circle -->
				<span class="
					relative mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full
					transition-colors duration-150
					{checked ? 'bg-accent' : 'bg-muted'}
				">
					{#if checked}
						<span class="rg-dot size-2 rounded-full bg-accent-foreground"></span>
					{/if}
				</span>
				<span class="flex flex-col gap-0.5">
					<span class="text-sm font-medium text-foreground">{opt.label}</span>
					{#if opt.hint}
						<span class="text-xs text-muted-foreground">{opt.hint}</span>
					{/if}
				</span>
			</button>
		{/each}
	</div>

<!-- ── button: segmented control ── -->
{:else if variant === 'button'}
	<div
		class="inline-flex rounded-xl bg-muted p-1 gap-1 {cls}"
		role="radiogroup"
	>
		{#each options as opt}
			{@const checked = value === opt.value}
			<button
				type="button"
				role="radio"
				aria-checked={checked}
				disabled={opt.disabled}
				onclick={() => select(opt.value)}
				class="
					relative rounded-lg px-4 py-1.5 text-sm font-medium
					transition-all duration-150 active:scale-95
					{checked
						? 'bg-card text-foreground shadow-sm'
						: 'text-muted-foreground hover:text-foreground'}
					{opt.disabled ? 'pointer-events-none opacity-40' : ''}
				"
			>
				{opt.label}
			</button>
		{/each}
	</div>
{/if}

<style>
	.rg-dot {
		animation: rg-pop 0.22s cubic-bezier(0.34, 1.56, 0.64, 1) both;
	}
	@keyframes rg-pop {
		from { transform: scale(0); }
		to   { transform: scale(1); }
	}
</style>
