export type ThemeMode = 'light' | 'dark';
export type ThemeStyleId = 'classic' | 'sakura' | 'violet' | 'ocean' | 'gray' | 'mint';
export type ThemeStylePreset = {
    id: ThemeStyleId;
    label: string;
    swatch: {
        from: string;
        to: string;
    };
};
export declare const THEME_STYLE_PRESETS: ThemeStylePreset[];
export type AccentPreset = {
    id: string;
    label: string;
    base: string;
    hover: string;
    active: string;
    foreground: string;
};
export declare const ACCENT_PRESETS: AccentPreset[];
export type FontPreset = {
    id: string;
    label: string;
    family: string;
};
export declare const FONT_PRESETS: FontPreset[];
export type SidebarItemStyle = 'default' | 'filled' | 'ghost' | 'outline';
export type SidebarVariant = 'default' | 'floating' | 'inset';
export type SidebarCollapsible = 'icon' | 'offcanvas' | 'none';
export type SidebarActiveInd = 'bar' | 'track' | 'none';
export type SidebarAnimation = 'smooth' | 'snappy' | 'calm' | 'none';
export declare const themeStore: {
    readonly mode: ThemeMode;
    readonly styleId: ThemeStyleId;
    readonly accentId: string;
    readonly fontId: string;
    readonly accent: AccentPreset;
    readonly font: FontPreset;
    readonly sbItemStyle: SidebarItemStyle;
    readonly sbVariant: SidebarVariant;
    readonly sbCollapsible: SidebarCollapsible;
    readonly sbActiveIndicator: SidebarActiveInd;
    readonly sbAnimation: SidebarAnimation;
    setMode: (m: ThemeMode) => void;
    toggleMode: () => void;
    setStyle: (id: ThemeStyleId) => void;
    setAccent: (id: string) => void;
    setFont: (id: string) => void;
    setSbItemStyle: (v: SidebarItemStyle) => void;
    setSbVariant: (v: SidebarVariant) => void;
    setSbCollapsible: (v: SidebarCollapsible) => void;
    setSbActiveIndicator: (v: SidebarActiveInd) => void;
    setSbAnimation: (v: SidebarAnimation) => void;
    init: () => void;
};
