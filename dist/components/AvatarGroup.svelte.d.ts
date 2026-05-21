type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
type Shape = 'circle' | 'square';
type AvatarItem = {
    src?: string;
    name?: string;
};
type Props = {
    avatars: AvatarItem[];
    max?: number;
    size?: Size;
    shape?: Shape;
    overlap?: 'sm' | 'md' | 'lg';
};
declare const AvatarGroup: import("svelte").Component<Props, {}, "">;
type AvatarGroup = ReturnType<typeof AvatarGroup>;
export default AvatarGroup;
