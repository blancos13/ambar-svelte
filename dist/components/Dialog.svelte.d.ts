import type { Snippet } from 'svelte';
export type Variant = 'center' | 'bottom-sheet' | 'shrink' | 'fullscreen' | 'alert' | 'dropdown' | 'elastic' | 'flip' | 'rotate' | 'zoom' | 'slide-left' | 'slide-right' | 'fade-up' | 'newspaper' | 'swing' | 'morph';
type Props = {
    open: boolean;
    onClose: () => void;
    children: Snippet;
    variant?: Variant;
};
declare const Dialog: import("svelte").Component<Props, {}, "">;
type Dialog = ReturnType<typeof Dialog>;
export default Dialog;
