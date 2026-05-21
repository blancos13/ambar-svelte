function createToastStore() {
    let toasts = $state([]);
    let nextId = 0;
    function show(message, variant = 'default', duration = 2500) {
        const id = ++nextId;
        toasts = [...toasts, { id, message, variant }];
        setTimeout(() => {
            toasts = toasts.filter((t) => t.id !== id);
        }, duration);
    }
    function dismiss(id) {
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
