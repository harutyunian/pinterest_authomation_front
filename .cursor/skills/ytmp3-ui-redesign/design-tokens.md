# YTMP3 Design Tokens

Reference screenshot: [reference.png](reference.png)

## Color palette

| Token | CSS variable | Value | Usage |
|-------|--------------|-------|-------|
| Primary | `--ytmp3-primary` | `#0059b3` | Hero bg, active toggle, links, nav active |
| Primary hover | `--ytmp3-primary-hover` | `#004a94` | Hover on primary buttons/links |
| Surface | `--ytmp3-surface` | `#ffffff` | Cards, sidebar, header, inputs on white |
| Body background | `--ytmp3-body-bg` | `#f8f9fa` | Page bg below hero, admin content area |
| Text | `--ytmp3-text` | `#333333` | Headings, body on white/gray |
| Text muted | `--ytmp3-text-muted` | `#666666` | Subtitles, placeholders, captions |
| Text on primary | `--ytmp3-on-primary` | `#ffffff` | Hero text, active toggle text |
| CTA | `--ytmp3-cta` | `#000000` | Primary action buttons (Convert, Submit) |
| CTA hover | `--ytmp3-cta-hover` | `#1a1a1a` | Primary button hover |
| Border | `--ytmp3-border` | `#d1d5db` | Input borders, inactive toggle outline |
| Border light | `--ytmp3-border-light` | `#e5e7eb` | Card dividers, header bottom border |
| Success | `--ytmp3-success` | `#22C55E` | Keep from existing theme for status chips |

### Replaces (remove after migration)

| Old value | Where today |
|-----------|-------------|
| `#E61E2A` | MUI `ACCENT` in `src/theme/theme.ts` |
| `#ffb3ad`, `#e60023` | Landing tokens in `src/index.css` |
| `#101415`, `#1d2022` | Dark landing surfaces |
| `#0F0F0F`, `#1A1A1A` | Dark admin defaults (light becomes default) |

## Typography

| Role | Size | Weight | Color | Notes |
|------|------|--------|-------|-------|
| Logo | 1.25rem | 700 italic | `--ytmp3-on-primary` | Bold wide sans; white on blue |
| Hero title | 1.75–2rem | 700 | `--ytmp3-on-primary` | Centered, white |
| Hero subtitle | 1rem | 400 | `--ytmp3-on-primary` | Centered, slightly transparent ok |
| Card label | 0.875rem | 500 | `--ytmp3-text` | e.g. "Paste your YouTube Link" |
| Body | 1rem | 400 | `--ytmp3-text` | Line-height 1.6 |
| Nav link | 0.875rem | 400 | `--ytmp3-on-primary` | Header nav on blue |
| Button | 0.9375rem | 600 | varies | No uppercase transform |

**Font stack:** `'Inter', system-ui, sans-serif` (already in `index.html`).

Drop Plus Jakarta Sans and JetBrains Mono from landing unless a page explicitly needs them.

## Spacing and layout

| Token | Value | Usage |
|-------|-------|-------|
| `--ytmp3-content-max` | `760px` | Hero card, prose column |
| `--ytmp3-container-max` | `1280px` | Full-width nav inner |
| `--ytmp3-gutter` | `24px` | Horizontal page padding |
| `--ytmp3-hero-min-height` | `40vh` | Blue hero band (min 280px) |
| `--ytmp3-card-overlap` | `-48px` | Negative margin on floating card |
| `--ytmp3-card-padding` | `24px` | Inner card padding (32px on md+) |
| `--ytmp3-sidebar-width` | `260px` | Keep existing admin sidebar width |

## Shape and elevation

| Token | Value | Usage |
|-------|-------|-------|
| `--ytmp3-radius` | `8px` | Cards, inputs, buttons, toggles |
| `--ytmp3-radius-sm` | `6px` | Small chips, badges |
| `--ytmp3-shadow` | `0 4px 24px rgba(0,0,0,0.08)` | Floating action card |
| `--ytmp3-shadow-sm` | `0 1px 3px rgba(0,0,0,0.06)` | Admin content cards |

**Replace:** MUI `borderRadius: 999` pill buttons → `8px`.

## Single source of truth

Create `src/theme/ytmp3-tokens.ts`:

