
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

## Recent Refactoring

The codebase has been refactored for better maintainability and performance:

- **Merchant Details**: Updated merchant name to "Salih Aasim 001"
- **Dashboard Components**: Refactored Dashboard into smaller, focused components
- **Transaction Components**: Decomposed the Transactions page into modular components
- **Mobile Responsiveness**: Enhanced UI for better experience on Android and iOS devices
- **Code Structure**: Improved organization with proper component separation

## Special Features

### Aasimo AI Assistant

RizzPay includes a specialized AI assistant named Aasimo AI that provides strategic insights and feature suggestions. This tool is accessible via a special URL and is designed to help the development team optimize the payment platform.

- **Access**: Visit `/aasimo-ai` to interact with the AI assistant
- **Purpose**: Get ideas for new features and improvements to the payment gateway
- **Availability**: This feature is not linked from admin or merchant dashboards

## Server Requirements

See [SERVER_REQUIREMENTS.md](SERVER_REQUIREMENTS.md) for detailed infrastructure specifications.

## Documentation

For complete documentation on RizzPay Gateway features and APIs, please refer to the documentation files:

- [Payment Processing](PAYMENT_README.md)
- [Webhook Integration](WEBHOOK_README.md)
- [Full Documentation](RIZZPAY_DOCUMENTATION.md)
