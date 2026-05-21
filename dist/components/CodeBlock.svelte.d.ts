type Props = {
    code: string;
    lang?: string;
    lineNumbers?: boolean;
    collapsible?: boolean;
    collapseLines?: number;
    filename?: string;
    class?: string;
};
declare const CodeBlock: import("svelte").Component<Props, {}, "">;
type CodeBlock = ReturnType<typeof CodeBlock>;
export default CodeBlock;
