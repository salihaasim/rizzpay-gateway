
# RizzPay Color Theme & Brand Guidelines

**Last Updated**: January 6, 2025  
**Version**: 2.0 (Migration Ready)

This document outlines the official color codes and brand guidelines used throughout the RizzPay application across all environments (Test, UAT, Production).

## Primary Brand Colors

| Color Name | Hex Code | RGB | HSL | Usage |
|------------|----------|-----|-----|-------|
| **RizzPay Blue** | `#0052FF` | rgb(0, 82, 255) | hsl(221, 100%, 50%) | Primary brand color, CTAs, headers, main navigation |
| **Deep Blue** | `#0045DB` | rgb(0, 69, 219) | hsl(224, 100%, 43%) | Hover states, active elements, secondary buttons |
| **Light Blue** | `#EBF1FF` | rgb(235, 241, 255) | hsl(221, 100%, 96%) | Background accents, card highlights, notification areas |
| **Navy Blue** | `#1E3A8A` | rgb(30, 58, 138) | hsl(222, 64%, 33%) | Dark theme primary, admin interface |

## Text Color Hierarchy

| Color Name | Hex Code | RGB | Usage | Contrast Ratio |
|------------|----------|-----|-------|----------------|
| **Primary Text** | `#1A1A1A` | rgb(26, 26, 26) | Main body text, headers | AAA (>7:1) |
| **Secondary Text** | `#717171` | rgb(113, 113, 113) | Subtitles, descriptions | AA (>4.5:1) |
| **Muted Text** | `#A3A3A3` | rgb(163, 163, 163) | Placeholders, disabled text | AA (>3:1) |
| **Light Text** | `#FFFFFF` | rgb(255, 255, 255) | Text on dark backgrounds | AAA (>7:1) |

## Status & Feedback Colors

| Status | Color Name | Hex Code | RGB | Usage |
|--------|------------|----------|-----|-------|
| **Success** | RizzPay Green | `#10B981` | rgb(16, 185, 129) | Successful payments, completed actions |
| **Warning** | Amber | `#F59E0B` | rgb(245, 158, 11) | Pending transactions, warnings |
| **Error** | Red | `#EF4444` | rgb(239, 68, 68) | Failed payments, errors |
| **Info** | Blue | `#3B82F6` | rgb(59, 130, 246) | Information messages, tips |
| **Processing** | Purple | `#8B5CF6` | rgb(139, 92, 246) | Processing states, loading |

## UI Component Colors

### Background Colors
| Element | Color Name | Hex Code | Usage |
|---------|------------|----------|-------|
| **Main Background** | Pure White | `#FFFFFF` | Primary app background |
| **Card Background** | White | `#FFFFFF` | Card elements, modals |
| **Section Background** | Light Gray | `#F9FAFB` | Section separators |
| **Input Background** | Light Gray | `#F3F4F6` | Form inputs, text areas |

### Border Colors
| Element | Color Name | Hex Code | Usage |
|---------|------------|----------|-------|
| **Primary Border** | Light Border | `#E5E7EB` | Main borders, dividers |
| **Focus Border** | RizzPay Blue | `#0052FF` | Active input states |
| **Error Border** | Error Red | `#EF4444` | Invalid input states |

## Payment Method Colors

| Payment Method | Color | Hex Code | Usage |
|----------------|-------|----------|-------|
| **UPI** | Orange | `#FF6B35` | UPI payment buttons, icons |
| **Card** | Blue | `#0052FF` | Credit/debit card elements |
| **Net Banking** | Green | `#10B981` | Banking transfer elements |
| **Wallet** | Purple | `#8B5CF6` | Digital wallet elements |

## Environment-Specific Colors

### Test Environment
- **Header Background**: `#FEF3C7` (Yellow tint)
- **Border Accent**: `#F59E0B` (Amber)
- **Badge Color**: `#92400E` (Dark amber)

### UAT Environment  
- **Header Background**: `#DBEAFE` (Blue tint)
- **Border Accent**: `#3B82F6` (Blue)
- **Badge Color**: `#1E40AF` (Dark blue)

### Production Environment
- **Header Background**: `#FFFFFF` (Clean white)
- **Border Accent**: `#0052FF` (RizzPay blue)
- **Badge Color**: `#1E3A8A` (Navy blue)

