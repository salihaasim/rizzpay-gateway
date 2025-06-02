
# RizzPay Database

This folder contains all database schemas, migrations, and SQL scripts organized by functionality.

## Structure

```
rizzpay_database/
├── admin/                  # Admin-related database schemas
│   ├── tables/            # Admin table definitions
│   ├── functions/         # Admin-specific functions
│   ├── triggers/          # Admin-specific triggers
│   └── policies/          # Admin RLS policies
├── merchant/              # Merchant-related database schemas
│   ├── tables/            # Merchant table definitions
│   ├── functions/         # Merchant-specific functions
│   ├── triggers/          # Merchant-specific triggers
│   └── policies/          # Merchant RLS policies
└── shared/                # Shared database components
    ├── enums/             # Shared enums
    ├── functions/         # Shared functions
    └── extensions/        # Database extensions
```

## Database Architecture

The database is organized with clear separation between admin and merchant functionalities to ensure:
- Security isolation
- Scalability
- Clear data ownership
- Easier maintenance

## Migration Strategy

1. Apply shared components first
2. Create admin-specific schemas
3. Create merchant-specific schemas
4. Set up RLS policies
5. Create necessary indexes

## Security

All tables implement Row-Level Security (RLS) with appropriate policies for data isolation.
