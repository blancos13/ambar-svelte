export type Prop = {
    name: string;
    type: string;
    default?: string;
    description: string;
    required?: boolean;
};
type Props = {
    props: Prop[];
    class?: string;
};
declare const PropsTable: import("svelte").Component<Props, {}, "">;
type PropsTable = ReturnType<typeof PropsTable>;
export default PropsTable;
