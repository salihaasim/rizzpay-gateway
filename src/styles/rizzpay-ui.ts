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
  // Aqua blue colors
  aqua: {
    main: '#0EA5E9',
    light: '#33C3F0',
    dark: '#0C8BBF',
    contrast: '#FFFFFF'
  },
  // Admin-specific colors
  admin: {
    primary: 'hsl(240 5.9% 10%)',
    secondary: 'hsl(320 70% 50%)',
    accent: 'hsl(280 70% 60%)',
    background: 'hsl(220 14% 96%)',
    sidebarBg: 'hsl(240 14% 10%)',
    sidebarText: 'hsl(0 0% 100% / 90%)',
    sidebarAccent: 'hsl(280 70% 60%)',
    headerBg: 'hsl(0 0% 100%)'
  },
  // Merchant-specific colors
  merchant: {
    primary: 'hsl(195 64% 33%)',
    secondary: 'hsl(195 32% 91%)',
    accent: 'hsl(195 100% 50%)',
    background: 'hsl(0 0% 100%)'
  },
  status: {
    success: 'hsl(142 71% 45%)',
    warning: 'hsl(38 92% 50%)',
    error: 'hsl(0 84% 60%)',
    info: 'hsl(195 100% 60%)'
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
    background: colors.admin.sidebarBg,
    itemHover: 'hsl(240 14% 15%)',
    text: colors.admin.sidebarText,
    iconBg: 'hsl(280 70% 60% / 15%)',
    iconColor: colors.admin.sidebarAccent,
    width: '280px',
    collapsedWidth: '80px'
  },
  header: {
    background: colors.admin.headerBg,
    borderBottom: '1px solid hsl(var(--border))',
    height: '64px'
  },
  content: {
    background: colors.admin.background,
    padding: 'var(--spacing-xl)'
  },
  card: {
    background: 'hsl(0 0% 100%)',
    border: '1px solid hsl(var(--border) / 50%)',
    shadow: 'var(--shadows-sm)',
    radius: 'var(--radii-lg)'
  },
  button: {
    primary: {
      background: colors.aqua.main,
      hover: colors.aqua.dark,
      text: colors.aqua.contrast
    },
    secondary: {
      background: colors.admin.secondary,
      hover: 'hsl(320 70% 45%)',
      text: 'hsl(0 0% 100%)'
    }
  },
  stats: {
    card: {
      background: 'hsl(0 0% 100%)',
      border: '1px solid hsl(var(--border) / 50%)',
      shadow: 'var(--shadows-sm)',
      radius: 'var(--radii-lg)',
      padding: 'var(--spacing-lg)'
    },
    iconBg: {
      primary: 'hsl(280 70% 60% / 10%)',
      success: 'hsl(142 71% 45% / 10%)',
      warning: 'hsl(38 92% 50% / 10%)',
      info: 'hsl(214 100% 60% / 10%)'
    },
    iconColor: {
      primary: 'hsl(280 70% 60%)',
      success: 'hsl(142 71% 45%)',
      warning: 'hsl(38 92% 50%)',
      info: 'hsl(214 100% 60%)'
    }
  },
  table: {
    header: {
      background: 'hsl(240 5% 96%)',
      text: 'hsl(240 5% 30%)'
    },
    row: {
      background: 'hsl(0 0% 100%)',
      hover: 'hsl(240 5% 97%)',
      border: 'hsl(240 5% 90%)'
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
    padding: 'var(--spacing-lg)'
  },
  card: {
    background: 'hsl(0 0% 100%)',
    border: '1px solid hsl(var(--border) / 50%)',
    shadow: 'var(--shadows-sm)',
    radius: 'var(--radii-md)'
  },
  button: {
    primary: {
      background: colors.aqua.main,
      hover: colors.aqua.dark,
      text: colors.aqua.contrast
    },
    secondary: {
      background: 'hsl(195 64% 33%)',
      hover: 'hsl(195 64% 28%)',
      text: 'hsl(0 0% 100%)'
    }
  },
  stats: {
    card: {
      background: 'hsl(0 0% 100%)',
      border: '1px solid hsl(var(--border) / 50%)',
      shadow: 'var(--shadows-sm)',
      radius: 'var(--radii-md)',
      padding: 'var(--spacing-md)'
    },
    iconBg: {
      primary: 'hsl(214 100% 50% / 10%)',
      success: 'hsl(142 71% 45% / 10%)',
      warning: 'hsl(38 92% 50% / 10%)',
      info: 'hsl(214 100% 60% / 10%)'
    },
    iconColor: {
      primary: 'hsl(214 100% 50%)',
      success: 'hsl(142 71% 45%)',
      warning: 'hsl(38 92% 50%)',
      info: 'hsl(214 100% 60%)'
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
  containerPadding: 'var(--spacing-xl)',
  sidebarWidth: '280px',
  sidebarCollapsedWidth: '80px',
  topNavHeight: '64px'
};

// Animation properties
export const animations = {
  slideIn: {
    transition: 'transform 0.3s ease-out',
    hidden: 'translateX(-100%)',
    visible: 'translateX(0)'
  },
  fadeIn: {
    transition: 'opacity 0.3s ease-out',
    hidden: 'opacity: 0',
    visible: 'opacity: 1'
  },
  scaleIn: {
    transition: 'transform 0.3s ease-out',
    hidden: 'scale(0.95)',
    visible: 'scale(1)'
  }
};

// Gradients
export const gradients = {
  primary: 'linear-gradient(135deg, hsl(280 70% 60%), hsl(320 70% 50%))',
  secondary: 'linear-gradient(135deg, #0EA5E9, #0C8BBF)',
  aqua: 'linear-gradient(135deg, #33C3F0, #0EA5E9)',
  success: 'linear-gradient(135deg, hsl(142 71% 45%), hsl(160 71% 40%))',
  warning: 'linear-gradient(135deg, hsl(38 92% 50%), hsl(25 95% 50%))',
  error: 'linear-gradient(135deg, hsl(0 84% 60%), hsl(0 70% 50%))',
  glass: 'linear-gradient(135deg, hsla(0, 0%, 100%, 0.8), hsla(0, 0%, 100%, 0.6))',
  darkGlass: 'linear-gradient(135deg, hsla(240, 10%, 10%, 0.8), hsla(240, 10%, 10%, 0.6))'
};
