
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const AdminKYC: React.FC = () => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filterStatus, setFilterStatus] = React.useState('all');

  // Sample KYC data (in a real app, fetch from API)
  const kycApplications = [
    { id: 'KYC001', merchant: 'Acme Inc', documentType: 'business_registration', submittedDate: '2023-09-10T11:22:09Z', status: 'pending', reviewer: '' },
    { id: 'KYC002', merchant: 'XYZ Corp', documentType: 'pan_card', submittedDate: '2023-09-08T14:12:45Z', status: 'approved', reviewer: 'Admin User' },
    { id: 'KYC003', merchant: 'Tech Solutions', documentType: 'address_proof', submittedDate: '2023-09-07T08:23:11Z', status: 'rejected', reviewer: 'Admin User' },
    { id: 'KYC004', merchant: 'Global Traders', documentType: 'gst_certificate', submittedDate: '2023-09-05T19:45:32Z', status: 'pending', reviewer: '' },
    { id: 'KYC005', merchant: 'Local Shop', documentType: 'business_registration', submittedDate: '2023-09-01T10:34:23Z', status: 'approved', reviewer: 'Admin User' }
  ];

  // Filter KYC applications based on search term and status
  const filteredApplications = kycApplications.filter(app => {
    const matchesSearch = !searchTerm || 
      app.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.merchant.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || app.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">KYC Management</h1>
      
      <Tabs defaultValue="pending">
        <TabsList className="mb-6">
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
          <TabsTrigger value="all">All Applications</TabsTrigger>
        </TabsList>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>KYC Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <label htmlFor="search" className="text-sm font-medium">Search</label>
                <Input
                  id="search"
                  placeholder="Search by ID or merchant"
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
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button>Apply Filters</Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <TabsContent value="pending">
          <Card>
            <CardHeader>
              <CardTitle>Pending KYC Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <KYCApplicationTable 
                applications={filteredApplications.filter(app => app.status === 'pending')} 
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="approved">
          <Card>
            <CardHeader>
              <CardTitle>Approved KYC Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <KYCApplicationTable 
                applications={filteredApplications.filter(app => app.status === 'approved')} 
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="rejected">
          <Card>
            <CardHeader>
              <CardTitle>Rejected KYC Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <KYCApplicationTable 
                applications={filteredApplications.filter(app => app.status === 'rejected')} 
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>All KYC Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <KYCApplicationTable applications={filteredApplications} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface KYCApplicationTableProps {
  applications: Array<{
    id: string;
    merchant: string;
    documentType: string;
    submittedDate: string;
    status: string;
    reviewer: string;
  }>;
}

const KYCApplicationTable: React.FC<KYCApplicationTableProps> = ({ applications }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="py-3 text-left">Application ID</th>
            <th className="py-3 text-left">Merchant</th>
            <th className="py-3 text-left">Document Type</th>
            <th className="py-3 text-left">Submitted Date</th>
            <th className="py-3 text-left">Status</th>
            <th className="py-3 text-left">Reviewer</th>
            <th className="py-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {applications.length === 0 ? (
            <tr>
              <td colSpan={7} className="py-6 text-center text-gray-500">No KYC applications found</td>
            </tr>
          ) : (
            applications.map((app) => (
              <tr key={app.id} className="border-b hover:bg-muted/50">
                <td className="py-3">{app.id}</td>
                <td className="py-3">{app.merchant}</td>
                <td className="py-3">{app.documentType.replace('_', ' ')}</td>
                <td className="py-3">{new Date(app.submittedDate).toLocaleDateString()}</td>
                <td className="py-3">
                  <span className={`px-2 py-1 text-xs rounded ${
                    app.status === 'approved' 
                      ? 'bg-green-100 text-green-800' 
                      : app.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {app.status}
                  </span>
                </td>
                <td className="py-3">{app.reviewer || '-'}</td>
                <td className="py-3">
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">View</Button>
                    {app.status === 'pending' && (
                      <>
                        <Button variant="outline" size="sm" className="text-green-600">Approve</Button>
                        <Button variant="outline" size="sm" className="text-red-600">Reject</Button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminKYC;
