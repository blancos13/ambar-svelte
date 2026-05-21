import type { Snippet } from 'svelte';
type Side = 'left' | 'right' | 'top' | 'bottom';
type Size = 'sm' | 'md' | 'lg' | 'full';
type Props = {
    open: boolean;
    onClose: () => void;
    side?: Side;
    size?: Size;
    title?: string;
    children: Snippet;
    footer?: Snippet;
};
declare const Drawer: import("svelte").Component<Props, {}, "">;
type Drawer = ReturnType<typeof Drawer>;
export default Drawer;
