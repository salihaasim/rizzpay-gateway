
# RizzPay Payment Gateway

RizzPay is a modern payment gateway solution that offers a variety of payment options including UPI, cards, net banking, and more.

## Features

- Multiple payment methods support (UPI, Cards, Net Banking, NEFT)
- Seamless checkout experience
- Admin dashboard for analytics and transaction management
- Merchant onboarding and KYC
- Webhook integration for real-time notifications
- UPI management with multiple provider support
- Wallet system with P2P transfers
- API access for developers

## API Structure

The API is organized in a modular structure for better maintainability:

```
src/api/
├── auth/
│   ├── login.ts
│   ├── register.ts
│   └── index.ts
├── merchant/
│   ├── kyc.ts
│   ├── profile.ts
│   ├── whitelist.ts
│   └── index.ts
├── payment/
│   ├── index.ts
│   ├── phonepe.ts
│   ├── razorpay.ts
│   └── upi.ts
├── transactions/
│   ├── fetch.ts
│   ├── index.ts
│   ├── process.ts
│   └── report.ts
└── webhook/
    ├── create.ts
    ├── index.ts
    └── verify.ts
```

## Admin Features

- **Dashboard**: Comprehensive overview of platform metrics
- **Transaction Management**: View, filter, and manage transactions
- **UPI Management**: Configure UPI providers, accounts, and QR codes
- **Merchant Management**: Onboard and manage merchants
- **KYC Verification**: Verify merchant identity documents
- **Whitelist Management**: Manage IP and domain whitelisting

## UPI Management

The platform supports multiple UPI providers and accounts:

- Configure provider integrations (PhonePe, Google Pay, Paytm)
- Manage UPI accounts with rotation capabilities
- Set transaction limits and priorities
- Generate and manage QR codes for payments

## Developer API

RizzPay offers a comprehensive API for developers to integrate payment solutions:

- REST API for payment processing
- Webhook notifications for payment events
- SDKs for easy integration
- Comprehensive documentation

## Pages Structure

```
src/pages/
├── Dashboard.tsx              # Main merchant dashboard
├── Transactions.tsx           # Transaction history and management
├── Login.tsx                  # User login page
├── Register.tsx               # User registration page
├── Profile.tsx                # User profile management
├── BankingPage.tsx            # Banking services and management
├── Webhooks.tsx               # Webhook configuration
├── UpiPaymentPage.tsx         # UPI payment processing
├── WalletPage.tsx             # Wallet management
├── IndiaPage.tsx              # India-specific information
└── admin/                     # Admin section
    ├── AdminDashboard.tsx     # Admin dashboard
    ├── AdminTransactions.tsx  # Admin transaction management
    ├── AdminMerchants.tsx     # Merchant management
    ├── AdminKYC.tsx           # KYC verification
    ├── AdminWhitelist.tsx     # Whitelist management
    └── AdminUpiManagement.tsx # UPI provider management
```

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables
4. Start the development server: `npm run dev`

## License

This project is proprietary software.