```ts
export const ytmp3Tokens = {
  primary: '#0059b3',
  primaryHover: '#004a94',
  surface: '#ffffff',
  bodyBg: '#f8f9fa',
  text: '#333333',
  textMuted: '#666666',
  onPrimary: '#ffffff',
  cta: '#000000',
  ctaHover: '#1a1a1a',
  border: '#d1d5db',
  borderLight: '#e5e7eb',
  success: '#22C55E',
  radius: 8,
  contentMax: 760,
  containerMax: 1280,
  gutter: 24,
  heroMinHeight: '40vh',
  cardOverlap: -48,
  shadow: '0 4px 24px rgba(0,0,0,0.08)',
  shadowSm: '0 1px 3px rgba(0,0,0,0.06)',
  fontFamily: '"Inter", system-ui, sans-serif',
} as const;

export type Ytmp3Tokens = typeof ytmp3Tokens;
```

Mirror as CSS custom properties in `src/index.css` under `:root`:

```css
:root {
  --ytmp3-primary: #0059b3;
  --ytmp3-primary-hover: #004a94;
  --ytmp3-surface: #ffffff;
  --ytmp3-body-bg: #f8f9fa;
  --ytmp3-text: #333333;
  --ytmp3-text-muted: #666666;
  --ytmp3-on-primary: #ffffff;
  --ytmp3-cta: #000000;
  --ytmp3-cta-hover: #1a1a1a;
  --ytmp3-border: #d1d5db;
  --ytmp3-border-light: #e5e7eb;
  --ytmp3-radius: 8px;
  --ytmp3-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
  --ytmp3-content-max: 760px;
}
```

## MUI theme mapping

Apply in `src/theme/theme.ts`:

| MUI key | Value |
|---------|-------|
| `palette.mode` | `'light'` (default) |
| `palette.primary.main` | `ytmp3Tokens.primary` |
| `palette.primary.dark` | `ytmp3Tokens.primaryHover` |
| `palette.background.default` | `ytmp3Tokens.bodyBg` |
| `palette.background.paper` | `ytmp3Tokens.surface` |
| `palette.text.primary` | `ytmp3Tokens.text` |
| `palette.text.secondary` | `ytmp3Tokens.textMuted` |
| `shape.borderRadius` | `ytmp3Tokens.radius` |
| `MuiButton root borderRadius` | `8` (not 999) |
| `MuiButton contained` (primary CTA) | `bgcolor: ytmp3Tokens.cta`, hover `ctaHover` |
| `MuiCard root` | white bg, `ytmp3Tokens.shadowSm`, `border: 1px solid var(--ytmp3-border-light)` |

For secondary/outline buttons use blue border (`primary.main`) on white, matching inactive MP4 toggle.

## Tailwind mapping

In `src/index.css` `@theme inline`, replace `--color-landing-*` with:

```css
--color-landing-primary: var(--ytmp3-primary);
--color-landing-on-primary: var(--ytmp3-on-primary);
--color-landing-surface: var(--ytmp3-surface);
--color-landing-background: var(--ytmp3-body-bg);
--color-landing-on-surface: var(--ytmp3-text);
--color-landing-on-surface-variant: var(--ytmp3-text-muted);
--color-landing-surface-container: var(--ytmp3-surface);
```

Or rename to `--color-ytmp3-*` and update welcome components in one pass.

## Dark mode (optional)

If keeping theme toggle: derive dark palette from blue/white system — deep navy hero `#003d7a`, dark gray body `#1a1a1a`, white text. Do **not** revert to Pinterest red or `#101415` landing palette.

## Component-level color rules

| Element | Active | Inactive |
|---------|--------|----------|
| Format toggle (MP3/MP4) | Blue bg, white text | White bg, blue text, gray border |
| Primary CTA | Black bg, white text | — |
| Nav link (hero) | White, underline on hover | White |
| Nav link (admin sidebar) | Blue text, light blue bg | Gray text |
| Input | White bg, gray border, dark text | — |
| Link in prose | Blue, underline on hover | — |

## Accessibility

- White on `#0059b3`: passes WCAG AA for normal text.
- White on `#000000`: passes AAA.
- `#333333` on `#ffffff` and `#f8f9fa`: passes AAA.
- Focus rings: `outline: 2px solid var(--ytmp3-primary); outline-offset: 2px` on toggles, inputs, buttons.
