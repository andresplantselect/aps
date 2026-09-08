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
      main: '#B85450',
      dark: '#8A3A37',
      light: '#F8ECEC',
      contrastText: '#FFFFFF',
    },

    warning: {
      main: '#C8832E',
      dark: '#A0661E',
      light: '#FDF3E7',
      contrastText: '#FFFFFF',
    },

    success: {
      main: '#4a7c5f',
      dark: '#365c46',
      light: '#e4f0eb',
      contrastText: '#FFFFFF',
    },

    divider: '#E5E7EB',
  },

  typography: {
    fontFamily: ['Manrope', 'Arial', 'sans-serif'].join(','),

    fontSize: 18,

    h4: {
      fontSize: '2.5rem',
      fontWeight: 700,
      lineHeight: 1.15,
      letterSpacing: '-0.03em',
    },

    h5: {
      fontSize: '1.875rem',
      fontWeight: 600,
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
    },

    h6: {
      fontSize: '1.4rem',
      fontWeight: 600,
      lineHeight: 1.35,
      letterSpacing: '-0.01em',
    },

    subtitle1: {
      fontSize: '1.2rem',
      fontWeight: 500,
      lineHeight: 1.5,
    },

    body1: {
      fontSize: '1.1rem',
      fontWeight: 400,
      lineHeight: 1.65,
    },

    body2: {
      fontSize: '1.05rem',
      fontWeight: 400,
      lineHeight: 1.55,
      color: '#6B7280',
    },

    caption: {
      fontSize: '0.95rem',
      fontWeight: 400,
      lineHeight: 1.4,
      color: '#6B7280',
    },

    button: {
      fontSize: '1.1rem',
      fontWeight: 500,
      letterSpacing: '0',
      textTransform: 'none',
    },
  },

  shape: {
    borderRadius: 14,
  },

  components: {
    MuiTab: {
      styleOverrides: {
        root: {
          fontSize: '1.125rem',
          fontWeight: 600,
          textTransform: 'none',
          letterSpacing: 0,
        },
      },
    },

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
          fontSize: '0.95rem',
          height: 30,
        },
      },
    },

    MuiInputBase: {
      styleOverrides: {
        input: {
          fontSize: '1.1rem',
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
          fontSize: '0.95rem',
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
          fontSize: '1.05rem',
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
