
# RizzPay Stable UI

This folder contains the stable UI components for both merchant and admin interfaces of the RizzPay application. These components represent the current stable version of the UI that can be used as reference for future development.

## Structure

```
rizzpay-stable-ui/
├── merchant/
│   ├── components/
│   │   ├── DashboardSidebar.tsx     # Merchant sidebar with navigation
│   │   └── Layout.tsx               # Merchant layout wrapper
│   └── pages/
│       └── PayoutPage.tsx           # Merchant payout functionality
└── admin/
    ├── components/
    │   ├── AdminSidebar.tsx         # Admin sidebar navigation
    │   ├── AdminLayout.tsx          # Admin layout wrapper
    │   └── AdminHeader.tsx          # Admin header component
    └── pages/
        └── AdminEscrow.tsx          # Admin escrow management
```

## Merchant UI Components

### DashboardSidebar.tsx
- Complete merchant navigation sidebar
- Includes wallet dropdown with payout option
- Responsive design with mobile support
- User profile section with logout functionality

### Layout.tsx
- Main layout wrapper for merchant pages
- Handles authentication state
- Responsive sidebar management
- Theme toggle integration

### PayoutPage.tsx
- Comprehensive payout request functionality
- Multiple payout methods (Bank, UPI, Wallet)
- Payout history tracking
- Form validation and status management

## Admin UI Components

### AdminSidebar.tsx
- Complete admin navigation sidebar
- Includes escrow management navigation
- Mobile responsive with overlay support
- Collapsible sidebar functionality

### AdminLayout.tsx
- Main layout wrapper for admin pages
- Role-based access control
- Mobile menu management
- Navigation state handling

### AdminHeader.tsx
- Admin header with search functionality
- User profile dropdown
- Notification system
- Responsive design

### AdminEscrow.tsx
- SBM Bank escrow account management
- Connection status monitoring
- Transaction tracking and history
- Bank account configuration

## Features

### Responsive Design
- Mobile-first approach
- Tablet and desktop optimizations
- Touch-friendly interactions
- Adaptive layouts

### Theme Support
- Light and dark mode compatibility
- Consistent color schemes
- Accessible contrast ratios
- Smooth theme transitions

### Authentication Integration
- Role-based access control
- Session management
- Secure logout functionality
- User state persistence

### Component Architecture
- Modular and reusable components
- TypeScript support
- Props interface definitions
- Error handling

## Usage

These components can be used as reference for:
1. UI consistency across the application
2. Component structure and patterns
3. Responsive design implementation
4. Authentication and authorization patterns

## Dependencies

- React Router for navigation
- Lucide React for icons
- Tailwind CSS for styling
- Shadcn UI components
- Zustand for state management
- Sonner for notifications

## Best Practices

1. **Component Isolation**: Each component is self-contained with clear interfaces
2. **Responsive Design**: Mobile-first approach with progressive enhancement
3. **Accessibility**: ARIA labels, keyboard navigation, and screen reader support
4. **Performance**: Lazy loading and optimized re-renders
5. **Type Safety**: Full TypeScript support with proper type definitions

## Future Enhancements

- Animation transitions
- Advanced theme customization
- Enhanced accessibility features
- Performance optimizations
- Component documentation

This stable UI serves as the foundation for the RizzPay application's user interface, ensuring consistency and reliability across all merchant and admin functionalities.
