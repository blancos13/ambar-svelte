type Anim = 'none' | 'smooth' | 'spring' | 'elastic' | 'bounce' | 'snappy';
type Props = {
    value?: number;
    min?: number;
    max?: number;
    step?: number;
    label?: string;
    hint?: string;
    showValue?: boolean;
    disabled?: boolean;
    animation?: Anim;
    onchange?: (v: number) => void;
};
declare const Slider: import("svelte").Component<Props, {}, "value">;
type Slider = ReturnType<typeof Slider>;
export default Slider;
