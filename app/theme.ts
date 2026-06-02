import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'light',

    primary: {
      main: '#4a7c5f',
      light: '#6a9c7f',
      dark: '#365c46',
      contrastText: '#FFFFFF',
    },

    secondary: {
      main: '#e4f0eb',
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
      dark: '#8A1B1B',
      light: '#F8ECEC',
      contrastText: '#FFFFFF',
    },

    warning: {
      main: '#F6A351',
    },

    success: {
      main: '#4a7c5f',
      light: '#e4f0eb',
    },

    divider: '#E5E7EB',
  },

  typography: {
    fontFamily: ['Manrope', 'Arial', 'sans-serif'].join(','),

    fontSize: 14,

    h4: {
      fontSize: '2rem',
      fontWeight: 700,
      lineHeight: 1.15,
      letterSpacing: '-0.03em',
    },

    h5: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
    },

    h6: {
      fontSize: '1.125rem',
      fontWeight: 600,
      lineHeight: 1.35,
      letterSpacing: '-0.01em',
    },

    subtitle1: {
      fontSize: '0.95rem',
      fontWeight: 500,
      lineHeight: 1.5,
    },

    body1: {
      fontSize: '0.875rem',
      fontWeight: 400,
      lineHeight: 1.65,
    },

    body2: {
      fontSize: '0.82rem',
      fontWeight: 400,
      lineHeight: 1.55,
      color: '#6B7280',
    },

    caption: {
      fontSize: '0.75rem',
      fontWeight: 400,
      lineHeight: 1.4,
      color: '#6B7280',
    },

    button: {
      fontSize: '0.875rem',
      fontWeight: 500,
      letterSpacing: '0',
      textTransform: 'none',
    },
  },

  shape: {
    borderRadius: 14,
  },

  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 18,
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.05)',
        },
      },
    },

    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          fontWeight: 500,
          fontSize: '0.75rem',
          height: 30,
        },
      },
    },

    MuiInputBase: {
      styleOverrides: {
        input: {
          fontSize: '0.875rem',
          fontWeight: 400,
        },
      },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundColor: '#FFFFFF',
        },
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          boxShadow: 'none',
        },
      },
    },

    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 18,
        },
      },
    },

    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          fontSize: '0.75rem',
          borderRadius: 8,
          padding: '8px 10px',
        },
      },
    },

    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: 'none',
        },
      },
    },

    MuiTextField: {
      defaultProps: {
        size: 'small',
      },
    },

    MuiPopover: {
      styleOverrides: {
        paper: {
          border: '1px solid #E5E7EB',
          boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
          borderRadius: 12,
        },
      },
    },

    MuiMenu: {
      styleOverrides: {
        paper: {
          border: '1px solid #E5E7EB',
          boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
          borderRadius: 12,
        },
      },
    },

    MuiTableCell: {
      styleOverrides: {
        root: {
          fontSize: '0.84rem',
          padding: '10px 14px',
          borderBottom: '1px solid #E5E7EB',
        },
        head: {
          fontWeight: 600,
        },
      },
    },

    MuiTableContainer: {
      styleOverrides: {
        root: {
          border: '1px solid #E5E7EB',
          borderRadius: 12,
          boxShadow: 'none',
        },
      },
    },
  },
});
