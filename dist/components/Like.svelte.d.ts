type Props = {
    liked?: boolean;
    count?: number;
    showCount?: boolean;
    size?: 'sm' | 'md' | 'lg';
    onchange?: (liked: boolean) => void;
};
declare const Like: import("svelte").Component<Props, {}, "liked" | "count">;
type Like = ReturnType<typeof Like>;
export default Like;
