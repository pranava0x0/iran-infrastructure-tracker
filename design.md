# Design System — ME-DC Strike Impact Analyzer

> Inspired by [Claude's design language](https://github.com/VoltAgent/awesome-design-md/tree/main/design-md/claude/) — warm, editorial, and quietly precise. Adapted for a data-dense geopolitical analysis tool.

---

## 1. Visual Theme & Atmosphere

A warm dark-mode-first analytical dashboard. Where Claude's interface evokes a literary salon, this tool evokes a **candlelit intelligence briefing room** — warm amber shadows, precise data, unhurried analysis. Light mode feels like parchment under daylight.

The palette abandons cold navy blues in favor of **warm dark browns** (`#131109`), creating depth without the sterile corporate feel of typical dashboards. Data visualizations — maps, charts, status badges — command the eye against these warm backgrounds.

**Key Characteristics:**
- Warm dark backgrounds (`#131109`) instead of cold navy — data pops against warmth
- System font stack — no web font overhead, system serif for headings on larger displays
- Dark-mode-first; light mode is parchment-toned, not stark white
- Data-as-hero: maps, charts, and scenario outputs are the focal point
- Muted chrome, vivid data — UI controls recede, data elements pop
- Mobile-first layout: bottom navigation, bottom sheet panels, stacked cards
- Terracotta accent (`#c96442`) for brand moments, primary CTAs

---

## 2. Color Palette & Roles

All colors defined as HSL CSS custom properties in `globals.css`, mapped through `tailwind.config.ts`.

### Light Mode (Parchment)
| Role | Variable | HSL | Hex (approx) | Usage |
|------|----------|-----|--------------|-------|
| Background | `--background` | `35 35% 97%` | `#faf8f3` | Warm parchment page background |
| Foreground | `--foreground` | `28 30% 12%` | `#1e1a13` | Warm near-black text |
| Card | `--card` | `35 25% 99%` | `#fdfcf9` | Warm white card surfaces |
| Border | `--border` | `35 20% 87%` | `#e3ddd2` | Warm cream dividers |
| Muted | `--muted` | `35 25% 94%` | `#f4f0e8` | Secondary backgrounds |
| Muted Foreground | `--muted-foreground` | `30 12% 46%` | `#7a7169` | Secondary text |
| Primary | `--primary` | `221 83% 53%` | `#3b82f6` | CTAs, links, active states |
| Destructive | `--destructive` | `0 84% 60%` | `#ef4444` | Strike impact, danger |

### Dark Mode (Warm Briefing Room)
| Role | Variable | HSL | Hex (approx) | Usage |
|------|----------|-----|--------------|-------|
| Background | `--background` | `27 20% 7%` | `#131109` | Warm near-black page bg |
| Foreground | `--foreground` | `35 20% 93%` | `#ece9de` | Warm off-white text |
| Card | `--card` | `27 18% 10%` | `#1a1713` | Warm dark card surfaces |
| Border | `--border` | `28 14% 18%` | `#2a2520` | Warm dark borders |
| Muted | `--muted` | `27 15% 13%` | `#211e1a` | Secondary backgrounds |
| Muted Foreground | `--muted-foreground` | `30 10% 56%` | `#907f75` | Secondary text |
| Primary | `--primary` | `217 91% 60%` | `#3b82f6` | CTAs, active states |
| Destructive | `--destructive` | `0 63% 31%` | `#7f1d1d` | Dark-mode danger tint |

### Semantic Data Colors
| Purpose | Color | Hex | Usage |
|---------|-------|-----|-------|
| Operational | `green-500` | `#22c55e` | Active infrastructure |
| At-Risk / Construction | `amber-500` | `#f59e0b` | Moderate status |
| Destroyed / Critical | `red-500` | `#ef4444` | Strike zones, damage |
| Planned | `blue-500` | `#3b82f6` | Future sites |
| Brand Accent | Terracotta | `#c96442` | Logo, key CTAs |

**Inspired by Claude:** All neutrals carry a warm yellow-brown undertone. No pure gray, no cool blue-gray. The warmth creates a "lived-in, trustworthy environment" even in dark mode.

---

## 3. Typography Rules

### Font Family
System font stack via Tailwind `font-sans`:
`-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`

No custom web fonts — zero font bytes, maximum compatibility.

### Hierarchy (Tailwind classes)
| Role | Class | Size | Weight | Usage |
|------|-------|------|--------|-------|
| Page Title | `text-xl font-bold` | 20px | 700 | Page headers |
| Section Heading | `text-base font-semibold` | 16px | 600 | Card titles, panel headers |
| Card Title | `text-sm font-medium` | 14px | 500 | Data card headings |
| Body | `text-sm` | 14px | 400 | Standard text |
| Caption / Label | `text-xs` | 12px | 400 | Table headers, metadata |
| Micro | `text-[10px]` | 10px | 400 | Badges, tight labels |
| Data Value | `text-lg font-bold tabular-nums` | 18px | 700 | KPI numbers |

### Principles
- `tabular-nums` on all numerical data for column alignment
- `text-muted-foreground` for secondary/supporting text
- Left-aligned data and body text — never center-aligned (scannability)
- `leading-relaxed` (1.625) for any multi-line body copy
- Uppercase + letter-spacing (`uppercase tracking-wider`) for section labels only

---

## 4. Component Patterns

### Buttons
- **Primary**: `bg-primary text-primary-foreground rounded-lg px-4 py-2 text-sm font-medium`
- **Secondary/Outline**: `border border-border bg-transparent hover:bg-accent text-foreground rounded-lg px-4 py-2 text-sm`
- **Ghost**: `bg-transparent hover:bg-accent text-foreground px-3 py-1.5 text-sm rounded-md`
- **Destructive**: `bg-destructive/20 text-red-400 border border-red-500/30 rounded-md`
- Focus ring: `focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1`
- Minimum touch target: 44×44px on mobile

### Cards
- `bg-card text-card-foreground border border-border rounded-lg p-4`
- Elevation via border, not heavy shadows (inspired by Claude's ring shadow approach)
- Whisper shadow: `shadow-sm` sparingly for floating panels
- KPI cards: compact `p-3` with metric value prominently displayed

### Navigation
**Desktop top bar:**
- Sticky, `h-12`, `bg-card/80 backdrop-blur`
- Logo + nav links + theme toggle inline

**Mobile bottom bar:**
- Fixed bottom, `h-16`, `bg-card/95 backdrop-blur`
- 3-4 items with icon + label, evenly distributed
- Active state: primary color + subtle background pill

### Map Elements (Leaflet)
- Warm dark tile in dark mode (CartoDB dark)
- Light tile in light mode (CartoDB light)
- Circle markers: status color fill, red ring for damaged
- Legend: `rounded-full border bg-card/90 backdrop-blur` pill style
- Zoom controls: styled to match card theme via `globals.css`

### Site Detail Panel
- **Mobile**: Fixed bottom sheet, `h-[65vh]`, slides from bottom, `rounded-t-2xl`
- **Desktop** (`sm+`): Absolute right sidebar, `w-96`, full height of map container
- Drag handle indicator on mobile (3px `bg-border rounded-full`)
- Sticky header with close button

### Data Table
- Striped rows: alternate `bg-muted/20`
- Sticky header with `bg-muted/50`
- Mobile: hide non-essential columns (`Commitment`, `Confidence`, `Operators`) below `sm`
- Horizontal scroll container: `overflow-x-auto`
- Sortable columns with clear `↑↓` indicators

### Scenario Builder
- 2-column grid on desktop, single column on mobile
- Site entries: card-based with severity select + duration slider
- Impact summary stacks below site list on mobile

### Badges / Status Pills
- `rounded-full border px-2.5 py-0.5 text-[10px] font-medium`
- Status: green/amber/blue background with matching border tint
- Damaged: red background with red border tint

---

## 5. Layout & Responsive System

### Breakpoints
| Name | Width | Key Changes |
|------|-------|-------------|
| Mobile-sm | `< 480px` | Minimum layout, compact type, bottom nav |
| Mobile | `< 640px` | Single column, bottom nav, bottom sheet panels |
| Tablet | `640px–1024px` | Top nav with links, sidebar panels |
| Desktop | `1024px+` | Full multi-column, inline side panels |

### Spacing
- Base unit: 4px (Tailwind default)
- Card internal: `p-3` (12px) compact, `p-4` (16px) standard
- Section gaps: `gap-4` (16px) mobile, `gap-6` (24px) desktop
- Page container: `max-w-7xl mx-auto px-4`

### Mobile-First Rules
1. **Bottom navigation** replaces top nav links on mobile (< 640px)
2. **Bottom sheet panels** replace right sidebars on mobile
3. **Stacked cards** replace multi-column grids on mobile
4. **Hidden columns** on mobile data table — show only essentials
5. **Map height** accounts for both top nav (3rem) and bottom nav (4rem) on mobile
6. **Touch targets** minimum 44×44px on all interactive elements
7. **Full-width buttons** on mobile where appropriate

### Map Layout Heights
- Mobile: `h-[calc(100vh-7rem)]` — 3rem top + 4rem bottom nav
- Desktop: `h-[calc(100vh-3rem)]` — top nav only

---

## 6. Depth & Elevation

Inspired by Claude's ring-shadow philosophy — depth from warm tone interplay, not heavy drop shadows.

| Level | Treatment | Use |
|-------|-----------|-----|
| Flat | No shadow, `bg-card border border-border` | Standard cards |
| Ring | `ring-1 ring-border` | Interactive hover states |
| Whisper | `shadow-sm` | Slightly elevated cards |
| Overlay | `shadow-lg` + `z-[600]+` | Panels, bottom sheets, modals |
| Modal | `shadow-2xl` | Full overlays |

**Warm ring halos**: Interactive elements use `focus:ring-primary` — never cool-toned focus states.

---

## 7. Do's and Don'ts

### Do
- Use CSS custom properties for all colors — enables clean theme switching
- Keep warm undertones in all neutral colors — no cold blue-gray
- Use `tabular-nums` for all numerical displays
- Show explicit "N/A" or "Unknown" for missing data — never blank
- Maintain 4.5:1 contrast ratio minimum
- Bottom nav on mobile, top nav on desktop
- Bottom sheet panels on mobile, sidebars on desktop
- `backdrop-blur` on all floating chrome (nav, legend, panels)

### Don't
- Don't use pure white (`#ffffff`) as page background — warm parchment/ivory instead
- Don't use cold blue-gray neutrals — every gray carries warm yellow-brown undertone
- Don't use heavy drop shadows — ring shadows and border separation
- Don't hardcode hex values in components — always reference Tailwind theme tokens
- Don't center-align body or data text — left-align for scannability
- Don't show sidebars on mobile — use bottom sheets
- Don't stack top nav links AND bottom nav links simultaneously

---

## 8. Accessibility

- All interactive elements have visible focus indicators (`ring-2 ring-primary ring-offset-1`)
- Map has keyboard-navigable alternative (data table view)
- Color alone never conveys meaning — pair with icons/labels (status badge + text)
- Minimum touch target: 44×44px on mobile
- Screen reader labels (`aria-label`) on all icon-only buttons
- Sufficient contrast in both warm light and warm dark modes

---

## 9. Agent Prompt Guide

### Quick Color Reference
- Page background (dark): `bg-background` → `#131109`
- Page background (light): `bg-background` → `#faf8f3`
- Card surface: `bg-card border border-border rounded-lg`
- Primary text: `text-foreground`
- Secondary text: `text-muted-foreground`
- Primary CTA: `bg-primary text-primary-foreground`
- Brand accent (terracotta): `text-[#c96442]` or `bg-[#c96442]`
- Danger/impact: `text-destructive`
- Focus ring: `ring-2 ring-primary ring-offset-1`

### Device Patterns
- `useDeviceType()` hook → `"mobile" | "tablet" | "desktop"` — use for JS-driven conditional logic
- Prefer Tailwind `sm:` / `lg:` responsive classes for CSS-driven layouts
- Bottom nav: always `sm:hidden`, top nav links: always `hidden sm:flex`
- Bottom sheet: always `sm:absolute` `sm:right-0` overriding `fixed bottom-0`

### When Building New Components
1. Mobile-first — build for 375px, then expand with `sm:` / `lg:`
2. Use existing Tailwind theme tokens — never hardcode hex
3. Card pattern for any new data display: `bg-card border border-border rounded-lg p-4`
4. Include loading, error, and empty states
5. Test at 375px, 640px, 768px, 1024px, 1440px widths
