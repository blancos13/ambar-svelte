type Size = 'xs' | 'sm' | 'md' | 'lg';
type Variant = 'accent' | 'success' | 'warning' | 'danger' | 'info';
type Anim = 'smooth' | 'spring' | 'bounce' | 'none';
type Props = {
    value?: number;
    max?: number;
    size?: Size;
    variant?: Variant;
    animation?: Anim;
    striped?: boolean;
    indeterminate?: boolean;
    label?: string;
    showValue?: boolean;
    class?: string;
};
declare const Progress: import("svelte").Component<Props, {}, "">;
type Progress = ReturnType<typeof Progress>;
export default Progress;
