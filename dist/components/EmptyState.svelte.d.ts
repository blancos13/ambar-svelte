import type { Snippet } from 'svelte';
type Preset = 'inbox' | 'search' | 'data' | 'folder' | 'users' | 'error' | 'custom';
type Size = 'sm' | 'md' | 'lg';
type Props = {
    preset?: Preset;
    title?: string;
    description?: string;
    action?: {
        label: string;
        onclick: () => void;
    };
    size?: Size;
    icon?: Snippet;
    children?: Snippet;
    class?: string;
};
declare const EmptyState: import("svelte").Component<Props, {}, "">;
type EmptyState = ReturnType<typeof EmptyState>;
export default EmptyState;
