
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
- **System Monitoring**: Comprehensive monitoring dashboards for all aspects of the system

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

## Mobile Performance Optimizations

The application has been optimized for mobile devices with the following enhancements:

- **Responsive Layouts**: All UI components adapt to different screen sizes
- **Touch-Optimized Interfaces**: Larger tap targets for mobile users
- **Performance Optimizations**: Reduced bundle size and efficient rendering
- **Offline Support**: Basic functionality works without constant connectivity
- **Native Features**: Camera integration for QR code scanning
- **Biometric Authentication**: Fingerprint and Face ID support
- **Push Notifications**: Real-time transaction alerts
- **Reduced Network Usage**: Optimized API calls and data caching

## Developer Documentation

For complete documentation on RizzPay Gateway features and APIs, please refer to the documentation files:

- [Payment Processing](PAYMENT_README.md)
- [Webhook Integration](WEBHOOK_README.md)
- [Bank API Integration](src/design/payment-flow/BANK_API_INTEGRATION.md)
- [Payment Flow](src/design/payment-flow/PAYMENT_FLOW.md)
- [Color Theme](documentations/COLOR_THEME.md)
- [Design System](src/design/rizzpay/README.md)

## Project Structure

The project follows a modular architecture designed for maintainability and scalability:

```
rizzpay/
├── src/
│   ├── components/       # Reusable UI components
│   ├── pages/            # Application pages
│   ├── stores/           # State management 
│   ├── utils/            # Utility functions
│   ├── design/           # Design system files
│   │   ├── rizzpay/      # Figma design exports
│   │   └── payment-flow/ # Payment flow documentation
│   └── integrations/     # External API integrations
└── documentations/       # Project documentation
```
