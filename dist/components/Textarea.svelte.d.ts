type Props = {
    value?: string;
    label?: string;
    placeholder?: string;
    hint?: string;
    error?: string;
    disabled?: boolean;
    rows?: number;
    maxlength?: number;
    autoresize?: boolean;
    onvalue?: (v: string) => void;
    [key: string]: any;
};
declare const Textarea: import("svelte").Component<Props, {}, "value">;
type Textarea = ReturnType<typeof Textarea>;
export default Textarea;
