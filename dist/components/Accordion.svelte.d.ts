import type { Snippet } from 'svelte';
type Item = {
    value: string;
    title: string;
    hint?: string;
    icon?: Snippet;
    disabled?: boolean;
    children: Snippet;
};
type Variant = 'default' | 'card' | 'flush';
type Anim = 'smooth' | 'spring' | 'snappy' | 'elastic' | 'bounce';
type Props = {
    items: Item[];
    multiple?: boolean;
    variant?: Variant;
    animation?: Anim;
    defaultOpen?: string[];
};
declare const Accordion: import("svelte").Component<Props, {}, "">;
type Accordion = ReturnType<typeof Accordion>;
export default Accordion;
