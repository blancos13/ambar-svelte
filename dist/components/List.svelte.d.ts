import type { Snippet } from 'svelte';
export type ListItem = {
    id: string | number;
    label: string;
    description?: string;
    disabled?: boolean;
};
type Variant = 'default' | 'soft' | 'card';
type Density = 'compact' | 'default' | 'roomy';
type Columns = 1 | 2 | 3 | 4;
type Props = {
    items: ListItem[];
    variant?: Variant;
    density?: Density;
    columns?: Columns;
    animated?: boolean;
    onselect?: (item: ListItem) => void;
    children?: Snippet<[ListItem]>;
    class?: string;
};
declare const List: import("svelte").Component<Props, {}, "">;
type List = ReturnType<typeof List>;
export default List;
