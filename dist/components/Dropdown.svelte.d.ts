import type { Snippet } from 'svelte';
type Placement = 'bottom' | 'bottom-start' | 'bottom-end' | 'top' | 'top-start' | 'top-end';
type Anim = 'scale' | 'slide' | 'elastic' | 'bounce' | 'zoom';
export type DropdownItem = {
    type?: 'item' | 'divider' | 'label';
    label?: string;
    icon?: Snippet;
    shortcut?: string;
    hint?: string;
    danger?: boolean;
    disabled?: boolean;
    children?: DropdownItem[];
    onclick?: () => void;
};
type Props = {
    items: DropdownItem[];
    placement?: Placement;
    animation?: Anim;
    offset?: number;
    trigger: Snippet<[{
        toggle: () => void;
        open: boolean;
    }]>;
};
declare const Dropdown: import("svelte").Component<Props, {}, "">;
type Dropdown = ReturnType<typeof Dropdown>;
export default Dropdown;
