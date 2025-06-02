
import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

const AdminTransactions: React.FC = () => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filterStatus, setFilterStatus] = React.useState('all');

  // Sample transaction data (in a real app, fetch from API)
  const transactions = [
    { id: 'TXN123456', date: '2023-09-15T10:34:23Z', amount: '₹1,200.00', merchant: 'Acme Inc', customer: 'John Doe', status: 'successful' },
    { id: 'TXN123455', date: '2023-09-14T14:12:45Z', amount: '₹450.50', merchant: 'XYZ Corp', customer: 'Jane Smith', status: 'successful' },
    { id: 'TXN123454', date: '2023-09-13T08:23:11Z', amount: '₹5,000.00', merchant: 'ABC Ltd', customer: 'Mike Brown', status: 'failed' },
    { id: 'TXN123453', date: '2023-09-12T19:45:32Z', amount: '₹750.25', merchant: 'Tech Solutions', customer: 'Sarah Lee', status: 'pending' },
    { id: 'TXN123452', date: '2023-09-10T11:22:09Z', amount: '₹3,200.00', merchant: 'Acme Inc', customer: 'Robert White', status: 'successful' }
  ];

  // Filter transactions based on search term and status
  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = !searchTerm || 
      transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.merchant.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.customer.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || transaction.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Transactions Management</h1>
          <p className="text-muted-foreground mt-1">
            Monitor and manage all system transactions
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Transaction Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <div>
                <label htmlFor="search" className="text-sm font-medium">Search</label>
                <Input
                  id="search"
                  placeholder="Search by ID, merchant, or customer"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="status" className="text-sm font-medium">Status</label>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="successful">Successful</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label htmlFor="date" className="text-sm font-medium">Date Range</label>
                <Input id="date" type="date" />
              </div>
              <div className="flex items-end">
                <Button>Apply Filters</Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Transaction List</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="py-3 text-left">Transaction ID</th>
                    <th className="py-3 text-left">Date</th>
                    <th className="py-3 text-left">Amount</th>
                    <th className="py-3 text-left">Merchant</th>
                    <th className="py-3 text-left">Customer</th>
                    <th className="py-3 text-left">Status</th>
                    <th className="py-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map((transaction) => (
                    <tr key={transaction.id} className="border-b hover:bg-muted/50">
                      <td className="py-3">{transaction.id}</td>
                      <td className="py-3">{new Date(transaction.date).toLocaleDateString()}</td>
                      <td className="py-3">{transaction.amount}</td>
                      <td className="py-3">{transaction.merchant}</td>
                      <td className="py-3">{transaction.customer}</td>
                      <td className="py-3">
                        <span className={`px-2 py-1 text-xs rounded ${
                          transaction.status === 'successful' 
                            ? 'bg-green-100 text-green-800' 
                            : transaction.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {transaction.status}
                        </span>
                      </td>
                      <td className="py-3">
                        <Button variant="ghost" size="sm">View</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminTransactions;
