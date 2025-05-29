
import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import EscrowAccount from '@/components/admin/EscrowAccount';

const AdminEscrow = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Escrow Account Management</h1>
            <p className="text-gray-600 mt-2">
              Monitor and manage the platform's escrow account and settlements
            </p>
          </div>
        </div>
        
        <EscrowAccount />
      </div>
    </AdminLayout>
  );
};

export default AdminEscrow;
