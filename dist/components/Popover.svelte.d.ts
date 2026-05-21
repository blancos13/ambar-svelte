import type { Snippet } from 'svelte';
type Placement = 'top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end' | 'left' | 'right';
type Anim = 'scale' | 'slide' | 'elastic' | 'flip' | 'bounce' | 'zoom';
type Props = {
    open?: boolean;
    placement?: Placement;
    offset?: number;
    arrow?: boolean;
    animation?: Anim;
    trigger: Snippet<[{
        toggle: () => void;
        open: boolean;
    }]>;
    children: Snippet;
};
declare const Popover: import("svelte").Component<Props, {}, "open">;
type Popover = ReturnType<typeof Popover>;
export default Popover;
