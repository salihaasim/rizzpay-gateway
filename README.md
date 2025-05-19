
# RizzPay Payment Gateway

RizzPay is a secure, fast, and reliable payment gateway solution for businesses and consumers.

## Page Layout Structure

- **Home/Landing Page**: Includes the global footer
- **All Other Pages**: No footer to maximize screen space for functionality

## Mobile App Support

This application is optimized for both Android and iOS mobile platforms via Capacitor. The app provides a seamless payment experience across all devices.

### Mobile Features

- **Responsive UI**: Fully responsive design that works on all screen sizes
- **Native Capabilities**: Uses device capabilities like camera for QR scanning
- **Offline Support**: Basic functionality works even with intermittent connectivity
- **Push Notifications**: Get real-time updates on transaction status
- **Biometric Authentication**: Secure login with fingerprint or face recognition

### Building Mobile Apps

To build the mobile applications:

1. Install dependencies: `npm install`
2. Build the web application: `npm run build`
3. Sync with Capacitor: `npx cap sync`
4. Build for Android: `npx cap open android`
5. Build for iOS: `npx cap open ios` (requires macOS with Xcode)

## Authentication

The application supports multiple user roles:

- **Admin**: Full access to all features and management capabilities
- **Merchant**: Access to merchant-specific features

Demo credentials:
- Admin: username: `rizzpay`, password: `rizzpay123`
- Merchant: username: `merchant`, password: `password`

## Navigation

- **Home Page**: Landing page with footer (accessible to all users)
- **Dashboard**: Protected merchant dashboard (requires login)
- **Admin Dashboard**: Only accessible to admin users
- **Logout**: Redirects all users back to the home page
- **UPI Plugin**: Merchant-only feature for UPI payment integration

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
- **Services**: Additional merchant services and features
- **Settings**: Configure account settings and preferences

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

## System Monitoring

RizzPay includes comprehensive monitoring dashboards for all aspects of the system:

- **Server Performance**: Real-time CPU, memory, and system resource monitoring
- **API Gateway**: Monitor API performance and request rates
- **Database Health**: Track database performance and query analytics
- **Payment Gateway**: Monitor payment processor status and transaction metrics
- **Security**: Track security events and compliance status
- **Transactions**: Real-time tracking of payment flow
- **Error Tracking**: Monitor application errors and exceptions
- **Business Analytics**: Analyze user behavior and business performance
- **System Status**: Comprehensive overview of all system components
- **Performance Analytics**: Track detailed performance metrics
- **Incident Management**: Track and resolve system incidents

## Recent Updates

- **Fixed Page Navigation**: Fixed home page redirection and prevented auto-redirect to admin
- **Logout Redirects**: Updated logout function to redirect users to the home page
- **UPI Plugin Fix**: Fixed UPI plugin page for merchant users
- **Navigation Improvements**: Enhanced navigation with React Router for smoother experience
- **Footer Placement**: Ensured footer only appears on the home/landing page
- **Admin Routes**: Fixed admin routes to only be accessible by admin users
- **UPI Link Payment**: Enhanced UPI link payment with better navigation
- **React Router Integration**: Updated components to use React Router's navigate for better UX
- **Authentication Checks**: Added proper authentication checks throughout the application

## Legal Documents

RizzPay provides comprehensive legal documentation:

- **Terms & Conditions**: Detailed terms of service
- **Refund Policy**: Clear guidelines on refunds and cancellations
- **Privacy Policy**: Information on data collection and usage

## Documentation

For complete documentation on RizzPay Gateway features and APIs, please refer to the documentation files:

- [Payment Processing](PAYMENT_README.md)
- [Webhook Integration](WEBHOOK_README.md)
- [Full Documentation](RIZZPAY_DOCUMENTATION.md)
- [Privacy Policy](/privacy-policy)
- [Refund Policy](/refund-policy)
- [Terms & Conditions](/terms)
