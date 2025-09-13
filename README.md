# RizzPay Payment Gateway

RizzPay is a secure, fast, and reliable payment gateway solution for businesses and consumers.

## Getting Started

To run the application locally:

```bash
npm install
npm run dev
```

The app will be available at `http://localhost:5173`

## Page Layout Structure

- **Home/Landing Page**: The only page that includes the global footer
- **All Other Pages**: No footer to maximize screen space for functionality

## Navigation and Routing

- **Home Page**: Landing page with footer (accessible to all users)
- **Authentication**: Unified auth page for login/registration
- **Dashboard**: Protected merchant dashboard (requires login)
- **Admin Dashboard**: Only accessible to admin users
- **Logout**: Redirects all users back to the home page
- **UPI Plugin**: Merchant-only feature for UPI payment integration
- **Contact Us**: Public page with contact information for support

### Routing Protection

- Admin routes (/admin/*) are protected and only accessible to users with admin role
- Merchant routes are protected and require authentication
- Public routes are accessible to all visitors
- **IMPORTANT**: Users always land on the home page first - no automatic redirects based on authentication

## Authentication

The application supports multiple user roles:

- **Admin**: Full access to all features and management capabilities
- **Merchant**: Access to merchant-specific features

Demo credentials:
- Admin: username: `rizzpay`, password: `rizzpay123`
- Merchant: username: `merchant`, password: `password`

## Admin Features

The admin dashboard includes:

- **Merchant Management**: Add, edit, and manage merchants
- **Role Management**: Create and manage user roles with custom permissions
- **Transaction Logs**: View and export transaction history to Excel
- **Merchant Whitelist**: Manage trusted merchants with special access
- **Bank API Integration**: Connect with banking APIs for seamless transactions
- **Pricing Control**: Set default pricing (payment in: 1%, payment out: 1%)
- **System Monitoring**: Comprehensive monitoring dashboards for all aspects of the system

## Merchant Features

Merchants have access to:

- **Dashboard**: Overview of transaction metrics and performance
  - **Current Balance**: Real-time wallet balance
  - **Pay-Ins**: Track incoming payments with success/pending rates
  - **Pay-Outs**: Monitor outgoing payments with success/failure rates
  - **Transaction Overview**: Visual representation of transaction history
- **Banking**: Manage bank accounts and banking operations
- **Deposit & Payout**: Dedicated sections for depositing funds and processing payouts
- **IMPS/UPI/NEFT**: Integrated payment methods for Indian banking
- **Reports**: Generate custom transaction reports
- **Wallet**: Manage funds and perform transactions
  - **Static UPI QR Codes**: Generate branded QR codes for UPI payments
  - **Deposits & Withdrawals**: Manage wallet funds
  - **Transfers**: Send money to other merchants
- **Payment Tools**: Access specialized payment processing tools
- **UPI Plugin**: Integrate UPI payments into your website
- **Developer Integration**: API keys and webhooks for platform integration
- **Settings**: Configure account settings and preferences

## Mobile App Support

This application is optimized for both Android and iOS mobile platforms via Capacitor. The app provides a seamless payment experience across all devices.

### Mobile Features

- **Responsive UI**: Fully responsive design that works on all screen sizes
- **Native Capabilities**: Uses device capabilities like camera for QR scanning
- **Offline Support**: Basic functionality works even with intermittent connectivity
- **Push Notifications**: Get real-time updates on transaction status
- **Biometric Authentication**: Secure login with fingerprint or face recognition

## Payment & Integration Features

RizzPay provides comprehensive payment capabilities:

- **Static QR Generation**: Create branded QR codes for UPI payments
  - **PDF Export**: Download QR codes as PDFs with full QR image for scanning
  - **Website Integration**: Generate embed code for websites
  - **Customizable**: Add payment descriptions and branding
- **Payment Links**: Generate and share payment links with customers
- **UPI Link Payment**: Create shareable payment links with UPI integration
- **Direct UPI Integration**: Connect directly with popular UPI apps
- **Real-time Notifications**: Get instant payment confirmations
- **Customizable Payment Pages**: Branded payment experience for customers
- **Developer Tools**: API keys, documentation and integration code for developers

## Bank API Integration Plan

- All live/production bank integrations use the unified API in `src/services/BankApiGateway.ts`
- To enable a new bank, implement its API call in the appropriate method (see TODO comments)
- DO NOT hardcode production secrets – connect through the environment/secrets tooling
- Keep the UI and navigation unchanged—only backend service needs direct edits for bank integrations

## Legal Documents

RizzPay provides comprehensive legal documentation:

- **Terms & Conditions**: Detailed terms of service
- **Refund Policy**: Clear guidelines on refunds and cancellations
- **Contact Information**: Multiple ways to get in touch with our support team

## Recent Updates

- **Added Bank API Management**: Improved admin settings with bank API key management
- **Fixed Admin Navigation**: Restored monitoring option and fixed duplicated navigation
- **Back Button Fixed**: Fixed back button functionality in Auth and UPI Link Payment pages
- **Added Office Address**: Updated Contact Us page with our physical address in Chennai
- **Fixed Logout Redirection**: Ensured users are always redirected to home page after logout
- **Auth Behavior Improved**: Users always land on the home page first without automatic redirects
- **Contact Us Page**: Added dedicated page with support channels and contact information
- **Mobile Optimization**: Enhanced UI for better performance on Android and iOS devices
- **Admin Area Restoration**: Restored admin interface to May 2nd version
- **Fixed Admin Sidebar**: Improved admin navigation with working sidebar
- **Removed Dark Mode**: Removed dark mode toggle from admin interface
- **Fixed UPI Plugin Routing**: Corrected routing for UPI plugin on merchant side
- **Fixed Navigation Issues**: Improved routing for all admin pages
- **Prevented Auto-Redirects**: Fixed issue where website would auto-redirect to admin
- **Improved Logout Function**: Updated logout to always redirect to home page
- **Admin Activity Log**: Added admin activity tracking and reporting
- **Admin Transaction Log**: Enhanced transaction monitoring for admins
- **Updated Legal Documents**: Updated company address in Terms & Conditions and Refund Policy

## Documentation

For complete documentation on RizzPay Gateway features and APIs, please refer to the documentation files:

- [Payment Processing](PAYMENT_README.md)
- [Webhook Integration](WEBHOOK_README.md)
- [Full Documentation](RIZZPAY_DOCUMENTATION.md)
- [Refund Policy](/refund-policy)
- [Terms & Conditions](/terms)
- [Contact Us](/contact)

## Contact Support

For technical support or questions about the payment system, please contact:
- Email: support@rizzpay.com
- Phone: +91-755024887
- WhatsApp: +91-7550248887
- Live Chat: Available on the dashboard (business hours)
- Address: First Floor, 11/6, Ramanathan St, Mahalingapuram, Nungambakkam, Chennai, Tamil Nadu 600034, India
