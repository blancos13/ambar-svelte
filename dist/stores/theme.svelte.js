import { browser } from '$app/environment';
export const THEME_STYLE_PRESETS = [
    { id: 'classic', label: 'Classic', swatch: { from: '#f4f4f5', to: '#d4d4d8' } },
    { id: 'sakura', label: 'Sakura', swatch: { from: '#fcd1de', to: '#eb85ab' } },
    { id: 'violet', label: 'Violet', swatch: { from: '#8b5cf6', to: '#6366f1' } },
    { id: 'ocean', label: 'Ocean', swatch: { from: '#8db2d1', to: '#132b3a' } },
    { id: 'gray', label: 'Gray', swatch: { from: '#9ca3af', to: '#1f2937' } },
    { id: 'mint', label: 'Mint', swatch: { from: '#67d5b0', to: '#1f7a61' } }
];
const ACCENT_DEFS = [
    { id: 'bright-green', label: 'Bright Green', h: 102, s: 100, l: 67 },
    { id: 'blue', label: 'Blue', h: 210, s: 100, l: 50 },
    { id: 'purple', label: 'Purple', h: 267, s: 84, l: 60 },
    { id: 'red', label: 'Red', h: 0, s: 84, l: 60 },
    { id: 'amber', label: 'Amber', h: 38, s: 92, l: 50 },
    { id: 'emerald', label: 'Emerald', h: 160, s: 84, l: 39 },
    { id: 'rose', label: 'Rose', h: 330, s: 80, l: 60 },
    { id: 'cyan', label: 'Cyan', h: 190, s: 90, l: 50 },
    { id: 'orange', label: 'Orange', h: 24, s: 95, l: 50 },
    { id: 'indigo', label: 'Indigo', h: 250, s: 95, l: 65 },
    { id: 'teal', label: 'Teal', h: 180, s: 70, l: 40 },
    { id: 'gold', label: 'Gold', h: 40, s: 100, l: 50 }
];
const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
const hsl = (h, s, l) => `hsl(${h} ${s}% ${l}%)`;
const accentFg = (l) => (l >= 62 ? '#0d0f14' : '#ffffff');
export const ACCENT_PRESETS = ACCENT_DEFS.map((d) => ({
    id: d.id,
    label: d.label,
    base: hsl(d.h, d.s, d.l),
    hover: hsl(d.h, d.s, clamp(d.l - 6, 18, 92)),
    active: hsl(d.h, d.s, clamp(d.l - 12, 14, 88)),
    foreground: accentFg(d.l)
}));
export const FONT_PRESETS = [
    { id: 'system', label: 'System', family: 'ui-sans-serif, system-ui, -apple-system, sans-serif' },
    { id: 'inter', label: 'Inter', family: "'Inter', sans-serif" },
    { id: 'dm-sans', label: 'DM Sans', family: "'DM Sans', sans-serif" },
    { id: 'plus-jakarta', label: 'Plus Jakarta Sans', family: "'Plus Jakarta Sans', sans-serif" },
    { id: 'outfit', label: 'Outfit', family: "'Outfit', sans-serif" },
    { id: 'sora', label: 'Sora', family: "'Sora', sans-serif" },
    { id: 'manrope', label: 'Manrope', family: "'Manrope', sans-serif" },
    { id: 'poppins', label: 'Poppins', family: "'Poppins', sans-serif" },
    { id: 'urbanist', label: 'Urbanist', family: "'Urbanist', sans-serif" }
];
// ═══════════════════════════════════════════════════
// Cookie helpers
// ═══════════════════════════════════════════════════
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;
function setCookie(key, value) {
    if (!browser)
        return;
    document.cookie = `${key}=${value}; path=/; max-age=${COOKIE_MAX_AGE}; samesite=lax`;
}
function getCookie(key) {
    if (!browser)
        return null;
    const match = document.cookie.match(new RegExp(`(?:^|; )${key}=([^;]*)`));
    return match ? decodeURIComponent(match[1]) : null;
}
function getStorage(key) {
    if (!browser)
        return null;
    try {
        return localStorage.getItem(key);
    }
    catch {
        return null;
    }
}
function setStorage(key, value) {
    if (!browser)
        return;
    try {
        localStorage.setItem(key, value);
    }
    catch { }
}
// ═══════════════════════════════════════════════════
// Store (Svelte 5 runes)
// ═══════════════════════════════════════════════════
function createThemeStore() {
    const savedMode = getStorage('ui-theme') ?? getCookie('ui-theme');
    const savedStyle = getStorage('ui-theme-style') ?? getCookie('ui-theme-style');
    const savedAccent = getStorage('ui-accent') ?? getCookie('ui-accent');
    const savedFont = getStorage('ui-font') ?? getCookie('ui-font');
    const savedSbItem = getStorage('ui-sb-item') ?? getCookie('ui-sb-item');
    const savedSbVariant = getStorage('ui-sb-variant') ?? getCookie('ui-sb-variant');
    const savedSbCollapse = getStorage('ui-sb-collapsible') ?? getCookie('ui-sb-collapsible');
    const savedSbActiveInd = getStorage('ui-sb-active-ind') ?? getCookie('ui-sb-active-ind');
    const savedSbAnim = getStorage('ui-sb-animation') ?? getCookie('ui-sb-animation');
    let mode = $state(savedMode || 'light');
    let styleId = $state(savedStyle || 'classic');
    let accentId = $state(savedAccent || 'blue');
    let fontId = $state(savedFont || 'system');
    let sbItemStyle = $state(savedSbItem || 'ghost');
    let sbVariant = $state(savedSbVariant || 'default');
    let sbCollapsible = $state(savedSbCollapse || 'none');
    let sbActiveIndicator = $state(savedSbActiveInd || 'track');
    let sbAnimation = $state(savedSbAnim || 'smooth');
    const accent = $derived(ACCENT_PRESETS.find((p) => p.id === accentId) ?? ACCENT_PRESETS[0]);
    const font = $derived(FONT_PRESETS.find((p) => p.id === fontId) ?? FONT_PRESETS[0]);
    function apply() {
        if (!browser)
            return;
        const root = document.documentElement;
        root.classList.toggle('dark', mode === 'dark');
        if (styleId === 'classic') {
            root.removeAttribute('data-theme-style');
        }
        else {
            root.setAttribute('data-theme-style', styleId);
        }
        root.style.setProperty('--accent', accent.base);
        root.style.setProperty('--accent-hover', accent.hover);
        root.style.setProperty('--accent-active', accent.active);
        root.style.setProperty('--accent-foreground', accent.foreground);
        root.style.setProperty('--font-selected', font.family);
        setCookie('ui-theme', mode);
        setStorage('ui-theme', mode);
        setCookie('ui-theme-style', styleId);
        setStorage('ui-theme-style', styleId);
        setCookie('ui-accent', accentId);
        setStorage('ui-accent', accentId);
        setCookie('ui-font', fontId);
        setStorage('ui-font', fontId);
        setCookie('ui-sb-item', sbItemStyle);
        setStorage('ui-sb-item', sbItemStyle);
        setCookie('ui-sb-variant', sbVariant);
        setStorage('ui-sb-variant', sbVariant);
        setCookie('ui-sb-collapsible', sbCollapsible);
        setStorage('ui-sb-collapsible', sbCollapsible);
        setCookie('ui-sb-active-ind', sbActiveIndicator);
        setStorage('ui-sb-active-ind', sbActiveIndicator);
        setCookie('ui-sb-animation', sbAnimation);
        setStorage('ui-sb-animation', sbAnimation);
    }
    function setMode(m) { mode = m; apply(); }
    function toggleMode() { setMode(mode === 'dark' ? 'light' : 'dark'); }
    function setStyle(id) { styleId = id; apply(); }
    function setAccent(id) { accentId = id; apply(); }
    function setFont(id) { fontId = id; apply(); }
    function setSbItemStyle(v) { sbItemStyle = v; apply(); }
    function setSbVariant(v) { sbVariant = v; apply(); }
    function setSbCollapsible(v) { sbCollapsible = v; apply(); }
    function setSbActiveIndicator(v) { sbActiveIndicator = v; apply(); }
    function setSbAnimation(v) { sbAnimation = v; apply(); }
    function init() { apply(); }
    return {
        get mode() { return mode; },
        get styleId() { return styleId; },
        get accentId() { return accentId; },
        get fontId() { return fontId; },
        get accent() { return accent; },
        get font() { return font; },
        get sbItemStyle() { return sbItemStyle; },
        get sbVariant() { return sbVariant; },
        get sbCollapsible() { return sbCollapsible; },
        get sbActiveIndicator() { return sbActiveIndicator; },
        get sbAnimation() { return sbAnimation; },
        setMode, toggleMode, setStyle, setAccent, setFont,
        setSbItemStyle, setSbVariant, setSbCollapsible, setSbActiveIndicator, setSbAnimation,
        init
    };
}
export const themeStore = createThemeStore();
