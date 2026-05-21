type Tab = {
    value: string;
    label: string;
    icon?: string;
    disabled?: boolean;
};
type Variant = 'line' | 'pill' | 'card';
type Anim = 'spring' | 'smooth' | 'snappy' | 'elastic' | 'bounce';
type Props = {
    value?: string;
    tabs: Tab[];
    variant?: Variant;
    animation?: Anim;
    fullWidth?: boolean;
    vertical?: boolean;
    onchange?: (v: string) => void;
};
declare const Tabs: import("svelte").Component<Props, {}, "value">;
type Tabs = ReturnType<typeof Tabs>;
export default Tabs;
