export type ToastVariant = 'default' | 'success' | 'error' | 'info';

export type ToastItem = {
	id: number;
	message: string;
	variant: ToastVariant;
};

function createToastStore() {
	let toasts = $state<ToastItem[]>([]);
	let nextId = 0;

	function show(message: string, variant: ToastVariant = 'default', duration = 2500) {
		const id = ++nextId;
		toasts = [...toasts, { id, message, variant }];
		setTimeout(() => {
			toasts = toasts.filter((t) => t.id !== id);
		}, duration);
	}

	function dismiss(id: number) {
		toasts = toasts.filter((t) => t.id !== id);
	}

	return {
		get toasts() {
			return toasts;
		},
		show,
		dismiss
	};
}

export const toastStore = createToastStore();
