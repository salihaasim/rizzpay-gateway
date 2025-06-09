
import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import EscrowAccount from '@/components/admin/EscrowAccount';

const AdminEscrow = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Escrow Management</h1>
            <p className="text-muted-foreground">Manage escrow accounts, bank connections, and transaction settlements</p>
          </div>
        </div>
        
        <EscrowAccount />
      </div>
    </AdminLayout>
  );
};

export default AdminEscrow;
