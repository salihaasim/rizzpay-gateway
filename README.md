
# RizzPay Payment Gateway

## Features

- **User Dashboard**: Monitor transactions and account activity.
- **Wallet System**: Deposit, withdraw, and transfer funds.
- **Transaction Management**: View and track all payment transactions.
- **Developer Tools**: API integration documentation and testing tools.
- **KYC Verification**: Upload identity and business documents for verification.
- **UPI QR Plugin**: Embed UPI QR code payment option on any website.
- **Security Settings**: Manage account security preferences.

## Recent Updates

- Optimized desktop navbar design with improved navigation experience
- Fixed syntax error in Navbar component that was causing build failures
- Added animations and icons to all navigation items in the navbar
- Fixed TypeScript errors in UPI QR Popup component
- Fixed TypeScript error in UPI QR Popup component by removing invalid property
- Fixed TypeScript errors in UPI QR Popup component to use correct processing state and payment detail properties
- Fixed TypeScript errors in UPI QR Popup component and added missing react-helmet dependency
- Fixed routing configuration in App.tsx for UPI Plugin page
- Added UPI QR Popup Plugin with manual verification capability
- Fixed TypeScript errors in KYC components to ensure proper functionality
- Enhanced database integration for KYC document storage and verification
- Added proper handling for document types and file uploads
- Fixed navigation bar display on KYC page
- Implemented document upload functionality with Supabase Storage
- Added admin document verification interface
- Enhanced mobile responsiveness for Wallet page
- Fixed layout issues in deposit and bulk withdrawal forms

## Technology Stack

- React with TypeScript
- TailwindCSS for styling
- Shadcn UI components
- Zustand for state management
- React Router for navigation
- Supabase for backend and storage

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Run development server: `npm run dev`
4. Build for production: `npm run build`
