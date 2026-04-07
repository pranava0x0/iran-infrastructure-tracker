# Design System -- ME-DC Strike Impact Analyzer

> Adapted from Apple's design language (via [awesome-design-md](https://github.com/VoltAgent/awesome-design-md/tree/main/design-md/apple/)). Tailored for a data-dense geopolitical analysis tool.

---

## 1. Visual Theme & Atmosphere

A dark-mode-first analytical dashboard. The interface communicates precision, credibility, and urgency without sensationalism. Dark backgrounds let map tiles, data visualizations, and status indicators command attention. Light mode available for accessibility and readability in bright environments.

**Key Characteristics:**
- System font stack (`font-sans` via Tailwind) -- no custom fonts to minimize page weight
- Dark-mode-first with light mode toggle via `.dark` class
- Data-as-hero: maps, charts, and scenario outputs are the focal point
- Muted chrome, vivid data -- UI controls recede, data elements pop
- Card-based layout for modular information density
- Full-bleed map view as the primary canvas

---

## 2. Color Palette & Roles

All colors defined as HSL CSS custom properties in `globals.css` and mapped through `tailwind.config.ts`.

### Light Mode
| Role | Variable | HSL Value | Hex (approx) | Usage |
|------|----------|-----------|---------------|-------|
| Background | `--background` | `0 0% 100%` | `#ffffff` | Page background |
| Foreground | `--foreground` | `222 47% 11%` | `#0f172a` | Primary text |
| Card | `--card` | `0 0% 100%` | `#ffffff` | Card surfaces |
| Border | `--border` | `214 32% 91%` | `#e2e8f0` | Dividers, card borders |
| Muted | `--muted` | `210 40% 96%` | `#f1f5f9` | Secondary backgrounds |
| Muted Foreground | `--muted-foreground` | `215 16% 47%` | `#64748b` | Secondary text |
| Primary | `--primary` | `221 83% 53%` | `#3b82f6` | CTAs, active states, links |
| Destructive | `--destructive` | `0 84% 60%` | `#ef4444` | Danger, strike impact |

### Dark Mode (`.dark`)
| Role | Variable | HSL Value | Hex (approx) | Usage |
|------|----------|-----------|---------------|-------|
| Background | `--background` | `222 47% 6%` | `#0b1120` | Page background |
| Foreground | `--foreground` | `210 40% 98%` | `#f8fafc` | Primary text |
| Card | `--card` | `222 47% 9%` | `#111827` | Card surfaces |
| Border | `--border` | `217 33% 17%` | `#1e293b` | Dividers |
| Muted | `--muted` | `217 33% 17%` | `#1e293b` | Secondary backgrounds |
| Primary | `--primary` | `217 91% 60%` | `#3b82f6` | CTAs, active states |

### Semantic Data Colors (extend as needed)
| Purpose | Suggested Color | Usage |
|---------|----------------|-------|
| Operational | `green-500` / `#22c55e` | Active/healthy infrastructure |
| At-Risk | `yellow-500` / `#eab308` | Moderate impact scenarios |
| Critical / Destroyed | `red-500` / `#ef4444` | High impact, strike zones |
| Neutral / Unknown | `muted-foreground` | No data, TBD states |

---

## 3. Typography Rules

### Font Family
- System font stack via Tailwind's `font-sans`: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`
- No custom web fonts -- keeps bundle at zero font bytes

### Hierarchy (Tailwind classes)
| Role | Class | Size | Weight | Usage |
|------|-------|------|--------|-------|
| Page Title | `text-2xl font-bold` | 24px | 700 | Page headers (Map, Scenario, Table) |
| Section Heading | `text-xl font-semibold` | 20px | 600 | Card titles, panel headers |
| Card Title | `text-lg font-medium` | 18px | 500 | Data card headings |
| Body | `text-sm` | 14px | 400 | Standard text, descriptions |
| Caption / Label | `text-xs` | 12px | 400 | Table headers, metadata, tooltips |
| Data Value | `text-lg font-bold tabular-nums` | 18px | 700 | Key metrics, impact numbers |

### Principles
- Use `tabular-nums` for any numerical data to ensure column alignment
- Muted foreground (`text-muted-foreground`) for secondary/supporting text
- Destructive color for negative impact metrics

---

## 4. Component Patterns

