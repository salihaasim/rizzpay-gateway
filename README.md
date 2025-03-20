
# Rizzpay Payment Gateway

## Project Overview

Rizzpay is a modern payment gateway solution that provides seamless payment processing capabilities for merchants, clients, and administrators. The application includes features such as:

- User role-based interfaces (admin, merchant, client)
- Transaction management and tracking
- Wallet system with deposit, withdrawal, and transfer capabilities
- Merchant management
- Real-time payment processing
- Dashboard with analytics

## Code Structure

### Core Files

- `src/App.tsx` - Main application component that sets up routing
- `src/main.tsx` - Entry point for the application
- `src/index.css` - Global CSS styles
- `vite.config.ts` - Vite configuration

### Pages

- `src/pages/Index.tsx` - Landing page with overview of the application
- `src/pages/Dashboard.tsx` - Main dashboard with analytics and transaction summary
- `src/pages/Transactions.tsx` - Comprehensive transaction history and management
- `src/pages/WalletPage.tsx` - Wallet management interface
- `src/pages/Settings.tsx` - User settings and profile management
- `src/pages/NotFound.tsx` - 404 page

### Components

#### Navigation and Layout
- `src/components/Navbar.tsx` - Main navigation component

#### Dashboard Components
- `src/components/StatCard.tsx` - Statistical card component used in the dashboard
- `src/components/TransactionCard.tsx` - Card displaying transaction information
- `src/components/RoleSelector.tsx` - Component for selecting user roles

#### Payment Components
- `src/components/PaymentFlow.tsx` - Payment flow component
- `src/components/PaymentProcessingFlow.tsx` - Visualizes the payment processing stages
- `src/components/TransactionDetails.tsx` - Detailed view of transactions
- `src/components/TransactionUtils.ts` - Utility functions for transactions

#### Wallet Components
- `src/components/Wallet.tsx` - Main wallet component
- `src/components/wallet/WalletBalance.tsx` - Displays wallet balance
- `src/components/wallet/RecentTransactions.tsx` - Shows recent wallet transactions
- `src/components/wallet/DepositForm.tsx` - Form for depositing funds
- `src/components/wallet/WithdrawForm.tsx` - Form for withdrawing funds
- `src/components/wallet/TransferForm.tsx` - Form for transferring funds
- `src/components/wallet/AddMerchantDialog.tsx` - Dialog for adding new merchants

#### UI Components
- `src/components/ui/` - Contains various UI components using Shadcn UI library

### State Management

- `src/stores/transactionStore.ts` - Zustand store for managing transactions and wallet
- `src/stores/profileStore.ts` - Zustand store for managing user profiles and merchants

### Utilities

- `src/lib/utils.ts` - Utility functions for the application
- `src/hooks/use-mobile.tsx` - Hook for detecting mobile devices
- `src/hooks/use-toast.ts` - Hook for displaying toast notifications

## Data Types

### Transaction Types
```typescript
export type TransactionStatus = 'successful' | 'failed' | 'pending' | 'processing' | 'settled' | 'declined';
export type PaymentMethod = 'upi' | 'card' | 'netbanking';
export type WalletTransactionType = 'deposit' | 'withdrawal' | 'payment' | 'transfer';
```

### User Types
```typescript
export type UserRole = 'admin' | 'merchant' | 'client' | null;

export interface Merchant {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  createdAt: string;
}
```

## Getting Started

To run this project locally:

```sh
# Install dependencies
npm install

# Start the development server
npm run dev
```

## Technologies Used

- **Framework**: React with TypeScript
- **Build Tool**: Vite
- **UI Components**: Shadcn UI
- **CSS**: Tailwind CSS
- **State Management**: Zustand
- **Form Handling**: React Hook Form
- **Routing**: React Router DOM
- **Charts**: Recharts
- **Icons**: Lucide React

## Features

1. **Multi-Role System**
   - Admin: Manage all transactions, merchants, and clients
   - Merchant: Process payments and view own transactions
   - Client: Make payments and view personal transaction history

2. **Wallet Management**
   - View balance
   - Deposit funds
   - Withdraw funds
   - Transfer funds to merchants
   - Add and manage merchants

3. **Transaction Processing**
   - Process payments through UPI, cards, or net banking
   - Real-time tracking of payment status
   - Detailed transaction history with filtering

4. **Dashboard Analytics**
   - Revenue overview
   - Transaction statistics
   - Customer metrics

## Project Structure Best Practices

- **Components**: Self-contained, reusable UI elements
- **Pages**: Container components that use multiple components
- **Stores**: Global state management using Zustand
- **Utils**: Helper functions and utilities

## Deployment

The application can be deployed to any static hosting service. We recommend using:
- Netlify
- Vercel
- GitHub Pages

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
