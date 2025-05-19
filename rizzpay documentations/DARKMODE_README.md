
# RizzPay Dark Mode Implementation

This document outlines the dark mode implementation in the RizzPay dashboard and admin interfaces.

## Overview

The application now supports both light and dark color modes, allowing users to switch between them based on their preference. The theme selection is persisted in localStorage and automatically applied when the application loads.

## Features

- **Theme Toggle Button**: Available in both merchant and admin interfaces
- **System Preference Detection**: Automatically detects and applies the user's system preference for dark or light mode
- **Persistent Theme Selection**: Remembers the user's preference across sessions
- **Smooth Transitions**: Animated transitions between light and dark themes

## Technical Implementation

### Context API

The theme functionality is built using React's Context API, allowing theme information to be available throughout the application without prop drilling.

- `ThemeContext.tsx`: Provides theme state and toggle function
- `ThemeProvider`: Wraps the application and manages theme state
- `useTheme`: Custom hook for components to access theme information

### CSS Variables

Theme colors are implemented using CSS variables, making it easy to switch between themes by simply changing the root class.

### Dark Mode Classes

The dark mode is activated by adding a `dark` class to the `<html>` element, triggering all dark mode styles defined in the CSS.

### Integration Points

- **Layout Components**: Both merchant and admin layouts include the theme toggle button
- **Authentication Pages**: The login page includes theme toggle functionality
- **Dashboard Elements**: All dashboard UI components respond to theme changes

## Usage

Users can toggle between light and dark modes by clicking the sun/moon icon in the application header. This setting will persist across sessions and browser refreshes.

### Implementation Details

1. **Theme Context**: Provides theme state management
```jsx
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
```

2. **Theme Provider**: Manages theme state and localStorage persistence
```jsx
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('rizzpay-theme') as Theme;
    if (savedTheme) return savedTheme;
    
    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    
    return 'light';
  });
  // ...
}
```

3. **Theme Toggle**: Button component for switching themes
```jsx
export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={toggleTheme}
    >
      {theme === 'dark' ? <Sun /> : <Moon />}
    </Button>
  );
}
```

## Customization

Developers can extend the theme by modifying the CSS variables in `src/index.css` and adjusting the dark mode classes as needed.