### Buttons
- **Primary**: `bg-primary text-primary-foreground rounded-md px-4 py-2 text-sm font-medium`
- **Secondary/Outline**: `border border-border bg-transparent text-foreground rounded-md px-4 py-2 text-sm`
- **Destructive**: `bg-destructive text-white rounded-md px-4 py-2 text-sm font-medium`
- **Ghost**: `bg-transparent hover:bg-accent text-foreground px-4 py-2 text-sm`
- Focus ring: `focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2`

### Cards
- `bg-card text-card-foreground border border-border rounded-lg p-4`
- No shadow by default; use `shadow-sm` sparingly for elevated cards
- Cards contain: title, data content, optional footer with actions

### Navigation (NavBar)
- Sticky top bar with page links (Map, Scenario Builder, Data Table)
- Dark background in dark mode, light in light mode
- Active page indicated via underline or highlight color

### Map Elements (Leaflet)
- Dark tile layer in dark mode (custom background `#1a1a2e`)
- Custom markers with pulsing animation (`animate-pulse-ring`) for active strike scenarios
- Popups styled to match card theme via CSS overrides in `globals.css`

### Data Table
- Striped rows with `bg-muted` alternation
- Sticky headers
- Sortable columns with clear sort indicators
- Responsive: horizontal scroll on mobile

### Scenario Builder
- Form controls use consistent `rounded-md border border-border` styling
- Slider/range inputs for impact parameters
- Results displayed in card grid below controls

---

## 5. Layout Principles

### Spacing
- Base unit: 4px (Tailwind's default `1 = 0.25rem`)
- Common spacings: `p-4` (16px), `gap-4` (16px), `p-6` (24px) for cards
- Section padding: `py-8` (32px) between major sections

### Grid
- Full-width map as primary view
- Sidebar panels (site details) overlay or push content
- Scenario builder: 2-column form layout on desktop, single column on mobile
- Data table: full-width with horizontal scroll

### Responsive Breakpoints (Tailwind defaults)
| Name | Width | Key Changes |
|------|-------|-------------|
| Mobile | <640px | Single column, stacked cards, hamburger nav |
| Tablet | 640-1024px | 2-column grids, side panel overlays |
| Desktop | 1024px+ | Full layout, side panels inline |

---

## 6. Depth & Elevation

| Level | Treatment | Use |
|-------|-----------|-----|
| Flat | No shadow, `bg-card` | Standard cards, content sections |
| Subtle | `shadow-sm` | Elevated cards, dropdowns |
| Overlay | `shadow-lg` + higher z-index | Modals, detail panels, popovers |
| Map Controls | Leaflet default shadows with dark mode overrides | Zoom, attribution |

---

## 7. Do's and Don'ts

### Do
- Use CSS custom properties for all colors -- enables theme switching
- Keep data visualizations high-contrast against card backgrounds
- Use `tabular-nums` for all numerical displays
- Show explicit "N/A" or "TBD" for missing data -- never blank
- Maintain 4.5:1 contrast ratio minimum for all text
- Use Tailwind utility classes consistently -- avoid custom CSS except for Leaflet overrides

### Don't
- Don't introduce additional color libraries -- everything through the CSS variable system
- Don't use decorative gradients or textures -- this is an analytical tool
- Don't use shadows heavily -- flat design with border separation
- Don't hardcode color values in components -- always reference Tailwind theme tokens
- Don't use font sizes larger than `text-3xl` -- data density over dramatic headlines
- Don't center-align data or body text -- left-align for scannability

---

## 8. Accessibility

- All interactive elements must have visible focus indicators (`ring-2 ring-primary`)
- Map must have keyboard-navigable alternatives (data table view)
- Color alone must not convey meaning -- pair with icons/labels (e.g., status + icon)
- Minimum touch target: 44x44px on mobile
- Screen reader labels on all icon-only buttons

---

## 9. Agent Prompt Guide

### Quick Reference
- Primary CTA: `bg-primary text-primary-foreground` (`#3b82f6` in both modes)
- Page background: `bg-background` (white light / `#0b1120` dark)
- Card: `bg-card border border-border rounded-lg p-4`
- Text primary: `text-foreground`
- Text secondary: `text-muted-foreground`
- Danger/impact: `text-destructive`
- Focus ring: `ring-2 ring-primary ring-offset-2`

### When Building New Components
1. Use existing Tailwind theme tokens -- never hardcode hex values
2. Follow card pattern for any new data display
3. Add dark mode variant if using any non-token colors
4. Ensure mobile responsiveness at `sm:` breakpoint minimum
5. Include loading, error, and empty states
