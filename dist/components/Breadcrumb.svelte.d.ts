export type BreadcrumbItem = {
    label: string;
    href?: string;
    icon?: string;
};
type Separator = 'slash' | 'chevron' | 'dot' | 'arrow';
type Size = 'sm' | 'md' | 'lg';
type ItemStyle = 'plain' | 'soft' | 'pill';
type Props = {
    items: BreadcrumbItem[];
    separator?: Separator;
    size?: Size;
    itemStyle?: ItemStyle;
    maxVisible?: number;
    class?: string;
};
declare const Breadcrumb: import("svelte").Component<Props, {}, "">;
type Breadcrumb = ReturnType<typeof Breadcrumb>;
export default Breadcrumb;
