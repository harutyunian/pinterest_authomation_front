# Component Map — YTMP3 UI Redesign

Phased file list and reusable patterns for `pinterest_authomation_front`.

## Reusable patterns

Create shared components under `src/components/ytmp3/` (or colocate in layouts if preferred). Agents should extract these early in Phase 2.

### ToolHeroShell

Blue header band with logo left, nav right, centered title + subtitle.

```tsx
// src/components/ytmp3/ToolHeroShell.tsx
import { Box, Link, Typography } from '@mui/material';
import { ytmp3Tokens as t } from '../../theme/ytmp3-tokens';

type NavItem = { label: string; href: string };

type Props = {
  logo: string;
  title: string;
  subtitle?: string;
  nav?: NavItem[];
  children?: React.ReactNode;
};

export function ToolHeroShell({ logo, title, subtitle, nav = [], children }: Props) {
  return (
    <Box sx={{ bgcolor: t.primary, color: t.onPrimary, minHeight: t.heroMinHeight, pb: 8 }}>
      <Box
        sx={{
          maxWidth: t.containerMax,
          mx: 'auto',
          px: `${t.gutter}px`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          minHeight: 64,
        }}
      >
        <Typography component="a" href="/" sx={{ fontWeight: 700, fontStyle: 'italic', color: 'inherit', textDecoration: 'none' }}>
          {logo}
        </Typography>
        <Box component="nav" sx={{ display: 'flex', gap: 2.5 }}>
          {nav.map((item) => (
            <Link key={item.href} href={item.href} underline="hover" sx={{ color: 'inherit', fontSize: '0.875rem' }}>
              {item.label}
            </Link>
          ))}
        </Box>
      </Box>
      <Box sx={{ textAlign: 'center', px: 2, pt: 4 }}>
        <Typography variant="h4" sx={{ color: 'inherit', fontWeight: 700, mb: 1 }}>
          {title}
        </Typography>
        {subtitle && (
          <Typography sx={{ color: 'inherit', opacity: 0.95, fontSize: '1rem' }}>
            {subtitle}
          </Typography>
        )}
      </Box>
      {children}
    </Box>
  );
}
```

### FloatingActionCard

White card overlapping hero and body.

```tsx
// src/components/ytmp3/FloatingActionCard.tsx
import { Box } from '@mui/material';
import { ytmp3Tokens as t } from '../../theme/ytmp3-tokens';

export function FloatingActionCard({ children }: { children: React.ReactNode }) {
  return (
    <Box
      sx={{
        maxWidth: t.contentMax,
        mx: 'auto',
        mt: `${t.cardOverlap}px`,
        px: `${t.gutter}px`,
        position: 'relative',
        zIndex: 1,
      }}
    >
      <Box
        sx={{
          bgcolor: t.surface,
          borderRadius: `${t.radius}px`,
          boxShadow: t.shadow,
          p: { xs: 2, md: 3 },
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
```

### FormatToggle

Paired pill buttons — active blue, inactive outlined.

```tsx
// src/components/ytmp3/FormatToggle.tsx
import { Box, Button } from '@mui/material';
import { ytmp3Tokens as t } from '../../theme/ytmp3-tokens';

type Option<T extends string> = { value: T; label: string };

type Props<T extends string> = {
  value: T;
  options: Option<T>[];
  onChange: (value: T) => void;
};

export function FormatToggle<T extends string>({ value, options, onChange }: Props<T>) {
  return (
    <Box sx={{ display: 'flex', gap: 1 }}>
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <Button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            aria-pressed={active}
            sx={{
              borderRadius: `${t.radius}px`,
              minWidth: 72,
              fontWeight: 600,
              bgcolor: active ? t.primary : t.surface,
              color: active ? t.onPrimary : t.primary,
              border: `1px solid ${active ? t.primary : t.border}`,
              '&:hover': { bgcolor: active ? t.primaryHover : t.surface },
            }}
          >
            {opt.label}
          </Button>
        );
      })}
    </Box>
  );
}
```

### ConvertButton

Black primary CTA — use for all main form submits app-wide.

```tsx
// src/components/ytmp3/ConvertButton.tsx
import { Button, type ButtonProps } from '@mui/material';
import { ytmp3Tokens as t } from '../../theme/ytmp3-tokens';

export function ConvertButton(props: ButtonProps) {
  return (
    <Button
      variant="contained"
      {...props}
      sx={{
        borderRadius: `${t.radius}px`,
        bgcolor: t.cta,
        color: t.onPrimary,
        fontWeight: 600,
        px: 3,
        py: 1.25,
        '&:hover': { bgcolor: t.ctaHover },
        ...props.sx,
      }}
    />
  );
}
```

### ContentColumn

Narrow prose block for FAQ, instructions, legal text.

```tsx
// src/components/ytmp3/ContentColumn.tsx
import { Box, Typography } from '@mui/material';
import { ytmp3Tokens as t } from '../../theme/ytmp3-tokens';

export function ContentColumn({ children }: { children: React.ReactNode }) {
  return (
    <Box
      component="section"
      sx={{
        maxWidth: t.contentMax,
        mx: 'auto',
        px: `${t.gutter}px`,
        py: 6,
        color: t.text,
        '& a': { color: t.primary },
        '& h2': { fontSize: '1.25rem', fontWeight: 700, mb: 2 },
        '& p': { mb: 2, lineHeight: 1.6 },
        '& ol, & ul': { pl: 3, mb: 2 },
      }}
    >
      {children}
    </Box>
  );
}
```

### Public page shell (composed)

