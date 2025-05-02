# RizzPay Payment Gateway

RizzPay is a secure, fast, and reliable payment gateway solution for businesses and consumers.

## Recent Changes

- **Code Block Component**: Implemented a custom CodeBlock component to replace the dependency on react-syntax-highlighter 
- **Improved Styling**: Added CSS styling for code blocks to ensure consistent display across the application

## Mobile App Support

This application is optimized for both Android and iOS mobile platforms via Capacitor. The app provides a seamless payment experience across all devices.

## Architecture Overview

RizzPay follows a modular architecture pattern with the following core components:

### Backend Modules

| Module | Description |
|--------|-------------|
| API Gateway | NestJS backend API |
| Authentication | Supabase Auth (JWT-based, custom claims for admin/merchant) |
| Merchant Management | CRUD API for merchants onboarding |
| Transaction Engine | Payment creation, updating, and status handling |
| Payout Engine | Withdrawals & settlements |
| Escrow Fund Management | Separate ledgering for deposits vs payouts |
| Fraud Detection Engine | Monitoring for suspicious activity |
| Webhook Processor | Handling incoming and outgoing webhooks (success, failure) |
| Database | PostgreSQL with tables for Users, Merchants, Transactions, Settlements, Webhooks |

### Frontend Features

- React-based admin and merchant dashboards
- Transaction management interface
- Analytics and reporting tools
- Webhook integration setup
- User and role management

## Getting Started

### Prerequisites

- Node.js (v16+)
- Supabase account
- PostgreSQL database

### Installation

1. Clone the repository
```
git clone https://github.com/yourusername/rizzpay.git
```

2. Install dependencies
```
cd rizzpay
npm install
```

3. Set up environment variables
```
cp .env.example .env
```
Edit the .env file with your Supabase credentials

4. Start the development server
```
npm run dev
```

## API Documentation

### Authentication

RizzPay uses Supabase Auth for authentication. JWT tokens are used to authenticate API requests.

### Webhook Integration

See [Webhook Integration Guide](src/documentation/WEBHOOK_INTEGRATION.md) for details on integrating with the RizzPay webhook system.

### Payment Processing

RizzPay supports various payment methods including:
- Credit/Debit Cards
- UPI
- Net Banking
- Wallet

## Core Features

- **Secure Payment Processing**: End-to-end encryption for all transactions
- **Webhook Integration**: Easy integration with your website or application
- **Transaction Management**: Comprehensive dashboard for viewing and managing transactions
- **Settlement Processing**: Automated settlement to your bank account
- **Reporting & Analytics**: Detailed reports and insights into your payment data

## Security

- PCI DSS compliant payment processing
- End-to-end encryption
- Robust fraud detection
- IP and domain whitelisting

## License

[MIT](LICENSE)

## Recent Updates

- **Syntax Highlighting**: Replaced react-syntax-highlighter with a custom lightweight solution
- **Brand Updates**: Updated branding to RizzPay throughout the application
- **Logo Redesign**: Implemented new professional logo with improved color scheme
- **UI Improvement**: Fixed layout issues in navbar and dashboard components
- **Chart Size Adjustment**: Reduced analytics chart height for better display
- **Layout Spacing**: Optimized content spacing and container widths
- **Responsive Fixes**: Improved mobile experience with better spacing
- **Graph Improvements**: Enhanced revenue graph to show actual transaction data
- **Payment Button Updates**: Updated payment buttons to use consistent RizzPay branding
- **AI Integration**: Added Aasimo AI for feature ideation and platform optimization
- **Monitoring Enhancements**: Added specialized monitoring dashboards for all system components

## Server Requirements

See [SERVER_REQUIREMENTS.md](SERVER_REQUIREMENTS.md) for detailed infrastructure specifications.

## Documentation

For complete documentation on RizzPay Gateway features and APIs, please refer to the documentation files:

- [Payment Processing](PAYMENT_README.md)
- [Webhook Integration](WEBHOOK_README.md)
- [Full Documentation](RIZZPAY_DOCUMENTATION.md)
