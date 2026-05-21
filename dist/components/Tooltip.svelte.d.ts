import type { Snippet } from 'svelte';
type Placement = 'top' | 'bottom' | 'left' | 'right' | 'top-start' | 'top-end' | 'bottom-start' | 'bottom-end';
type Props = {
    content: string | Snippet;
    placement?: Placement;
    delay?: number;
    offset?: number;
    disabled?: boolean;
    children: Snippet;
};
declare const Tooltip: import("svelte").Component<Props, {}, "">;
type Tooltip = ReturnType<typeof Tooltip>;
export default Tooltip;
