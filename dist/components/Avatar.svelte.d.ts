type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
type Shape = 'circle' | 'square';
type Status = 'online' | 'away' | 'busy' | 'offline' | 'none';
type Props = {
    src?: string;
    name?: string;
    size?: Size;
    shape?: Shape;
    status?: Status;
    class?: string;
};
declare const Avatar: import("svelte").Component<Props, {}, "">;
type Avatar = ReturnType<typeof Avatar>;
export default Avatar;
