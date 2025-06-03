
# RizzPay Backend API

A comprehensive payment processing backend API built with Express.js, TypeScript, and Supabase.

## Features

- **RESTful API** with Express.js and TypeScript
- **Authentication & Authorization** with JWT and API keys
- **Input Validation** using Zod schemas
- **Rate Limiting** for API protection
- **Error Handling** with centralized error management
- **Request Logging** for monitoring and debugging
- **CORS & Security** with Helmet and security headers
- **Database Integration** with Supabase
- **Webhook Support** for bank integrations

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Merchants
- `POST /api/merchants` - Create merchant profile
- `GET /api/merchants/:merchantId` - Get merchant details
- `PATCH /api/merchants/:merchantId` - Update merchant profile
- `POST /api/merchants/:merchantId/accounts` - Add bank account
- `GET /api/merchants/:merchantId/accounts` - Get bank accounts
- `POST /api/merchants/:merchantId/api-key` - Generate API key
- `GET /api/merchants/:merchantId/wallet/balance` - Get wallet balance

### Payouts
- `POST /api/payouts` - Create payout request
- `GET /api/payouts/:payoutId` - Get payout status
- `GET /api/payouts/merchant/:merchantId` - Get merchant payouts
- `POST /api/payouts/:payoutId/retry` - Retry failed payout

### Webhooks
- `POST /api/webhooks/payout-status` - Bank webhook callback
- `GET /api/webhooks/health` - Webhook health check

### Admin
- `GET /api/admin/stats` - Dashboard statistics
- `GET /api/admin/merchants` - Merchant management
- `GET /api/admin/payouts` - Payout management

## Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Configuration**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Development**
   ```bash
   npm run dev
   ```

4. **Production Build**
   ```bash
   npm run build
   npm start
   ```

## Security Features

- **Rate Limiting**: 100 requests per 15 minutes per IP
- **CORS Protection**: Configurable allowed origins
- **Helmet Security**: Security headers and protection
- **Input Validation**: Comprehensive Zod schema validation
- **API Key Authentication**: Secure merchant authentication
- **JWT Token Authentication**: Admin user authentication

## Error Handling

The API uses centralized error handling with proper HTTP status codes:
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (authentication required)
- `404` - Not Found
- `429` - Too Many Requests (rate limiting)
- `500` - Internal Server Error

## Logging

All API requests are logged with:
- Request method and URL
- Response status code
- Response time
- Client IP and User-Agent
- Timestamp

## Development

- **TypeScript**: Full type safety
- **Hot Reload**: Development server with auto-restart
- **Linting**: ESLint configuration
- **Formatting**: Prettier code formatting
- **Testing**: Jest test framework setup
