export type MapData = Record<string, number>;
type Props = {
    data?: MapData;
    mode?: 'pulse' | 'choropleth';
    pulseColor?: string;
    colorFrom?: string;
    colorTo?: string;
    label?: string;
    height?: number;
    class?: string;
};
declare const WorldMap: import("svelte").Component<Props, {}, "">;
type WorldMap = ReturnType<typeof WorldMap>;
export default WorldMap;
