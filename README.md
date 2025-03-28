
# RizzPay - Secure Payment Processing Platform

## Overview

RizzPay is a modern payment processing platform designed for merchants to easily accept payments, manage transactions, and integrate payment functionality into their applications. The platform offers a comprehensive suite of tools including wallet management, transaction tracking, webhook integration, and developer resources.

## Features

- **Secure Authentication**: Multi-factor authentication system to protect merchant accounts
- **Dashboard**: Comprehensive dashboard with transaction analytics and statistics
- **Transaction Management**: Track, filter, and manage all payment transactions
- **Wallet System**: Digital wallet with deposit, withdrawal, and transfer capabilities  
- **Webhook Integration**: Set up and manage webhook endpoints for real-time notifications
- **Developer Tools**: API keys, documentation, and integration examples for developers
- **Payment Processing**: Support for multiple payment methods (cards, UPI, bank transfers)
- **Mobile App**: Android application for on-the-go payment management

## Implementation Details

- Built with React and TypeScript for a robust frontend experience
- Styled with Tailwind CSS for a responsive, modern UI
- Uses shadcn/ui components for consistent design patterns
- Implements React Router for navigation
- State management with Zustand for predictable state updates
- Integrates with various payment gateways for processing transactions
- Mobile app built with Capacitor

## Code Structure

The application follows a component-based architecture:

- `/src/components`: Reusable UI components
- `/src/pages`: Page-level components for different routes
- `/src/stores`: State management using Zustand stores
- `/src/hooks`: Custom React hooks for shared logic
- `/src/utils`: Utility functions and helper methods
- `/src/integrations`: Third-party integration code

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`
4. The application will be available at `http://localhost:8080`

## Authentication

The application uses a JWT-based authentication system:
- Merchants can register and log in securely
- Authentication state is maintained across sessions
- Protected routes require authentication

## Building Android APK

To build an Android APK:

1. Export the project to your GitHub repository
2. Clone the repository to your local machine
3. Install the dependencies:
   ```
   npm install
   ```
4. Build the web application:
   ```
   npm run build
   ```
5. Add the Android platform:
   ```
   npx cap add android
   ```
6. Sync the web code to the Android project:
   ```
   npx cap sync
   ```
7. Open the project in Android Studio:
   ```
   npx cap open android
   ```
8. In Android Studio, go to Build > Build Bundle(s) / APK(s) > Build APK(s)
9. The APK will be generated in the android/app/build/outputs/apk/debug folder

## Payment Processing

See the [Payment Documentation](PAYMENT_README.md) for detailed information about:
- Supported payment methods
- Transaction flow
- Wallet functionality
- Security measures

## Webhook Integration

See the [Webhook Documentation](WEBHOOK_README.md) for information about:
- Setting up webhook endpoints
- Event types
- Testing webhooks
- Security considerations

## Browser Support

The application is optimized for modern browsers:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Development

To contribute to this project:
1. Create a feature branch
2. Make your changes
3. Submit a pull request

## License

This project is protected under proprietary license. All rights reserved.
