type Props = {
    data: number[];
    width?: number;
    height?: number;
    color?: string;
    area?: boolean;
    value?: boolean;
    minmax?: boolean;
    class?: string;
};
declare const Sparkline: import("svelte").Component<Props, {}, "">;
type Sparkline = ReturnType<typeof Sparkline>;
export default Sparkline;
