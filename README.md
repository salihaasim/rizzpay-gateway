
# RizzPay Payment Gateway

RizzPay is a comprehensive payment processing platform designed for the Indian market. It facilitates various types of financial transactions including card payments, UPI transfers, wallet management, and bank transfers.

## Features

- Multiple payment methods (UPI, Credit/Debit Cards, NEFT)
- Merchant dashboard with analytics
- Transaction monitoring and reporting
- Secure webhook integration
- Admin controls and merchant management
- Wallet system for internal transfers
- Comprehensive monitoring dashboards

## Monitoring Dashboards

RizzPay includes detailed monitoring dashboards for various system components:

- **Server Monitoring**: Real-time CPU, memory, and system resource tracking
- **API Gateway**: Performance metrics and error tracking
- **Database Health**: Connection pools, query performance, and storage monitoring
- **Payment Gateway**: Transaction volumes, success rates, and gateway availability
- **Security**: Login attempts, authorization failures, and suspicious activity detection
- **Transactions**: Status tracking, processing steps, and failure analysis
- **Error Tracking**: Application errors, exceptions, and resolution status
- **Analytics**: User behavior and business performance metrics
- **System Status**: Overall health monitoring of all components
- **Performance**: Detailed performance metrics and optimization insights
- **Incidents**: Active incident tracking and resolution progress

## Documentation Assistant

The RizzPay documentation assistant (Aasimo AI) provides quick access to information about:

- Payment processing details and workflows
- Transaction capacity and system limits
- Integration guides and webhook setup
- Security measures and compliance information
- Merchant onboarding processes
- Technical architecture and specifications

## Transaction Processing Capacity

- Peak processing: 1,000 transactions per second
- Daily capacity: 86.4 million transactions
- Daily value limit: ₹5,000 crores (approximately $600 million USD)

## Getting Started

1. Clone the repository
2. Install dependencies with `npm install`
3. Set up environment variables for Supabase connection
4. Start the development server with `npm run dev`

## Technology Stack

- Frontend: React, TypeScript, Tailwind CSS, Shadcn UI
- Backend: Supabase (PostgreSQL database, authentication, serverless functions)
- State Management: Zustand
- Data Fetching: TanStack Query
- Routing: React Router DOM
