export type DonutSlice = {
    label: string;
    value: number;
    color?: string;
};
type Props = {
    slices: DonutSlice[];
    size?: number;
    thickness?: number;
    centerLabel?: string;
    centerValue?: string;
    class?: string;
};
declare const DonutChart: import("svelte").Component<Props, {}, "">;
type DonutChart = ReturnType<typeof DonutChart>;
export default DonutChart;
