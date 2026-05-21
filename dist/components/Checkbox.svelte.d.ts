type Props = {
    checked?: boolean;
    label?: string;
    hint?: string;
    disabled?: boolean;
    indeterminate?: boolean;
    onchange?: (v: boolean) => void;
};
declare const Checkbox: import("svelte").Component<Props, {}, "checked">;
type Checkbox = ReturnType<typeof Checkbox>;
export default Checkbox;
