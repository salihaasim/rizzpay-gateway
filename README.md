
# RizzPay Payment Gateway

RizzPay is a comprehensive payment gateway platform that enables merchants to process payments through various methods and manage transactions through an intuitive dashboard.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running Locally](#running-locally)
  - [Environment Setup](#environment-setup)
- [Architecture](#architecture)
- [Payment Methods](#payment-methods)
- [Wallet System](#wallet-system)
- [Performance Optimizations](#performance-optimizations)
- [Development Guidelines](#development-guidelines)
- [API Integrations](#api-integrations)
- [Security](#security)

## Overview

RizzPay is a modern payment platform built with React, TypeScript, and Supabase, offering a comprehensive solution for payment processing, transaction management, and merchant services. The platform supports multiple payment methods including UPI, card payments, net banking, wallet transfers, and NEFT transactions.

## Features

- **Multi-method Payment Processing**: Support for UPI, cards, net banking, NEFT, and wallet payments
- **Transaction Dashboard**: Real-time tracking and management of all transactions
- **Wallet System**: Built-in digital wallet for storing and transferring funds
- **NEFT Integration**: Direct bank transfers using HDFC Bank's API
- **Webhook Support**: Custom webhooks for third-party integrations
- **Role-based Access**: Separate dashboards for admins and merchants
- **Analytics**: Visual reports and insights on payment trends
- **Responsive Design**: Optimized for both desktop and mobile devices

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager
- Git

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/rizzpay.git
   cd rizzpay
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

### Running Locally

1. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

2. Open your browser and navigate to `http://localhost:8080` to see the application running.

3. To build for production:
   ```bash
   npm run build
   # or
   yarn build
   ```

4. To preview the production build:
   ```bash
   npm run preview
   # or
   yarn preview
   ```

### Environment Setup

1. Create a `.env` file in the root directory with the following variables:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
   ```

2. Replace the placeholder values with your actual API keys and endpoints.

## Architecture

RizzPay is built using a modern frontend stack:

- **React & TypeScript**: For type-safe component development
- **Tailwind CSS & Shadcn/UI**: For styling and UI components
- **Zustand**: For state management across the application
- **React Router**: For navigation and routing
- **TanStack Query**: For efficient data fetching and caching
- **Supabase**: For backend services (database, authentication)

The codebase follows a modular architecture with:
- `/components`: Reusable UI components
- `/pages`: Main application views
- `/stores`: Global state management
  - `/stores/transactions`: Refactored transaction store with clear separation of concerns
- `/utils`: Helper functions and utilities
- `/hooks`: Custom React hooks
- `/integrations`: External service integrations

## Payment Methods

### Card Payments
Secure credit/debit card processing with support for all major networks.

### UPI
Direct integration with UPI for instant mobile payments popular in India.

### Net Banking
Integration with multiple banks for direct bank transfers.

### NEFT Transfers
Integration with HDFC Bank API for NEFT transfers to any bank account in India.

### Wallet
Internal digital wallet system for storing funds and making quick payments.

## Wallet System

The wallet system allows users to:

1. **Deposit Funds**: Add money to their wallet via various payment methods
2. **Transfer Funds**: Send money to other merchants or users
3. **Withdraw Funds**: Transfer wallet balance to bank accounts via NEFT
4. **Make Payments**: Use wallet balance for transactions

All wallet transactions are securely stored and can be tracked in the transaction history.

## Performance Optimizations

The application has been optimized to prevent unnecessary refreshes and improve performance:

### Supabase Optimizations:
- Singleton Supabase client pattern to prevent multiple instance creation
- Debounced connection checks to reduce API calls
- Connection timeouts to prevent hanging requests
- Enhanced error handling for failed network requests
- Improved caching strategy for transactions (5-minute cache)

### React Optimizations:
- Components wrapped with React.memo to prevent unnecessary re-renders
- Event handlers wrapped with useCallback to maintain referential equality
- Optimized lazy loading with improved suspense boundaries
- Added replace flag to navigations to prevent history stack issues

### Loading States:
- Better loading indicators with fallback UI
- Graceful degradation when Supabase is offline
- Optimistic UI updates where possible

## Development Guidelines

### Code Structure
- Use the provided folder structure for different types of components
- Create small, focused components (<100 lines of code where possible)
- Use TypeScript interfaces for all props and state
- Store logic is separated into slices for better maintainability

### State Management
- Use Zustand stores for global state
- Use React Query for server state management
- Follow the store patterns established in `/stores/transactions` directory

### Styling
- Use Tailwind CSS for styling components
- Leverage Shadcn UI components where appropriate
- Follow the design tokens in `src/styles/rizzpay-ui.ts`

### Testing
- Write unit tests for utility functions
- Test components in isolation
- Verify payment flows work end-to-end

## API Integrations

### HDFC Bank API
RizzPay integrates with HDFC Bank's API for NEFT transfers. Documentation: https://developer.hdfcbank.com/api-category-landing/34

Key features:
- Secure transfer of funds to any bank account
- Real-time transaction status updates
- Proper validation of bank details (IFSC codes, account numbers)

### Webhook System
RizzPay provides webhook functionality for merchants to integrate with their own systems:
- Custom callback URLs
- Event-based notifications
- Secure authentication using JWT tokens

## Security

RizzPay implements several security measures:
- All sensitive data is encrypted
- Payment processing follows PCI DSS guidelines
- Proper validation of all user inputs
- Protection against common security vulnerabilities
- Secure authentication flows for all user roles

---

For more details about specific components or development workflows, please refer to the specialized documentation in the `docs` directory.
