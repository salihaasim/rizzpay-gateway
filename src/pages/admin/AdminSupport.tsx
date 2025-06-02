
import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, MessageSquare, Phone, Mail, Clock, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import { Helmet } from 'react-helmet';

const AdminSupport: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Sample support tickets data (in a real app, fetch from API)
  const supportTickets = [
    { 
      id: 'SUP001', 
      subject: 'Payment Gateway Integration Issue', 
      merchant: 'Acme Inc', 
      email: 'contact@acme.com', 
      status: 'open', 
      priority: 'high', 
      created: '2023-09-15T10:30:00Z',
      lastUpdate: '2023-09-15T14:20:00Z'
    },
    { 
      id: 'SUP002', 
      subject: 'KYC Document Verification Delay', 
      merchant: 'XYZ Corp', 
      email: 'info@xyzcorp.com', 
      status: 'in_progress', 
      priority: 'medium', 
      created: '2023-09-14T09:15:00Z',
      lastUpdate: '2023-09-15T11:00:00Z'
    },
    { 
      id: 'SUP003', 
      subject: 'Transaction Settlement Query', 
      merchant: 'Tech Solutions', 
      email: 'support@techsolutions.com', 
      status: 'resolved', 
      priority: 'low', 
      created: '2023-09-13T16:45:00Z',
      lastUpdate: '2023-09-14T10:30:00Z'
    },
    { 
      id: 'SUP004', 
      subject: 'API Rate Limit Exceeded', 
      merchant: 'Global Traders', 
      email: 'business@globaltraders.com', 
      status: 'closed', 
      priority: 'high', 
      created: '2023-09-12T08:20:00Z',
      lastUpdate: '2023-09-13T17:45:00Z'
    }
  ];

  // Filter tickets based on search term and status
  const filteredTickets = supportTickets.filter(ticket => {
    const matchesSearch = !searchTerm || 
      ticket.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.merchant.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || ticket.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-red-100 text-red-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open': return <AlertCircle className="h-4 w-4" />;
      case 'in_progress': return <Clock className="h-4 w-4" />;
      case 'resolved': return <CheckCircle className="h-4 w-4" />;
      case 'closed': return <XCircle className="h-4 w-4" />;
      default: return <MessageSquare className="h-4 w-4" />;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <Helmet>
          <title>Support Management | RizzPay Admin</title>
        </Helmet>
        
        <div>
          <h1 className="text-2xl font-bold">Support Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage customer support tickets and inquiries
          </p>
        </div>

        {/* Support Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <AlertCircle className="h-8 w-8 text-red-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Open Tickets</p>
                  <p className="text-2xl font-bold">
                    {supportTickets.filter(t => t.status === 'open').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-yellow-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">In Progress</p>
                  <p className="text-2xl font-bold">
                    {supportTickets.filter(t => t.status === 'in_progress').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-green-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Resolved</p>
                  <p className="text-2xl font-bold">
                    {supportTickets.filter(t => t.status === 'resolved').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <MessageSquare className="h-8 w-8 text-blue-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Tickets</p>
                  <p className="text-2xl font-bold">{supportTickets.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Support Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Support Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <label htmlFor="search" className="text-sm font-medium">Search</label>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Search tickets, merchants, or subjects"
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="status" className="text-sm font-medium">Status</label>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button>Apply Filters</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Support Tickets List */}
        <Card>
          <CardHeader>
            <CardTitle>Support Tickets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="py-3 text-left">Ticket ID</th>
                    <th className="py-3 text-left">Subject</th>
                    <th className="py-3 text-left">Merchant</th>
                    <th className="py-3 text-left">Status</th>
                    <th className="py-3 text-left">Priority</th>
                    <th className="py-3 text-left">Created</th>
                    <th className="py-3 text-left">Last Update</th>
                    <th className="py-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTickets.map((ticket) => (
                    <tr key={ticket.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 font-medium">{ticket.id}</td>
                      <td className="py-3">
                        <div className="max-w-xs truncate">{ticket.subject}</div>
                      </td>
                      <td className="py-3">
                        <div>
                          <div className="font-medium">{ticket.merchant}</div>
                          <div className="text-sm text-gray-500">{ticket.email}</div>
                        </div>
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(ticket.status)}
                          <Badge className={getStatusColor(ticket.status)}>
                            {ticket.status.replace('_', ' ')}
                          </Badge>
                        </div>
                      </td>
                      <td className="py-3">
                        <Badge className={getPriorityColor(ticket.priority)}>
                          {ticket.priority}
                        </Badge>
                      </td>
                      <td className="py-3">
                        {new Date(ticket.created).toLocaleDateString()}
                      </td>
                      <td className="py-3">
                        {new Date(ticket.lastUpdate).toLocaleDateString()}
                      </td>
                      <td className="py-3">
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">
                            <MessageSquare className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Mail className="h-4 w-4 mr-1" />
                            Reply
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <Button className="h-20 flex flex-col gap-2">
                <MessageSquare className="h-6 w-6" />
                Create New Ticket
              </Button>
              <Button variant="outline" className="h-20 flex flex-col gap-2">
                <Mail className="h-6 w-6" />
                Send Broadcast
              </Button>
              <Button variant="outline" className="h-20 flex flex-col gap-2">
                <Phone className="h-6 w-6" />
                Schedule Call
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminSupport;
