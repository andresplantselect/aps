import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    mode: "light",

    primary: {
      main: "#4F7F52",
      light: "#6FA374",
      dark: "#3C6240",
      contrastText: "#FFFFFF",
    },

    secondary: {
      main: "#E6F0E8",
      contrastText: "#1F2933",
    },

    background: {
      default: "#F7F8F7",
      paper: "#FFFFFF",
    },

    text: {
      primary: "#1F2933",
      secondary: "#6B7280",
      disabled: "#9CA3AF",
    },

    error: {
      main: "#C94A4A",
      light: "#F8ECEC",
      contrastText: "#FFFFFF",
    },

    warning: {
      main: "#F6A351",
    },

    success: {
      main: "#4F7F52",
      light: "#E6F0E8",
    },

    divider: "#E5E7EB",
  },

  typography: {
    fontFamily: ["Inter", "Roboto", "Arial", "sans-serif"].join(","),

    fontSize: 16,

    h4: {
      fontWeight: 700,
      fontSize: "2rem",
      lineHeight: 1.2,
    },

    h5: {
      fontWeight: 700,
      fontSize: "1.5rem",
      lineHeight: 1.3,
    },

    h6: {
      fontWeight: 600,
      fontSize: "1.125rem",
      lineHeight: 1.4,
    },

    subtitle1: {
      fontSize: "1rem",
      fontWeight: 500,
      lineHeight: 1.5,
    },

    body1: {
      fontSize: "1rem",
      lineHeight: 1.6,
    },

    body2: {
      fontSize: "0.95rem",
      lineHeight: 1.5,
      color: "#6B7280",
    },

    caption: {
      fontSize: "0.82rem",
      lineHeight: 1.4,
      color: "#6B7280",
    },

    button: {
      textTransform: "none",
      fontWeight: 600,
      fontSize: "0.95rem",
    },
  },

  shape: {
    borderRadius: 14,
  },

  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },

      styleOverrides: {
        root: {
          borderRadius: 12,
          paddingTop: 10,
          paddingBottom: 10,
          paddingLeft: 18,
          paddingRight: 18,
          fontSize: "0.95rem",
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 18,
          boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.05)",
        },
      },
    },

    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          fontWeight: 500,
          fontSize: "0.82rem",
          height: 30,
        },
      },
    },

    MuiInputBase: {
      styleOverrides: {
        input: {
          fontSize: "1rem",
        },
      },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundColor: "#FFFFFF",
        },
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
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
          fontSize: "0.82rem",
          borderRadius: 8,
        },
      },
    },
  },
});
