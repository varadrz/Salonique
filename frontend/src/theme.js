// In src/theme.js

import { createTheme } from '@mui/material/styles';

// Common component overrides for both themes
const componentOverrides = {
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12, // Rounded buttons
          textTransform: 'none', // Keep button text as is
          fontWeight: 'bold',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20, // Rounded cards
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
};

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#673ab7', // Deep Purple
    },
    secondary: {
      main: '#009688', // Teal
    },
    background: {
      default: '#f4f5f7',
      paper: '#ffffff',
    },
  },
  ...componentOverrides,
});

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#d1c4e9', // Light Purple
    },
    secondary: {
      main: '#80cbc4', // Light Teal
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
  },
  ...componentOverrides,
});