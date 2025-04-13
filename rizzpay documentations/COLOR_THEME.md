
# RizzPay Color Theme

This document outlines the official color codes used throughout the RizzPay application.

## Primary Colors

| Color Name | Hex Code | Usage |
|------------|----------|-------|
| Primary Blue | `#0052FF` | Main brand color, CTAs, links, header |
| Dark Blue | `#0045DB` | Hover states, secondary elements |
| Light Blue | `#EBF1FF` | Background, accent areas |

## Text Colors

| Color Name | Hex Code | Usage |
|------------|----------|-------|
| Primary Text | `#1A1A1A` | Main body text |
| Secondary Text | `#717171` | Secondary text, subtitles |
| Muted Text | `#A3A3A3` | Placeholders, disabled text |

## Status Colors

| Color Name | Hex Code | Usage |
|------------|----------|-------|
| Success | `#10B981` | Success messages, completed states |
| Warning | `#F59E0B` | Warning messages, pending states |
| Error | `#EF4444` | Error messages, failed states |
| Info | `#3B82F6` | Information messages |

## UI Element Colors

| Color Name | Hex Code | Usage |
|------------|----------|-------|
| Background | `#FFFFFF` | Main background |
| Card Background | `#FFFFFF` | Card elements |
| Border | `#E5E7EB` | Borders, dividers |
| Input | `#F3F4F6` | Form inputs |

## Gradient

Primary gradient (for special elements):
```css
background: linear-gradient(135deg, #0052FF, #0045DB);
```

## CSS Variables

These colors are implemented in the CSS using CSS variables:

```css
:root {
  --primary: 217 100% 50%;
  --primary-foreground: 210 40% 98%;
  
  --secondary: 217 30% 96%;
  --secondary-foreground: 210 40% 10%;
  
  --background: 210 50% 98%;
  --foreground: 210 40% 10%;
  
  --muted: 210 40% 96%;
  --muted-foreground: 210 40% 40%;
  
  --accent: 217 95% 97%;
  --accent-foreground: 217 95% 40%;
  
  --destructive: 0 84% 60%;
  --destructive-foreground: 210 40% 98%;
  
  --border: 214 32% 90%;
  --input: 214 32% 90%;
  --ring: 217 100% 50%;
}
```

## Implementation Guidelines

- Use the primary blue (`#0052FF`) for all main actions and branding elements
- Use dark blue (`#0045DB`) for hover states and secondary elements
- Maintain high contrast between text and background for accessibility
- Use status colors consistently across the application for user feedback

## Notes for Developers

- Always use the CSS variables defined in `index.css` where possible
- For custom components that need direct HEX values, reference this document
- Ensure all color usage meets WCAG AA accessibility standards

