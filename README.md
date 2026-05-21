<div align="center">

<br/>

# Ambar UI

**45+ components for Svelte 5 + Tailwind CSS v4**

[![npm](https://img.shields.io/npm/v/@ambar-ui/svelte?color=0ea5e9&label=%40ambar-ui%2Fsvelte)](https://www.npmjs.com/package/@ambar-ui/svelte)
[![License: MIT](https://img.shields.io/badge/license-MIT-22c55e)](LICENSE)
[![Svelte 5](https://img.shields.io/badge/Svelte-5-ff3e00?logo=svelte&logoColor=white)](https://svelte.dev)
[![Tailwind v4](https://img.shields.io/badge/Tailwind-v4-38bdf8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Stars](https://img.shields.io/github/stars/blancos13/ambar-svelte?style=flat&color=facc15)](https://github.com/blancos13/ambar-svelte/stargazers)

<br/>

[**Live Demo**](https://ambarui.vercel.app) · [**Components**](https://ambarui.vercel.app/components/installation) · [**npm**](https://www.npmjs.com/package/@ambar-ui/svelte)

<br/>

</div>

---

## What is it?

Ambar UI is a **modern component library** for Svelte 5.  
Copy individual components into your project — or install the whole package via npm.  
Every component is a single `.svelte` file, built with Svelte 5 runes and Tailwind CSS v4.  
No wrapper libraries. No hidden magic. You own the code.

---

## Install

```bash
npm install @ambar-ui/svelte
```

Or copy any `.svelte` file directly from [`src/lib/components/`](./src/lib/components/).

---

## Components

### 📊 Charts
`Bar` · `Candlestick` · `Donut` · `Heatmap` · `Line` · **`Realtime (WebSocket-ready)`** · `Sparkline`

### 🎛 Inputs
`Button` · `Checkbox` · `Input` · `OTP Input` · `Radio` · `Search` · `Select` · `Slider` · `Switch` · `Textarea`

### 🪟 Overlay
`Dialog` · `Drawer` · `Dropdown` · `Popover` · `Sheet` · `Toast` · `Tooltip`

### 🏗 Layout
`Accordion` · `Avatar` · `Breadcrumb` · `Sidebar` · `Tabs` · `Flex / Grid / HStack / VStack`

### 🖼 Display
`Empty State` · `Link` · `List` · `Progress` · `Skeleton` · `Spinner` · `Typography`

---

## Highlights

**Real-time chart** — Feed any live data source (WebSocket, polling, game loop) via a single `latestPrice` prop. Smooth 60fps animation built in. [→ docs](https://ambarui.vercel.app/components/charts/realtime)

**Full-featured Sidebar** — 4 item styles, 3 variants, collapsible icon rail, offcanvas mobile drawer, nested items, badges, animations. [→ docs](https://ambarui.vercel.app/components/sidebar)

**Live theme engine** — 6 themes × 12 accent colors × 9 fonts. Everything is a CSS variable, persisted per-user. Toggle live on the docs site. [→ theming](https://ambarui.vercel.app/components/theming)

**AI-ready** — Machine-readable component reference at [`/llms.txt`](https://ambarui.vercel.app/llms.txt). Paste into Claude, Cursor, or Copilot for accurate code generation.

---

## Theming

Zero config — just CSS variables:

```css
@import 'tailwindcss';

@theme inline {
  --color-accent: oklch(0.6 0.2 265);
}
```

---

## AI / LLM context

```
https://ambarui.vercel.app/llms.txt       ← compact API reference
https://ambarui.vercel.app/llms-full.txt  ← full source of every component
```

---

## Requirements

Svelte `5.0+` · SvelteKit `2.0+` · Tailwind CSS `4.0+` · TypeScript `5.0+`

---

## Contributing

1. Fork → add your component to `src/lib/components/`
2. Export from `src/lib/index.ts`
3. Add a docs page under `src/routes/components/[name]/+page.svelte`
4. Open a PR

---

## License

MIT

---

<div align="center">

Made for the Svelte community · [⭐ Star on GitHub](https://github.com/blancos13/ambar-svelte)

</div>
