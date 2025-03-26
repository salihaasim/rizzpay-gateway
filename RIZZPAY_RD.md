
# Rizzpay Research & Development Documentation

## Project Overview

Rizzpay is a payment gateway platform that allows merchants to process payments through various methods and manage their transactions through a comprehensive dashboard.

## Technology Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Shadcn UI
- **Backend**: Supabase (PostgreSQL database, authentication, serverless functions)
- **State Management**: Zustand
- **Data Fetching**: TanStack Query
- **Routing**: React Router DOM
- **Form Handling**: React Hook Form, Zod
- **Notifications**: Sonner

## Running the Application Locally

### Development Environment Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/rizzpay.git
   cd rizzpay
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Variables**
   Create a `.env` file in the root directory with:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
   ```

4. **Start development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```
   
   The application will be available at `http://localhost:8080`

5. **Build for production**
   ```bash
   npm run build
   # or
   yarn build
   ```

6. **Preview production build**
   ```bash
   npm run preview
   # or
   yarn preview
   ```

## Quick Start Guide

For developers new to the project, here's a quick way to get started:

1. **Setup your environment** as described above
2. **Login as a test merchant**:
   - Email: `test@rizzpay.com`
   - Password: `testpass123`
3. **Explore the dashboard** to understand the merchant view
4. **Test a payment flow** by creating a new payment
5. **Check the webhook setup** to understand integration capabilities

## Project Timeline

### Initial Setup

- Created React + TypeScript project with Vite
- Added Tailwind CSS and Shadcn UI for component library
- Set up project routing structure
- Established Supabase connection for backend services

### Core Features Development

1. **Authentication System**
   - Implemented merchant registration and login
   - Created role-based authentication (admin/merchant)

2. **Transaction Management**
   - Built transaction store with Zustand
   - Created transaction listing and filtering capabilities
   - Implemented transaction details view

3. **Payment Processing**
   - Developed payment flow for various payment methods
   - Added card payments, UPI, and net banking options
   - Implemented payment status tracking and notifications

4. **Wallet System**
   - Created merchant wallet functionality
   - Implemented deposit, withdraw, and transfer features
   - Added transaction history for wallet operations

5. **Webhook Integration**
   - Developed webhook system for third-party integrations
   - Created API key management for merchants
   - Implemented webhook payment processing flow
   - Added callback handling for payment confirmations

6. **Backend Payment Processing**
   - Added backend support for NEFT and card payments
   - Created payment storage and verification capabilities
   - Implemented secure payment data handling
   - Added transaction status management

### UI Improvements

1. **Navigation**
   - Improved navigation bar UI for cleaner experience
   - Implemented role-based navigation (admin/merchant)
   - Removed client option from navigation tabs
   - Added visual indicators for current user role

2. **Dashboard**
   - Enhanced dashboard UI with role-specific views
   - Updated tab system to show only relevant options based on user role
   - Improved mobile navigation drawer with better role information

3. **Brand Elements**
   - Changed favicon from default to credit card symbol
   - Updated visual identity to reflect payment focus

### Technical Issues & Resolutions

#### TypeScript Errors

1. **Missing Type Definitions**
   - **Issue**: `Property 'callbackUrl' does not exist on type 'Json'`
   - **Resolution**: Created proper interface for PaymentDetails and used type assertion

2. **Component Props Errors**
   - **Issue**: `Property 'apiKey' is missing in type '{}'`
   - **Resolution**: Added proper state management for API key in WebhookPage component

3. **Zustand Store Errors**
   - **Issue**: TypeScript errors with object literals in state updates
   - **Resolution**: Fixed by properly typing the `set` function in store slices and ensuring all updates use a function that returns partial state

#### Supabase Integration

1. **Client Configuration**
   - **Issue**: Type errors with Supabase client configuration
   - **Resolution**: Updated type definitions and correctly configured createClient with Database types

2. **Edge Functions**
   - **Issue**: Configuration challenges with webhook processing
   - **Resolution**: Implemented proper Edge Functions for webhook processing and callbacks

### Code Optimization

1. **Component Refactoring**
   - Split large components into smaller, focused components
   - Created reusable hooks for common functionality

2. **State Management**
   - Optimized Zustand stores for better performance
   - Implemented proper state persistence

