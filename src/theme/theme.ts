import { createTheme, alpha, type Theme } from '@mui/material/styles';

export type ThemeMode = 'light' | 'dark';

const ACCENT = '#E61E2A';
const SUCCESS = '#22C55E';
const SIDEBAR_WIDTH = 260;

const darkTokens = {
  bgDefault: '#0F0F0F',
  bgPaper: '#1A1A1A',
  bgElevated: '#242424',
  border: 'rgba(255, 255, 255, 0.08)',
  textPrimary: '#F5F5F5',
  textSecondary: '#A3A3A3',
  hover: alpha('#FFFFFF', 0.06),
  outlinedBorder: alpha('#FFFFFF', 0.2),
  inputBg: alpha('#000', 0.25),
} as const;

const lightTokens = {
  bgDefault: '#F5F5F7',
  bgPaper: '#FFFFFF',
  bgElevated: '#EBEBED',
  border: 'rgba(0, 0, 0, 0.08)',
  textPrimary: '#171717',
  textSecondary: '#525252',
  hover: alpha('#000', 0.04),
  outlinedBorder: alpha('#000', 0.2),
  inputBg: alpha('#000', 0.04),
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
    accent: ACCENT,
    bgDefault: tokens.bgDefault,
    bgPaper: tokens.bgPaper,
    bgElevated: tokens.bgElevated,
    border: tokens.border,
    success: SUCCESS,
    sidebarWidth: SIDEBAR_WIDTH,
  };
}

/** @deprecated Use `useAdminColors()` from ThemeModeProvider for mode-aware colors */
export const adminColors = getAdminColors('dark');

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
          borderRadius: 999,
          paddingLeft: 20,
          paddingRight: 20,
        },
        outlined: {
          borderColor: tokens.outlinedBorder,
          '&:hover': {
            borderColor: ACCENT,
            backgroundColor: alpha(ACCENT, 0.08),
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
          boxShadow: mode === 'light' ? '0 1px 3px rgba(0,0,0,0.06)' : 'none',
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
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        notchedOutline: {
          borderColor: tokens.border,
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
        main: ACCENT,
        dark: '#B81822',
        light: '#FF4D57',
        contrastText: '#FFFFFF',
      },
      secondary: {
        main: tokens.bgElevated,
        contrastText: tokens.textPrimary,
      },
      success: {
        main: SUCCESS,
        contrastText: mode === 'dark' ? darkTokens.bgDefault : '#FFFFFF',
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
        selected: alpha(ACCENT, 0.16),
      },
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h4: { fontWeight: 700, letterSpacing: '-0.02em' },
      h5: { fontWeight: 600 },
      h6: { fontWeight: 600 },
    },
    shape: { borderRadius: 12 },
    components: buildComponentOverrides(mode, tokens),
  });
}

export const createDarkTheme = () => createAppTheme('dark');
export const createLightTheme = () => createAppTheme('light');

/** @deprecated Use `createAppTheme(mode)` via ThemeModeProvider */
export const theme = createDarkTheme();
