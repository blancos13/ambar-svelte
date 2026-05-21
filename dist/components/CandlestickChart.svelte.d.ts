export type Candle = {
    date: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume?: number;
};
type Props = {
    candles: Candle[];
    height?: number;
    volume?: boolean;
    grid?: boolean;
    class?: string;
};
declare const CandlestickChart: import("svelte").Component<Props, {}, "">;
type CandlestickChart = ReturnType<typeof CandlestickChart>;
export default CandlestickChart;
