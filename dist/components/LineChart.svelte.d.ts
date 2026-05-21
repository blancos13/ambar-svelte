export type LineSeries = {
    label: string;
    data: number[];
    color?: string;
    area?: boolean;
};
type Props = {
    labels: string[];
    series: LineSeries[];
    height?: number;
    smooth?: boolean;
    grid?: boolean;
    class?: string;
};
declare const LineChart: import("svelte").Component<Props, {}, "">;
type LineChart = ReturnType<typeof LineChart>;
export default LineChart;
