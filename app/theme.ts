import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'light',

    primary: {
      main: '#4F7F52',
      light: '#6FA374',
      dark: '#3C6240',
      contrastText: '#FFFFFF',
    },

    secondary: {
      main: '#E6F0E8',
      contrastText: '#1F2933',
    },

    background: {
      default: '#F7F8F7',
      paper: '#FFFFFF',
    },

    text: {
      primary: '#1F2933',
      secondary: '#6B7280',
      disabled: '#9CA3AF',
    },

    error: {
      main: '#C94A4A',
      light: '#f3ecec',
      contrastText: '#FFFFFF',
    },

    divider: '#E5E7EB',

    warning: {
      main: '#f6a351',
    },

    success: {
      main: '#4F7F52',
      light: '#E6F0E8',
    },
  },

  typography: {
    fontFamily: ['Inter', 'Roboto', 'Arial', 'sans-serif'].join(','),

    h6: {
      fontWeight: 600,
      fontSize: '1rem', // 16px
    },

    body1: {
      fontSize: '0.875rem', // 14px
    },

    body2: {
      fontSize: '0.8125rem', // 13px
      color: '#6B7280',
    },

    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },

  shape: {
    borderRadius: 12,
  },

  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.05)',
        },
      },
    },

    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          fontWeight: 500,
        },
      },
    },
  },
});
