
# RizzPay Payment Gateway

RizzPay is a secure, fast, and reliable payment gateway solution for businesses and consumers.

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

## Admin Features

The admin dashboard includes:

- **Merchant Management**: Add, edit, and manage merchants
- **Role Management**: Create and manage user roles with custom permissions
- **Transaction Logs**: View and export transaction history to Excel
- **Merchant Whitelist**: Manage trusted merchants with special access
- **Bank API Integration**: Connect with banking APIs for seamless transactions
- **Pricing Control**: Set default pricing (payment in: 1%, payment out: 1%)

## Merchant Features

Merchants have access to:

- **Dashboard**: Overview of transaction metrics and performance
- **Transactions**: Track and manage payment transactions
- **Wallet**: Manage funds and perform transactions
  - **Static UPI QR Codes**: Generate branded QR codes for UPI payments
  - **Deposits & Withdrawals**: Manage wallet funds
  - **Transfers**: Send money to other merchants
- **Webhooks**: Set up integrations with external systems
- **Settings**: Configure account settings and preferences

## UPI Payment Features

RizzPay provides comprehensive UPI payment capabilities:

- **Static QR Generation**: Create branded QR codes for UPI payments
  - **PDF Export**: Download QR codes as PDFs with full QR image for scanning
  - **Website Integration**: Generate embed code for websites
  - **Customizable**: Add payment descriptions and branding
- **Payment Links**: Generate and share payment links with customers
- **Direct UPI Integration**: Connect directly with popular UPI apps
- **Real-time Notifications**: Get instant payment confirmations
- **Customizable Payment Pages**: Branded payment experience for customers
- **Merchant Dashboard UPI Integration**: Seamless UPI payments directly from merchant dashboard

## Recent Updates

- **UI Improvement**: Fixed layout issues in navbar and dashboard components
- **Brand Updates**: Removed third-party payment processor references from the UI
- **Chart Size Adjustment**: Reduced analytics chart height for better display
- **Layout Spacing**: Optimized content spacing and container widths
- **Responsive Fixes**: Improved mobile experience with better spacing

## Server Requirements

See [SERVER_REQUIREMENTS.md](SERVER_REQUIREMENTS.md) for detailed infrastructure specifications.

## Documentation

For complete documentation on RizzPay Gateway features and APIs, please refer to the documentation files:

- [Payment Processing](PAYMENT_README.md)
- [Webhook Integration](WEBHOOK_README.md)
- [Full Documentation](RIZZPAY_DOCUMENTATION.md)
