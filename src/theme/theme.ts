import { createTheme, alpha, type Theme } from '@mui/material/styles';
import { ytmp3Tokens as t } from './ytmp3-tokens';

export type ThemeMode = 'light' | 'dark';

const SUCCESS = t.success;
const SIDEBAR_WIDTH = t.sidebarWidth;

const lightTokens = {
  bgDefault: t.bodyBg,
  bgPaper: t.surface,
  bgElevated: '#f0f2f5',
  border: t.borderLight,
  textPrimary: t.text,
  textSecondary: t.textMuted,
  hover: alpha('#000', 0.04),
  outlinedBorder: t.border,
  inputBg: t.surface,
  accent: t.primary,
} as const;

const darkTokens = {
  bgDefault: '#1a1a1a',
  bgPaper: '#242424',
  bgElevated: '#2e2e2e',
  border: 'rgba(255, 255, 255, 0.1)',
  textPrimary: '#f5f5f5',
  textSecondary: '#a3a3a3',
  hover: alpha('#FFFFFF', 0.06),
  outlinedBorder: 'rgba(255, 255, 255, 0.2)',
  inputBg: alpha('#000', 0.25),
  accent: '#3d8fd1',
} as const;

export type AdminColors = {
  accent: string;
  bgDefault: string;
  bgPaper: string;
  bgElevated: string;
  border: string;
  success: string;
  sidebarWidth: number;
};

export function getAdminColors(mode: ThemeMode): AdminColors {
  const tokens = mode === 'dark' ? darkTokens : lightTokens;
  return {
    accent: tokens.accent,
    bgDefault: tokens.bgDefault,
    bgPaper: tokens.bgPaper,
    bgElevated: tokens.bgElevated,
    border: tokens.border,
    success: SUCCESS,
    sidebarWidth: SIDEBAR_WIDTH,
  };
}

/** @deprecated Use `useAdminColors()` from ThemeModeProvider for mode-aware colors */
export const adminColors = getAdminColors('light');

function buildComponentOverrides(
  mode: ThemeMode,
  tokens: typeof darkTokens | typeof lightTokens,
): Theme['components'] {
  return {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: tokens.bgDefault,
        },
      },
    },
    MuiButton: {
      defaultProps: {
        type: 'button',
      },
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: t.radius,
          paddingLeft: 20,
          paddingRight: 20,
        },
        contained: {
          backgroundColor: t.cta,
          color: t.onPrimary,
          boxShadow: 'none',
          '&:hover': {
            backgroundColor: t.ctaHover,
            boxShadow: 'none',
          },
        },
        outlined: {
          borderColor: tokens.outlinedBorder,
          color: t.primary,
          '&:hover': {
            borderColor: t.primary,
            backgroundColor: alpha(t.primary, 0.06),
          },
        },
      },
    },
    MuiButtonBase: {
      defaultProps: {
        type: 'button',
      },
    },
    MuiIconButton: {
      defaultProps: {
        type: 'button',
      },
    },
    MuiToggleButton: {
      defaultProps: {
        type: 'button',
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: tokens.bgPaper,
          border: `1px solid ${tokens.border}`,
          boxShadow: mode === 'light' ? t.shadowSm : 'none',
          borderRadius: t.radius,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: tokens.inputBg,
            borderRadius: t.radius,
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        notchedOutline: {
          borderColor: tokens.border,
        },
        root: {
          borderRadius: t.radius,
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderColor: tokens.border,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          borderRadius: t.radius,
        },
        colorPrimary: {
          backgroundColor: alpha(t.primary, 0.12),
          color: t.primary,
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: t.radius,
        },
      },
    },
  };
}

export function createAppTheme(mode: ThemeMode): Theme {
  const tokens = mode === 'dark' ? darkTokens : lightTokens;

  return createTheme({
    palette: {
      mode,
      primary: {
        main: tokens.accent,
        dark: t.primaryHover,
        light: '#3d8fd1',
        contrastText: t.onPrimary,
      },
      secondary: {
        main: tokens.bgElevated,
        contrastText: tokens.textPrimary,
      },
      success: {
        main: SUCCESS,
        contrastText: '#FFFFFF',
      },
      background: {
        default: tokens.bgDefault,
        paper: tokens.bgPaper,
      },
      text: {
        primary: tokens.textPrimary,
        secondary: tokens.textSecondary,
      },
      divider: tokens.border,
      action: {
        hover: tokens.hover,
        selected: alpha(tokens.accent, 0.12),
      },
    },
    typography: {
      fontFamily: t.fontFamily,
      h4: { fontWeight: 700, letterSpacing: '-0.02em' },
      h5: { fontWeight: 600 },
      h6: { fontWeight: 600 },
    },
    shape: { borderRadius: t.radius },
    components: buildComponentOverrides(mode, tokens),
  });
}

export const createDarkTheme = () => createAppTheme('dark');
export const createLightTheme = () => createAppTheme('light');

/** @deprecated Use `createAppTheme(mode)` via ThemeModeProvider */
export const theme = createLightTheme();
