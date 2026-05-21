type Props = {
    value: unknown;
    group?: unknown;
    label?: string;
    hint?: string;
    disabled?: boolean;
    onchange?: (v: unknown) => void;
};
declare const Radio: import("svelte").Component<Props, {}, "group">;
type Radio = ReturnType<typeof Radio>;
export default Radio;
