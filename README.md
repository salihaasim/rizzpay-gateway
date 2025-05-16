
# RizzPay Payment Gateway

RizzPay is a comprehensive payment gateway solution for businesses in India, offering UPI, card payments, net banking, and more payment methods.

## API Structure

The project's API is organized into the following modules:

```
src/api/
├── index.ts                # Main exports
├── payment/                # Payment processing APIs
│   ├── index.ts            # Payment API exports
│   ├── phonepe.ts          # PhonePe integration
│   ├── razorpay.ts         # Razorpay integration
│   └── upi.ts              # UPI payment processing
├── merchant/               # Merchant management
│   ├── index.ts            # Merchant API exports
│   ├── profile.ts          # Profile management
│   ├── kyc.ts              # KYC verification
│   └── whitelist.ts        # IP and domain whitelisting
├── transactions/           # Transaction processing
│   ├── index.ts            # Transaction API exports
│   ├── fetch.ts            # Transaction retrieval
│   ├── process.ts          # Transaction processing
│   └── report.ts           # Reporting and analytics
├── webhook/                # Webhook integration
│   ├── index.ts            # Webhook API exports
│   ├── create.ts           # Webhook creation
│   └── verify.ts           # Webhook verification
└── auth/                   # Authentication
    ├── index.ts            # Auth API exports
    ├── login.ts            # Login functionality
    └── register.ts         # Registration functionality
```

## PhonePe Integration

We're integrating with PhonePe payment gateway. The implementation is in `src/api/payment/phonepe.ts`. For production use, you'll need to:

1. Register at [PhonePe for Business](https://business.phonepe.com/developer-settings/api-keys)
2. Generate API keys and salt keys
3. Replace the mock implementation with actual API calls

## Performance Optimizations

The app includes several performance optimizations:

- Route-based code splitting with React.lazy
- Memoization of heavy components
- Optimized data fetching with caching
- Proper state management to avoid unnecessary re-renders
- Component-level code organization

## File Structure

RizzPay follows a modular file structure:

- `/src/api`: API integrations and services
- `/src/components`: Reusable UI components
- `/src/hooks`: Custom React hooks
- `/src/pages`: Top-level page components
- `/src/stores`: State management
- `/src/utils`: Helper functions and utilities
- `/src/context`: React context providers

## Available Scripts

- `npm run dev`: Run development server
- `npm run build`: Build production bundle
- `npm run preview`: Preview production build
- `npm run test`: Run tests

## Integrated Payment Gateways

- Razorpay
- PhonePe (in progress)
- UPI Direct

## License

© 2025 RizzPay. All rights reserved.
