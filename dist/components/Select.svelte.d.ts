type Option = {
    value: string;
    label: string;
    icon?: string;
    disabled?: boolean;
};
type Group = {
    group: string;
    options: Option[];
};
type Anim = 'slide' | 'scale' | 'elastic' | 'fade' | 'flip';
type Props = {
    value?: string;
    options: (Option | Group)[];
    label?: string;
    placeholder?: string;
    hint?: string;
    error?: string;
    disabled?: boolean;
    searchable?: boolean;
    animation?: Anim;
    onvalue?: (v: string) => void;
};
declare const Select: import("svelte").Component<Props, {}, "value">;
type Select = ReturnType<typeof Select>;
export default Select;
