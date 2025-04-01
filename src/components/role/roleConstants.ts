
import { Building2, Store } from 'lucide-react';
import React from 'react';

export const roles = [
  {
    id: 'admin',
    name: 'Admin',
    description: 'Full access to all settings, merchants, and transactions. Monitor and manage the entire system.',
    icon: React.createElement(Building2, { className: "h-8 w-8 text-primary" }),
    permissions: ['View all transactions', 'Manage merchants', 'System settings', 'Analytics access']
  },
  {
    id: 'merchant',
    name: 'Merchant',
    description: 'Accept payments, manage your store, and view transaction history for your business.',
    icon: React.createElement(Store, { className: "h-8 w-8 text-primary" }),
    permissions: ['Process payments', 'View your transactions', 'Business settings', 'Financial reports']
  }
];

export const demoCredentials = {
  admin: { username: 'rizzpay', password: 'rizzpay123' },
  merchant: { username: 'merchant', password: 'password' },
};
