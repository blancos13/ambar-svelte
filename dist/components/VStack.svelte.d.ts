import type { Snippet } from 'svelte';
type Align = 'start' | 'center' | 'end' | 'stretch' | 'baseline';
type Justify = 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
type Props = {
    gap?: number | string;
    align?: Align;
    justify?: Justify;
    padding?: number | string;
    as?: string;
    class?: string;
    children: Snippet;
};
declare const VStack: import("svelte").Component<Props, {}, "">;
type VStack = ReturnType<typeof VStack>;
export default VStack;
