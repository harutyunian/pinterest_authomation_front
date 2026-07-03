---
name: ytmp3-ui-redesign
description: >-
  Redesigns pinterest_authomation_front to the YTMP3-style UI (blue hero,
  white floating cards, black CTAs, light gray surfaces). Use when changing
  frontend themes, layouts, components, or when the user asks to match the
  reference screenshot or apply the new design system.
disable-model-invocation: true
---

# YTMP3 UI Redesign

Restyle the full `pinterest_authomation_front` app to match the reference screenshot: blue hero header, white elevated interaction card, black primary CTA, light gray body, ~760px content column, 8px border radius.

## Reference

- Screenshot: [reference.png](reference.png)
- Design tokens: [design-tokens.md](design-tokens.md)
- File map and component templates: [component-map.md](component-map.md)

## Before you start

1. Read `reference.png` to internalize layout hierarchy.
2. Read `design-tokens.md` for exact colors and MUI/Tailwind mapping.
3. Confirm scope: **frontend only**. Backend SSR tools (`pinterest_authomation_back/src/tools-ssr/`) are out of scope unless the user explicitly asks.

## Design rules

| Rule | Detail |
|------|--------|
| Hierarchy | Blue hero → white floating card → gray body content |
| Primary color | `#0059b3` (replaces Pinterest red `#E61E2A`) |
| Primary CTA | Black `#000000` buttons for main actions (Convert, Submit, Sign in) |
| Surfaces | White cards/sidebar/header on `#f8f9fa` body |
| Radius | `8px` everywhere (no pill `999px` buttons) |
| Default mode | Light |
| Style only | Do not change API calls, routing guards, or business logic |

### Layout variants

- **Public** (welcome, login, public tools, legal): literal screenshot layout — `ToolHeroShell` + `FloatingActionCard` + `ContentColumn`. See [component-map.md](component-map.md).
- **Admin** (dashboard, pin creator, settings): same tokens, no hero band — white sidebar + header, gray page bg, white content cards, blue nav active state, black submit buttons.

## Styling stack

The project uses a **hybrid** stack. Unify under one token source; do not add a third system.

| Area | Stack | Key files |
|------|-------|-----------|
| Authenticated app | MUI + Emotion | `src/theme/theme.ts`, `ThemeModeProvider.tsx` |
| Landing | Tailwind v4 + CSS | `src/index.css`, `welcome.styles.css` |

### Token workflow

1. Create `src/theme/ytmp3-tokens.ts` (spec in [design-tokens.md](design-tokens.md)).
2. Import tokens into `theme.ts` for MUI palette, shape, and component overrides.
3. Mirror tokens as CSS custom properties in `src/index.css` `:root`.
4. Replace `--color-landing-*` dark/red values with YTMP3 equivalents.
5. Remove `dark` class default from `WelcomePage.tsx`.
6. Unused shadcn kit (`src/components/ui/`) may be adopted only if wired to the same tokens.

## Migration checklist

Copy this checklist and mark items as you complete them. Follow phases in order.

### Phase 1 — Tokens and theme

- [ ] Add `src/theme/ytmp3-tokens.ts`
- [ ] Update `src/theme/theme.ts` — primary blue, radius 8, light defaults, black contained CTA
- [ ] Update `src/theme/ThemeModeProvider.tsx` — default mode `'light'`
- [ ] Update `src/index.css` — YTMP3 CSS variables, landing token swap

### Phase 2 — Shells

- [ ] `src/components/MainLayout.tsx`
- [ ] `src/components/layout/AppSidebar.tsx`
- [ ] `src/components/layout/AppHeader.tsx`
- [ ] `src/components/AuthLayout.tsx`
- [ ] `src/components/PublicToolsLayout.tsx`
- [ ] `src/components/LegalPageLayout.tsx`
- [ ] `src/components/layout/AdminCard.tsx`, `KpiCard.tsx`
- [ ] Create shared `src/components/ytmp3/*` from [component-map.md](component-map.md) templates

### Phase 3 — Public and entry

- [ ] Wire `WelcomePage` into `src/routes/AppRouter.tsx` at `/`
- [ ] All `src/components/welcome/*`
- [ ] `src/pages/LoginPage.tsx`
- [ ] `src/pages/PublicImageGeneratorPage.tsx`

### Phase 4 — Admin pages

- [ ] `src/pages/DashboardPage.tsx`
- [ ] `src/pages/PinCreatorPage.tsx`
- [ ] `src/pages/VideoGeneratorPage.tsx`
- [ ] `src/pages/ImageGeneratorPage.tsx`
- [ ] Remaining pages in `src/pages/` (see [component-map.md](component-map.md))

### Phase 5 — Cleanup

- [ ] Grep for `#E61E2A`, `#e60023`, `#101415`, `borderRadius: 999` — fix or document exceptions
- [ ] Exception allowed: `src/components/link-page/LinkPagePreview.tsx` preview themes
- [ ] Visual pass: hero overlap, card shadow, toggle states, black CTA match reference

## Reusable components

Extract early in Phase 2 (templates in [component-map.md](component-map.md)):

| Component | Purpose |
|-----------|---------|
| `ToolHeroShell` | Blue header, logo, nav, centered title |
| `FloatingActionCard` | White card overlapping hero/body |
| `FormatToggle` | Blue active / outlined inactive pills |
| `ConvertButton` | Black primary CTA |
| `ContentColumn` | Narrow prose for FAQ, legal, instructions |

## Anti-patterns

Do **not**:

- Use Pinterest red (`#E61E2A`) or dark landing palette (`#101415`) for app chrome
- Add radial/gradient hero effects from backend `tools.css`
- Use pill-shaped `borderRadius: 999` on buttons
- Change `link-page` preview theme colors (user-facing published pages)
- Modify backend SSR views unless explicitly requested

## Quality bar

- **Responsive**: card and column stack on mobile; admin sidebar collapses to drawer
- **Accessibility**: WCAG AA contrast; visible focus rings on interactive elements
- **Consistency**: every page uses tokens — no one-off hex values in components

## Verification

After each phase:

1. Run `npm run build` in `pinterest_authomation_front` to catch type errors.
2. Spot-check `/`, `/login`, `/dashboard`, and one feature page in the browser.
3. Compare against [reference.png](reference.png) for public surfaces.
