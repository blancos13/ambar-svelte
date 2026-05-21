type Shape = 'rect' | 'circle' | 'text';
type Animation = 'shimmer' | 'pulse' | 'wave' | 'blink' | 'glow' | 'none';
type Props = {
    shape?: Shape;
    animation?: Animation;
    width?: string;
    height?: string;
    radius?: string;
    lines?: number;
    delay?: number;
    style?: string;
    class?: string;
};
declare const Skeleton: import("svelte").Component<Props, {}, "">;
type Skeleton = ReturnType<typeof Skeleton>;
export default Skeleton;
