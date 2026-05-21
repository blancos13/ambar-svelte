export type GlobeData = Record<string, number>;
type Props = {
    data?: GlobeData;
    colorFrom?: string;
    colorTo?: string;
    emptyColor?: string;
    size?: number;
    autoRotate?: boolean;
    speed?: number;
    class?: string;
};
declare const GlobeChart: import("svelte").Component<Props, {}, "">;
type GlobeChart = ReturnType<typeof GlobeChart>;
export default GlobeChart;
