type Option = {
    value: unknown;
    label: string;
    hint?: string;
    disabled?: boolean;
};
type Variant = 'default' | 'card' | 'button';
type Orientation = 'vertical' | 'horizontal';
type Props = {
    options: Option[];
    value?: unknown;
    variant?: Variant;
    orientation?: Orientation;
    onchange?: (v: unknown) => void;
    class?: string;
};
declare const RadioGroup: import("svelte").Component<Props, {}, "value">;
type RadioGroup = ReturnType<typeof RadioGroup>;
export default RadioGroup;
