import type { Snippet } from 'svelte';
export type NavItem = {
    id: string;
    label: string;
    icon?: string;
    href?: string;
    badge?: string | number;
    disabled?: boolean;
    children?: NavItem[];
};
export type NavSection = {
    title?: string;
    items: NavItem[];
};
/**
 * variant      — shell appearance
 *   default    : card bg + right border
 *   floating   : card bg + shadow, no border
 *   inset      : transparent bg, no border (embed inside a layout)
 *
 * itemStyle    — nav item visual treatment
 *   default    : accent tint bg + accent text when active
 *   filled     : solid accent bg + accent-foreground text when active (bold)
 *   ghost      : accent text only, no background — minimal
 */
type Variant = 'default' | 'floating' | 'inset';
type ItemStyle = 'default' | 'filled' | 'outline' | 'ghost';
type ActiveIndicator = 'bar' | 'track' | 'none';
type AnimationMode = 'smooth' | 'snappy' | 'calm' | 'none';
type ViewportMode = 'auto' | 'desktop' | 'mobile';
type Collapsible = 'icon' | 'offcanvas' | 'none';
type Props = {
    sections: NavSection[];
    active?: string;
    collapsed?: boolean;
    open?: boolean;
    width?: number;
    variant?: Variant;
    itemStyle?: ItemStyle;
    activeIndicator?: ActiveIndicator;
    animation?: AnimationMode;
    mode?: ViewportMode;
    collapsible?: Collapsible;
    mobileContained?: boolean;
    hideHeader?: boolean;
    header?: Snippet<[{
        collapsed: boolean;
    }]>;
    footer?: Snippet<[{
        collapsed: boolean;
    }]>;
    onselect?: (id: string) => void;
    class?: string;
};
declare const Sidebar: import("svelte").Component<Props, {}, "open" | "active" | "collapsed">;
type Sidebar = ReturnType<typeof Sidebar>;
export default Sidebar;
