export type BarSeries = {
    label: string;
    data: number[];
    color?: string;
};
type Props = {
    labels: string[];
    series: BarSeries[];
    height?: number;
    grid?: boolean;
    stacked?: boolean;
    class?: string;
};
declare const BarChart: import("svelte").Component<Props, {}, "">;
type BarChart = ReturnType<typeof BarChart>;
export default BarChart;
