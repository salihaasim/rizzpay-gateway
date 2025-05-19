
# RizzPay Payment Gateway

## Overview

RizzPay is a comprehensive payment gateway solution designed for businesses operating in India. This platform enables secure payment processing through various methods including UPI, cards, and bank transfers while providing a feature-rich dashboard for both merchants and administrators.

## Core Features

- **Multiple Payment Methods**: Support for UPI, credit/debit cards, net banking, and wallet payments
- **Merchant Dashboard**: Comprehensive transaction monitoring and management
- **Admin Controls**: Complete oversight of platform operations, merchant management, and KYC verification
- **Analytics**: Detailed insights into transaction patterns and business performance
- **Webhooks**: Real-time integration capabilities for merchants

## Recent Updates

- **Fixed Authentication Route**: Added proper Auth route in the application
- **Type System Improvements**: Fixed TypeScript type issues across the application
- **Admin Layout Fix**: Resolved issues with admin layout and navigation
- **Fixed TypeScript Type Definitions**: Resolved type compatibility issues across the codebase
- **Enhanced Payment Details Interface**: Unified the PaymentDetails interface to support all payment methods

## Developer Notes

### Project Structure

- `/src/components` - Reusable UI components
- `/src/pages` - Main application pages
- `/src/api` - API integration services
- `/src/utils` - Utility functions and helpers
- `/src/stores` - State management using Zustand
- `/src/types` - TypeScript type definitions

### Type System

The project uses a comprehensive TypeScript type system to ensure consistency across components:

- `Transaction` - Represents payment transactions with their full lifecycle
- `PaymentDetails` - Contains payment method-specific details
- `TransactionStatus` - Defines all possible transaction states
- `PaymentProcessingState` - Defines the detailed processing stages of a transaction

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`
4. Access the application at `http://localhost:5173`

## Deployment

The application can be deployed to any hosting service that supports React applications.

## License

Proprietary - All rights reserved

