type Props = {
    value?: string;
    length?: number;
    error?: string;
    onComplete?: (code: string) => void;
    onvalue?: (v: string) => void;
};
declare const OtpInput: import("svelte").Component<Props, {}, "value">;
type OtpInput = ReturnType<typeof OtpInput>;
export default OtpInput;
