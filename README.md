
# RizzPay Payment Gateway

A modern, user-friendly payment gateway platform with admin and merchant interfaces.

## Features

### Admin Features
- **Dashboard:** Monitor platform performance, transactions, and merchant activity
- **Merchant Management:** Approve, suspend and manage merchant accounts
- **Escrow Account:** Control platform funds and perform settlements
- **Pricing Controls:** Set and adjust transaction fee rates for merchants
- **Role Management:** Create and manage user roles with different permissions
- **Bank API Integration:** Connect to banking systems for automated transfers
- **Transaction Logs:** View and export detailed transaction history
- **Merchant Whitelist:** Manage trusted merchants with privileged access

### Merchant Features
- **Dashboard:** Track sales, transactions, and account balance
- **Payment Processing:** Accept payments via UPI, cards, and net banking
- **Settlement History:** View incoming and outgoing fund movements
- **API Integration:** Get API keys and integration code for websites
- **Security Settings:** Manage account security and password changes
- **Pricing Information:** View current transaction fee rates

## Demo Credentials

### Admin Login
- Username: `rizzpay`
- Password: `rizzpay123`

### Merchant Login
- Username: `merchant`
- Password: `password`

## Development

### Authentication
- The application uses a custom authentication system
- Users can register as merchants or log in as admins
- Different user roles have different permissions and access levels

### Mobile App
- The application is optimized for Android and iOS
- Native app features are provided via Capacitor

### Security Features
- Password management with secure storage
- API key management for merchants
- Bank API integration for secure transactions

### Performance Optimizations
- Responsive design for all device sizes
- Optimized loading times and application speed
- Reduced page refreshes for improved user experience

## Technologies Used
- React with TypeScript
- Tailwind CSS for styling
- Shadcn UI component library
- Zustand for state management
- Capacitor for native mobile features
- Supabase for backend services

## Installation and Setup
1. Clone the repository
2. Run `npm install` to install dependencies
3. Run `npm run dev` to start the development server
4. Access the application at `http://localhost:5173`

## Deployment
- The application can be deployed to any static hosting service
- Follow Capacitor documentation for deploying to mobile app stores

## License
This project is licensed under the MIT License.