3. **API Integration**
   - Created utility functions for API calls
   - Implemented proper error handling for all API interactions

## Store Architecture

The application uses Zustand for state management with a modular approach:

### Transaction Store Structure

```
src/stores/transactions/
├── index.ts                # Main store export
├── types.ts                # TypeScript interfaces and types
├── utils.ts                # Helper functions
├── transactionSlice.ts     # Transaction management
├── userRoleSlice.ts        # User roles and permissions
└── walletStore.ts          # Wallet functionality
```

### Key Design Principles

1. **Slice Pattern**: State is divided into focused slices with specific responsibilities
2. **Type Safety**: Comprehensive TypeScript typing for all store operations
3. **Immutability**: State updates follow immutable patterns
4. **Separation of Concerns**: Business logic is separated from UI components

### Usage Example

```typescript
// Importing the store
import { useTransactionStore } from '@/stores/transactions';

// Using the store in a component
const Component = () => {
  const { transactions, addTransaction } = useTransactionStore();
  
  // Access state
  console.log(transactions);
  
  // Update state
  addTransaction(newTransaction);
  
  return (/* component JSX */);
};
```

## Commands & Development Notes

### Setting Up Supabase Edge Functions

```bash
# Initialize Supabase project
npx supabase init

# Create webhook function
npx supabase functions new webhook

# Create webhook callback function
npx supabase functions new webhook_callback

# Deploy functions
npx supabase functions deploy webhook
npx supabase functions deploy webhook_callback
```

### Database Schema Updates

```sql
-- Create merchants table
CREATE TABLE merchants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  business_name TEXT,
  business_type TEXT,
  phone TEXT,
  api_key TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create transactions table
CREATE TABLE transactions (
  id TEXT PRIMARY KEY,
  amount DECIMAL NOT NULL,
  currency TEXT DEFAULT 'INR',
  status TEXT NOT NULL,
  payment_method TEXT NOT NULL,
  customer_name TEXT,
  customer_email TEXT,
  merchant_id UUID REFERENCES merchants(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  payment_details JSONB
);
```

### Package Installation History

```bash
# UI Components and Styling
npm install @radix-ui/react-* class-variance-authority clsx tailwind-merge tailwindcss-animate

# State Management and Data Fetching
npm install zustand @tanstack/react-query

# Form Handling
npm install react-hook-form zod @hookform/resolvers

# Routing
npm install react-router-dom

# Utilities
npm install date-fns uuid lucide-react recharts sonner

# Supabase Integration
npm install @supabase/supabase-js
```

## Testing

For testing the application during development:

```bash
# Run unit tests
npm run test

# Run tests with coverage
npm run test:coverage

# Run integration tests
npm run test:integration
```

## Code Style and Linting

We use ESLint and Prettier for code formatting and linting:

```bash
# Check code formatting
npm run lint

# Fix linting issues
npm run lint:fix

# Format code with Prettier
npm run format
```

## Deployment

### Production Deployment

1. Build the application: `npm run build`
2. Deploy the `dist` folder to your hosting service
3. Ensure environment variables are properly set in the production environment

### Supabase Functions Deployment

```bash
# Deploy all functions
npx supabase functions deploy

# Deploy a specific function
npx supabase functions deploy webhook
```

## Troubleshooting Common Issues

### Authentication Problems

- **Issue**: Unable to login after registration
  **Solution**: Check Supabase policies and roles configuration

### Payment Processing Failures

- **Issue**: Payment initiated but stuck in processing
  **Solution**: Check webhook configuration and ensure proper callback URL

### Development Environment Issues

- **Issue**: Hot-reloading not working properly
  **Solution**: Restart the development server and clear browser cache

## Future Development Roadmap

1. **Analytics Dashboard**
   - Implement comprehensive analytics for merchants
   - Add visualization tools for transaction data

2. **Enhanced Security**
   - Implement additional security layers for payment processing
   - Add 2FA for merchant accounts

3. **Mobile Optimization**
   - Enhance mobile responsiveness
   - Develop PWA capabilities

4. **Integration Ecosystem**
   - Add more third-party integrations
   - Create a marketplace for payment plugins

5. **Internationalization**
   - Add multi-currency support
   - Implement language localization

---

*This documentation will be continuously updated as the project evolves. For each major change, please add details about what was changed, why it was changed, and the outcome of those changes.*
