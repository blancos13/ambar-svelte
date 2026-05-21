type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type Variant = 'ring' | 'ring-dual' | 'ring-split' | 'ring-track' | 'dots' | 'bounce' | 'pulse' | 'bars' | 'wave' | 'ripple' | 'orbit';
type Props = {
    size?: Size;
    variant?: Variant;
    color?: string;
};
declare const Spinner: import("svelte").Component<Props, {}, "">;
type Spinner = ReturnType<typeof Spinner>;
export default Spinner;
