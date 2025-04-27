
# RizzPay

RizzPay is a comprehensive payment processing platform designed to handle legal INR transactions for e-commerce businesses, digital services, and online marketplaces.

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

## Recent Updates

- Fixed issues with the webhook integration system
- Added better error handling for API key management
- Improved developer documentation
- Added code samples for integration methods
- Resolved TypeScript errors and missing dependencies

## Security

- PCI DSS compliant payment processing
- End-to-end encryption
- Robust fraud detection
- IP and domain whitelisting

## License

[MIT](LICENSE)
