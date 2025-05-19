
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const AdminMerchants: React.FC = () => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filterStatus, setFilterStatus] = React.useState('all');

  // Sample merchant data (in a real app, fetch from API)
  const merchants = [
    { id: 'M001', name: 'Acme Inc', email: 'contact@acme.com', status: 'active', kycStatus: 'verified', transactionVolume: '₹1,245,678', registered: '2023-01-15' },
    { id: 'M002', name: 'XYZ Corp', email: 'info@xyzcorp.com', status: 'active', kycStatus: 'verified', transactionVolume: '₹890,432', registered: '2023-03-22' },
    { id: 'M003', name: 'Tech Solutions', email: 'support@techsolutions.com', status: 'suspended', kycStatus: 'pending', transactionVolume: '₹456,123', registered: '2023-05-10' },
    { id: 'M004', name: 'Global Traders', email: 'business@globaltraders.com', status: 'active', kycStatus: 'rejected', transactionVolume: '₹2,345,678', registered: '2023-02-28' },
    { id: 'M005', name: 'Local Shop', email: 'sales@localshop.com', status: 'inactive', kycStatus: 'not_submitted', transactionVolume: '₹123,456', registered: '2023-07-15' }
  ];

  // Filter merchants based on search term and status
  const filteredMerchants = merchants.filter(merchant => {
    const matchesSearch = !searchTerm || 
      merchant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      merchant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      merchant.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || merchant.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Merchant Management</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Add New Merchant</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Merchant</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <label htmlFor="name" className="text-sm font-medium">Business Name</label>
                <Input id="name" placeholder="Enter business name" />
              </div>
              <div>
                <label htmlFor="email" className="text-sm font-medium">Business Email</label>
                <Input id="email" type="email" placeholder="Enter business email" />
              </div>
              <div>
                <label htmlFor="contact" className="text-sm font-medium">Contact Person</label>
                <Input id="contact" placeholder="Enter contact person's name" />
              </div>
              <div>
                <label htmlFor="phone" className="text-sm font-medium">Phone Number</label>
                <Input id="phone" placeholder="Enter phone number" />
              </div>
              <div className="pt-4">
                <Button className="w-full">Create Merchant Account</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Merchant Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div>
              <label htmlFor="search" className="text-sm font-medium">Search</label>
              <Input
                id="search"
                placeholder="Search by name, email, or ID"
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
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label htmlFor="kyc-status" className="text-sm font-medium">KYC Status</label>
              <Select defaultValue="all">
                <SelectTrigger id="kyc-status">
                  <SelectValue placeholder="Select KYC status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="not_submitted">Not Submitted</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button>Apply Filters</Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Merchant List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="py-3 text-left">Merchant ID</th>
                  <th className="py-3 text-left">Name</th>
                  <th className="py-3 text-left">Email</th>
                  <th className="py-3 text-left">KYC Status</th>
                  <th className="py-3 text-left">Transaction Volume</th>
                  <th className="py-3 text-left">Registered</th>
                  <th className="py-3 text-left">Status</th>
                  <th className="py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMerchants.map((merchant) => (
                  <tr key={merchant.id} className="border-b hover:bg-muted/50">
                    <td className="py-3">{merchant.id}</td>
                    <td className="py-3">{merchant.name}</td>
                    <td className="py-3">{merchant.email}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 text-xs rounded ${
                        merchant.kycStatus === 'verified' 
                          ? 'bg-green-100 text-green-800' 
                          : merchant.kycStatus === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : merchant.kycStatus === 'rejected'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {merchant.kycStatus.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3">{merchant.transactionVolume}</td>
                    <td className="py-3">{new Date(merchant.registered).toLocaleDateString()}</td>
                    <td className="py-3">
                      <div className="flex items-center space-x-2">
                        <Switch defaultChecked={merchant.status === 'active'} />
                        <span>{merchant.status}</span>
                      </div>
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
  );
};

export default AdminMerchants;