## Dark Mode Colors

| Element | Light Mode | Dark Mode | Usage |
|---------|------------|-----------|-------|
| **Background** | `#FFFFFF` | `#1F2937` | Main backgrounds |
| **Card Background** | `#FFFFFF` | `#374151` | Card elements |
| **Text Primary** | `#1A1A1A` | `#F9FAFB` | Main text |
| **Text Secondary** | `#717171` | `#D1D5DB` | Secondary text |
| **Border** | `#E5E7EB` | `#4B5563` | Borders, dividers |

## CSS Implementation

### CSS Variables
```css
:root {
  /* Primary Colors */
  --rizzpay-blue: #0052FF;
  --rizzpay-blue-dark: #0045DB;
  --rizzpay-blue-light: #EBF1FF;
  
  /* Text Colors */
  --text-primary: #1A1A1A;
  --text-secondary: #717171;
  --text-muted: #A3A3A3;
  
  /* Status Colors */
  --success: #10B981;
  --warning: #F59E0B;
  --error: #EF4444;
  --info: #3B82F6;
  --processing: #8B5CF6;
  
  /* UI Colors */
  --background: #FFFFFF;
  --border: #E5E7EB;
  --input-bg: #F3F4F6;
}

/* Dark mode variables */
[data-theme="dark"] {
  --background: #1F2937;
  --text-primary: #F9FAFB;
  --text-secondary: #D1D5DB;
  --border: #4B5563;
}
```

### Tailwind CSS Configuration
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        'rizzpay': {
          50: '#EBF1FF',
          100: '#D6E3FF',
          500: '#0052FF',
          600: '#0045DB',
          700: '#003BB8',
          900: '#1E3A8A'
        },
        'status': {
          success: '#10B981',
          warning: '#F59E0B',
          error: '#EF4444',
          info: '#3B82F6',
          processing: '#8B5CF6'
        }
      }
    }
  }
}
```

## Brand Application Guidelines

### Logo Usage
- **Primary Logo**: Use on white/light backgrounds
- **White Logo**: Use on dark/colored backgrounds
- **Minimum Size**: 24px height for digital, 0.5 inches for print
- **Clear Space**: 2x logo height on all sides

### Typography
- **Primary Font**: Inter (Google Fonts)
- **Secondary Font**: System font stack fallback
- **Headings**: 600-700 weight
- **Body Text**: 400-500 weight

### Accessibility Compliance

#### WCAG AA Standards
- **Contrast Ratios**: All color combinations meet AA standards (4.5:1 minimum)
- **Color Blindness**: Colorblind-friendly palette tested
- **High Contrast**: Dark mode support for better accessibility

#### Testing Tools
- **Contrast Checker**: WebAIM Color Contrast Checker
- **Colorblind Simulation**: Sim Daltonism, Stark
- **Screen Readers**: NVDA, JAWS compatibility

## Implementation Guidelines for Developers

### Do's ✅
- Always use CSS variables for colors
- Test color combinations for accessibility
- Maintain consistent color usage across components
- Use semantic color names (success, error, etc.)
- Implement proper dark mode color schemes

### Don'ts ❌
- Don't use hardcoded hex values in components
- Don't mix color systems (use only approved palette)
- Don't ignore contrast ratio requirements
- Don't use color alone to convey information
- Don't override brand colors without approval

## Migration Considerations

### Environment Detection
```css
/* Environment-specific styling */
.app[data-env="test"] {
  --env-color: #F59E0B;
  --env-bg: #FEF3C7;
}

.app[data-env="uat"] {
  --env-color: #3B82F6;
  --env-bg: #DBEAFE;
}

.app[data-env="production"] {
  --env-color: #0052FF;
  --env-bg: #FFFFFF;
}
```

### Color Consistency Across Environments
All environments (Test, UAT, Production) maintain the same core brand colors while using environment-specific accent colors for identification purposes.

## Version History

### Version 2.0 (2025-01-06)
- Added environment-specific color schemes
- Enhanced dark mode support
- Improved accessibility compliance
- Added payment method specific colors
- Migration-ready color system

### Version 1.0 (2024)
- Initial color theme establishment
- Basic brand color definitions
- Primary UI component colors

---

**For questions or updates to the color theme, contact the Design Team or submit a request through the brand guidelines repository.**
