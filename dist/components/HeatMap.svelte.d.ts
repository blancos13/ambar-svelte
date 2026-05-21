type Props = {
    data?: Record<string, number>;
    label?: string;
    color?: string;
    cellSize?: number;
    gap?: number;
    class?: string;
};
declare const HeatMap: import("svelte").Component<Props, {}, "">;
type HeatMap = ReturnType<typeof HeatMap>;
export default HeatMap;