```tsx
<Box sx={{ minHeight: '100vh', bgcolor: ytmp3Tokens.bodyBg }}>
  <ToolHeroShell logo="Pinterest Automation" title="..." subtitle="..." nav={[...]} />
  <FloatingActionCard>{/* form */}</FloatingActionCard>
  <ContentColumn>{/* FAQ / SEO */}</ContentColumn>
</Box>
```

---

## Phase 1 — Tokens and theme

| File | Action |
|------|--------|
| `src/theme/ytmp3-tokens.ts` | **Create** — single source of truth |
| `src/theme/theme.ts` | Replace `ACCENT`, radii, light defaults, button/card overrides |
| `src/theme/ThemeModeProvider.tsx` | Default mode `'light'`; update `getAdminColors` accent to primary blue |
| `src/index.css` | Replace `--color-landing-*` with YTMP3 vars; add `:root` block |

---

## Phase 2 — Layout shells

| File | Pattern to apply |
|------|------------------|
| `src/components/MainLayout.tsx` | Gray `bodyBg` main area; remove dark defaults |
| `src/components/layout/AppSidebar.tsx` | White sidebar, blue active nav item, gray text inactive |
| `src/components/layout/AppHeader.tsx` | White header, subtle bottom border, no dark glass |
| `src/components/AuthLayout.tsx` | Replace radial red gradient → `ToolHeroShell` + `FloatingActionCard` wrapping `<Outlet />` |
| `src/components/PublicToolsLayout.tsx` | Replace MUI AppBar → `ToolHeroShell`; footer on gray bg |
| `src/components/LegalPageLayout.tsx` | Blue compact hero + `ContentColumn` for legal prose |
| `src/components/layout/AdminCard.tsx` | White card, `shadowSm`, 8px radius |
| `src/components/layout/KpiCard.tsx` | Same card treatment; blue accent for metrics |

---

## Phase 3 — Public and entry pages

| File | Notes |
|------|-------|
| `src/routes/AppRouter.tsx` | Wire `WelcomePage` at `/` (currently redirects to `/` via wildcard only) |
| `src/pages/WelcomePage.tsx` | Remove `dark` class; compose `ToolHeroShell` + sections on gray bg |
| `src/components/welcome/WelcomeNav.tsx` | Merge into hero nav or restyle to white-on-blue links |
| `src/components/welcome/WelcomeHero.tsx` | Hero copy only; card content moves to `FloatingActionCard` |
| `src/components/welcome/WelcomeFeatureSection.tsx` | White cards on gray, blue headings |
| `src/components/welcome/WelcomePricingSection.tsx` | White pricing cards, black CTA buttons |
| `src/components/welcome/WelcomeCtaBand.tsx` | Blue band (secondary hero) or simplify to card CTA |
| `src/components/welcome/WelcomeFooter.tsx` | Gray bg, muted text |
| `src/components/welcome/WelcomePlatformGrid.tsx` | White tiles, blue icons |
| `src/components/welcome/welcome.styles.css` | Strip dark/glass styles; use tokens |
| `src/components/welcome/welcome.constants.ts` | Update brand colors to YTMP3 palette |
| `src/components/welcome/LandingButton.tsx` | Delegate to `ConvertButton` or blue outline variant |
| `src/components/welcome/GlassCard.tsx` | Replace with `FloatingActionCard` or delete if unused |
| `src/pages/LoginPage.tsx` | Form inside `FloatingActionCard`; black Sign in button |
| `src/pages/PublicImageGeneratorPage.tsx` | URL/prompt input + `FormatToggle` if applicable + `ConvertButton` |

---

## Phase 4 — Admin pages

Apply white cards on gray bg, blue secondary actions, black primary submits. Do not add hero bands.

| Priority | File | Key UI elements |
|----------|------|-----------------|
| 1 | `src/pages/DashboardPage.tsx` | KPI cards, quick actions |
| 2 | `src/pages/PinCreatorPage.tsx` | Form sections as stacked cards |
| 3 | `src/pages/VideoGeneratorPage.tsx` | Large form — split into cards |
| 4 | `src/pages/ImageGeneratorPage.tsx` | Prompt input, generate button |
| 5 | `src/pages/CharacterReplacementPage.tsx` | Upload zones in cards |
| 6 | `src/pages/StoredVideosPage.tsx` | Gallery grid on gray bg |
| 7 | `src/pages/LinkPageEditorPage.tsx` | Editor panels; **keep** `link-page` preview themes separate |
| 8 | `src/pages/TelegramSettingsPage.tsx` | Settings form cards |
| 9 | `src/pages/SettingsPage.tsx` | Settings form cards |
| 10 | `src/pages/GeminiKeysPage.tsx` | API key inputs |
| 11 | `src/pages/PrivacyPolicyPage.tsx` | `ContentColumn` prose |

---

## Phase 5 — Cleanup grep targets

Run after migration:

```bash
rg "#E61E2A|#e60023|#101415|borderRadius:\s*999" src/ --glob '!**/link-page/**'
```

Allowed exceptions: `src/components/link-page/LinkPagePreview.tsx` preview themes.

---

## Out of scope

| Path | Reason |
|------|--------|
| `pinterest_authomation_back/src/tools-ssr/**` | Backend SSR; separate stack unless user requests |
| `src/components/link-page/*` preview themes | User-generated page themes, not app chrome |

---

## Responsive rules

| Breakpoint | Behavior |
|------------|----------|
| `< 600px` | Hero title `1.5rem`; card full width with 16px gutter; nav links wrap or collapse to menu |
| `≥ 600px` | Card max 760px centered; format toggle + CTA on one row |
| Admin sidebar | Keep 260px desktop; drawer on mobile (existing behavior) |
