import type { Snippet } from 'svelte';
type Props = {
    cols?: number | string;
    rows?: number | string;
    gap?: number | string;
    gapX?: number | string;
    gapY?: number | string;
    padding?: number | string;
    as?: string;
    class?: string;
    children: Snippet;
};
declare const Grid: import("svelte").Component<Props, {}, "">;
type Grid = ReturnType<typeof Grid>;
export default Grid;
