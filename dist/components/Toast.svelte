<script lang="ts">
	import { fly } from 'svelte/transition';
	import { expoOut } from 'svelte/easing';
	import { flip } from 'svelte/animate';
	import { toastStore, type ToastVariant } from '../stores/toast.svelte';

	const variantClasses: Record<ToastVariant, string> = {
		default: 'bg-card text-card-foreground',
		success: 'bg-accent text-accent-foreground',
		error:   'bg-destructive text-destructive-foreground',
		info:    'bg-card text-card-foreground border border-border',
	};
</script>

<div
	class="pointer-events-none fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 flex-col items-center gap-2"
>
	{#each toastStore.toasts as toast (toast.id)}
		<div
			animate:flip={{ duration: 200 }}
			in:fly={{ y: 30, duration: 250, easing: expoOut }}
			out:fly={{ y: 20, duration: 180, easing: expoOut }}
			class="pointer-events-auto rounded-xl px-5 py-3 text-sm font-medium shadow-2xl {variantClasses[
				toast.variant
			]}"
		>
			{toast.message}
		</div>
	{/each}
</div>
