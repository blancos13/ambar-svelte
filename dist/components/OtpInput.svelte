<script lang="ts">
	type Props = {
		value?: string;
		length?: number;
		error?: string;
		onComplete?: (code: string) => void;
		onvalue?: (v: string) => void;
	};

	let { value = $bindable(''), length = 6, error, onComplete, onvalue }: Props = $props();

	let slots = $state<string[]>(Array(length).fill(''));
	let refs  = $state<HTMLInputElement[]>([]);

	$effect(() => {
		const chars = value.slice(0, length).split('');
		slots = Array(length).fill('').map((_, i) => chars[i] ?? '');
	});

	function sync(next: string[]) {
		slots = next;
		const joined = next.join('');
		value = joined;
		onvalue?.(joined);
		if (next.every(Boolean)) onComplete?.(joined);
	}

	function onInput(i: number, e: Event) {
		const raw = (e.target as HTMLInputElement).value;
		if (raw.length > 1) {
			const chars = raw.replace(/\D/g, '').slice(0, length);
			const next = [...slots];
			chars.split('').forEach((c, j) => { if (i + j < length) next[i + j] = c; });
			sync(next);
			refs[Math.min(i + chars.length, length - 1)]?.focus();
			return;
		}
		const char = raw.replace(/\D/g, '').slice(-1);
		const next = [...slots];
		next[i] = char;
		sync(next);
		if (char && i < length - 1) refs[i + 1]?.focus();
		(e.target as HTMLInputElement).value = char;
	}

	function onKeydown(i: number, e: KeyboardEvent) {
		if (e.key === 'Backspace') {
			if (slots[i]) { const n = [...slots]; n[i] = ''; sync(n); }
			else if (i > 0) { refs[i - 1]?.focus(); const n = [...slots]; n[i - 1] = ''; sync(n); }
		} else if (e.key === 'ArrowLeft'  && i > 0)            refs[i - 1]?.focus();
		  else if (e.key === 'ArrowRight' && i < length - 1)   refs[i + 1]?.focus();
	}

	function onPaste(e: ClipboardEvent) {
		e.preventDefault();
		const chars = (e.clipboardData?.getData('text') ?? '').replace(/\D/g, '').slice(0, length);
		const next = Array(length).fill('').map((_, i) => chars[i] ?? '');
		sync(next);
		refs[Math.min(chars.length, length - 1)]?.focus();
	}
</script>

<div class="flex flex-col items-center gap-3">
	<div class="flex gap-2">
		{#each Array(length) as _, i}
			<input
				bind:this={refs[i]}
				type="text"
				inputmode="numeric"
				maxlength="1"
				value={slots[i]}
				autocomplete="one-time-code"
				class="
					size-12 rounded-xl border-[1.5px] bg-muted text-center
					text-xl font-bold text-foreground caret-accent outline-none
					transition-all duration-150
					{slots[i]
						? 'border-[color-mix(in_srgb,var(--accent)_50%,transparent)] bg-[color-mix(in_srgb,var(--accent)_8%,var(--card))]'
						: 'border-transparent'}
					{error ? '!border-destructive' : ''}
					focus:scale-105 focus:border-accent focus:bg-card focus:shadow-[0_0_0_3px_color-mix(in_srgb,var(--accent)_20%,transparent)]
				"
				oninput={(e) => onInput(i, e)}
				onkeydown={(e) => onKeydown(i, e)}
				onfocus={(e) => (e.target as HTMLInputElement).select()}
				onpaste={onPaste}
				aria-label="Digit {i + 1}"
			/>
		{/each}
	</div>
	{#if error}
		<p class="text-[0.78rem] text-destructive">{error}</p>
	{/if}
</div>
