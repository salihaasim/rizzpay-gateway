
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

