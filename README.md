
# Rizzpay - Payment Processing Platform

A modern, responsive payment processing application built with React and TypeScript.

## Performance Optimizations

The application has been optimized for performance in the following ways:

1. **React.memo and useCallback**: Critical components are wrapped with React.memo and event handlers use useCallback to prevent unnecessary re-renders.

2. **Lazy Loading**: Components are loaded lazily using React's built-in lazy loading functionality to improve initial load time.

3. **Suspense Boundaries**: Suspense is used to show loading states while components are being loaded.

4. **useMemo for Expensive Calculations**: Expensive calculations like statistics are wrapped in useMemo to avoid recalculation on every render.

5. **Supabase Connection Optimization**: The connection to Supabase is optimized to reduce API calls and prevent excessive refreshing.

6. **Caching Strategy**: API responses are cached to reduce the number of network requests.

7. **Route Prefetching**: Common routes are prefetched to improve navigation performance.

## Key Components

- **Payment Flow**: Handles the entire payment process from amount input to payment confirmation.
- **Dashboard**: Displays key metrics and recent transactions.
- **Transaction Management**: View and manage transaction history.
- **Wallet Features**: Handle deposits, withdrawals, and transfers.

## Technology Stack

- React with TypeScript
- Tailwind CSS for styling
- Shadcn UI components
- React Router for navigation
- Zustand for state management
- Supabase for backend services
- Razorpay for payment processing

## Getting Started

1. Install dependencies: `npm install`
2. Run the development server: `npm run dev`
3. Open your browser at: `http://localhost:8080`

