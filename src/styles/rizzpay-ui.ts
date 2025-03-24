
// RizzPay UI Design System
// This file contains shared design tokens and UI configurations

// Color scheme
export const colors = {
  // Primary colors
  primary: {
    main: 'hsl(var(--primary))',
    light: 'hsl(var(--primary) / 80%)',
    dark: 'hsl(var(--primary) / 120%)',
    contrast: 'hsl(var(--primary-foreground))'
  },
  // Secondary colors
  secondary: {
    main: 'hsl(var(--secondary))',
    light: 'hsl(var(--secondary) / 80%)',
    dark: 'hsl(var(--secondary) / 120%)',
    contrast: 'hsl(var(--secondary-foreground))'
  },
  // Admin-specific colors
  admin: {
    primary: 'hsl(240 5.9% 10%)',
    secondary: 'hsl(142 76% 36%)',
    accent: 'hsl(321 46% 48%)',
    background: 'hsl(220 14% 96%)'
  },
  // Merchant-specific colors
  merchant: {
    primary: 'hsl(224 64% 33%)',
    secondary: 'hsl(214 32% 91%)',
    accent: 'hsl(215 100% 50%)',
    background: 'hsl(0 0% 100%)'
  },
  status: {
    success: 'hsl(142 71% 45%)',
    warning: 'hsl(38 92% 50%)',
    error: 'hsl(0 84% 60%)',
    info: 'hsl(214 100% 60%)'
  }
};

// Spacing system
export const spacing = {
  xs: '0.25rem',
  sm: '0.5rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2rem',
  xxl: '3rem'
};

// Typography
export const typography = {
  fontFamily: {
    sans: 'var(--font-sans)',
    mono: 'var(--font-mono)'
  },
  fontSizes: {
    xs: '0.75rem',
    sm: '0.875rem',
    md: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    xxl: '1.5rem',
    heading1: '2rem',
    heading2: '1.75rem',
    heading3: '1.5rem'
  },
  fontWeights: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700'
  },
  lineHeights: {
    tight: '1.2',
    normal: '1.5',
    loose: '1.8'
  }
};

// Border radii
export const radii = {
  sm: '0.25rem',
  md: '0.5rem',
  lg: '0.75rem',
  xl: '1rem',
  full: '9999px'
};

// Shadows
export const shadows = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)'
};

// Admin UI components styling
export const adminUI = {
  sidebar: {
    background: 'hsl(240 14% 10%)',
    itemHover: 'hsl(240 14% 15%)',
    text: 'hsl(0 0% 100% / 90%)',
    iconBg: 'hsl(321 46% 48% / 15%)',
    iconColor: 'hsl(321 46% 48%)',
    width: '280px'
  },
  header: {
    background: 'hsl(0 0% 100%)',
    borderBottom: '1px solid hsl(var(--border))',
    height: '64px'
  },
  content: {
    background: 'hsl(220 14% 96%)',
    padding: spacing.xl
  },
  card: {
    background: 'hsl(0 0% 100%)',
    border: '1px solid hsl(var(--border) / 50%)',
    shadow: shadows.sm,
    radius: radii.lg
  },
  button: {
    primary: {
      background: 'hsl(321 46% 48%)',
      hover: 'hsl(321 46% 40%)',
      text: 'hsl(0 0% 100%)'
    },
    secondary: {
      background: 'hsl(142 76% 36%)',
      hover: 'hsl(142 76% 30%)',
      text: 'hsl(0 0% 100%)'
    }
  }
};

// Merchant UI components styling
export const merchantUI = {
  header: {
    background: 'hsl(0 0% 100%)',
    borderBottom: '1px solid hsl(var(--border))',
    height: '64px'
  },
  content: {
    background: 'hsl(0 0% 100%)',
    padding: spacing.lg
  },
  card: {
    background: 'hsl(0 0% 100%)',
    border: '1px solid hsl(var(--border) / 50%)',
    shadow: shadows.sm,
    radius: radii.md
  },
  button: {
    primary: {
      background: 'hsl(214 100% 50%)',
      hover: 'hsl(214 100% 45%)',
      text: 'hsl(0 0% 100%)'
    },
    secondary: {
      background: 'hsl(224 64% 33%)',
      hover: 'hsl(224 64% 28%)',
      text: 'hsl(0 0% 100%)'
    }
  }
};

// Transitions
export const transitions = {
  fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
  medium: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
  slow: '500ms cubic-bezier(0.4, 0, 0.2, 1)'
};

// Z-index scale
export const zIndices = {
  base: 1,
  dropdown: 1000,
  sticky: 1100,
  fixed: 1200,
  modal: 1300,
  popover: 1400,
  toast: 1500
};

// Layout constants
export const layout = {
  maxWidth: '1440px',
  contentMaxWidth: '1280px',
  containerPadding: spacing.lg,
  sidebarWidth: '280px',
  topNavHeight: '64px'
};
