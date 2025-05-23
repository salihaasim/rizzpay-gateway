
# RizzPay Page Handling Documentation

This directory contains documentation about how different roles and pages are managed within the RizzPay application.

## Contents

- `merchant-role.txt`: Comprehensive documentation of the merchant role, including accessible pages, permissions, and component structure
- `admin-role.txt`: Comprehensive documentation of the admin role, including accessible pages, permissions, and component structure

## Authentication Flow

1. Users start at the role selector (/) where they can choose their role
2. Based on selected role, they're redirected to either merchant dashboard or admin dashboard after successful login
3. Auth.tsx handles the authentication process for new registrations

## Navigation Structure

- The application has separate navigation systems for merchants and admins
- AdminLayout and regular Layout components handle the appropriate navigation based on user role
- Special pages like settings, activity logs, and transaction logs implement hideNavigation=true to prevent duplicate navigation bars

## Page Access Control

Access control is implemented through:
1. Role-based redirects after login
2. useEffect hooks that check roles on protected pages
3. Centralized authentication state through merchantAuthStore

## Page Layout Structure

The application uses a consistent layout structure:
- Each role has a dedicated layout component
- Navigation sidebar appears on the left
- Headers provide contextual actions and user menu
- Main content area occupies the center
- Responsive design ensures proper display on all devices

## Adding New Pages

When adding new pages to the application:
1. Create the page component in the appropriate directory
2. Update roles and permission documentation in this folder
3. Add navigation links in the corresponding layout component
4. Implement proper role-based access control
