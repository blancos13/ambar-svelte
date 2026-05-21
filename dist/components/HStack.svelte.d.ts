import type { Snippet } from 'svelte';
type Align = 'start' | 'center' | 'end' | 'stretch' | 'baseline';
type Justify = 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
type Props = {
    gap?: number | string;
    align?: Align;
    justify?: Justify;
    wrap?: boolean;
    padding?: number | string;
    as?: string;
    class?: string;
    children: Snippet;
};
declare const HStack: import("svelte").Component<Props, {}, "">;
type HStack = ReturnType<typeof HStack>;
export default HStack;
