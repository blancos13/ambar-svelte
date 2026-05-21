export type ToastVariant = 'default' | 'success' | 'error' | 'info';
export type ToastItem = {
    id: number;
    message: string;
    variant: ToastVariant;
};
export declare const toastStore: {
    readonly toasts: ToastItem[];
    show: (message: string, variant?: ToastVariant, duration?: number) => void;
    dismiss: (id: number) => void;
};
