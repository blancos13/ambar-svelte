type Props = {
    label?: string;
    initialPrice?: number;
    tickMs?: number;
    points?: number;
    height?: number;
    class?: string;
    /**
     * Live price feed (optional).
     * When provided, internal simulation stops and the chart animates
     * toward each new value you push — e.g. from a WebSocket or poll.
     * Set `tickMs` to match your feed interval for smooth animation.
     */
    latestPrice?: number;
};
declare const RealtimeLineChart: import("svelte").Component<Props, {}, "">;
type RealtimeLineChart = ReturnType<typeof RealtimeLineChart>;
export default RealtimeLineChart;
