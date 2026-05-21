import type { Snippet } from 'svelte';
type Variant = 'display' | 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'body-sm' | 'caption' | 'label' | 'code' | 'quote';
type Weight = 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold';
type Align = 'left' | 'center' | 'right';
type Color = 'default' | 'muted' | 'accent' | 'destructive';
type Props = {
    variant?: Variant;
    weight?: Weight;
    align?: Align;
    color?: Color;
    truncate?: boolean;
    children: Snippet;
};
declare const Text: import("svelte").Component<Props, {}, "">;
type Text = ReturnType<typeof Text>;
export default Text;
