
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

## Server Requirements

See [SERVER_REQUIREMENTS.md](SERVER_REQUIREMENTS.md) for detailed infrastructure specifications.

## Documentation

For complete documentation on RizzPay Gateway features and APIs, please refer to the documentation files:

- [Payment Processing](PAYMENT_README.md)
- [Webhook Integration](WEBHOOK_README.md)
- [Full Documentation](RIZZPAY_DOCUMENTATION.md)

