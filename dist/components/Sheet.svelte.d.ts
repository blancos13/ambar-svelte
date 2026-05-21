import type { Snippet } from 'svelte';
type Size = 'sm' | 'md' | 'lg' | 'full';
type Props = {
    open: boolean;
    onClose: () => void;
    title?: string;
    size?: Size;
    children: Snippet;
    footer?: Snippet;
};
declare const Sheet: import("svelte").Component<Props, {}, "">;
type Sheet = ReturnType<typeof Sheet>;
export default Sheet;
