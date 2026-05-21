type Size = 'sm' | 'md' | 'lg';
type Props = {
    checked?: boolean;
    label?: string;
    hint?: string;
    size?: Size;
    disabled?: boolean;
    onchange?: (v: boolean) => void;
};
declare const Switch: import("svelte").Component<Props, {}, "checked">;
type Switch = ReturnType<typeof Switch>;
export default Switch;
