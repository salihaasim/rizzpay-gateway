
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Wallet, ArrowRight, Link as LinkIcon } from 'lucide-react';
import AdminMerchantsList from '@/components/admin/AdminMerchantsList';
import EscrowAccount from '@/components/admin/EscrowAccount';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const AdminPlatformOverview = () => {
  const [activeTab, setActiveTab] = useState('merchants');
  const navigate = useNavigate();
  
  // Sample payment links data for demonstration
  const samplePaymentLinks = [
    {
      id: 'pl_123456',
      amount: '₹1,500.00',
      created: 'Today at 14:32',
      status: 'active',
      customer: 'John Doe'
    },
    {
      id: 'pl_123457',
      amount: '₹750.00',
      created: 'Today at 10:15',
      status: 'active',
      customer: 'Sarah Brown'
    },
    {
      id: 'pl_123458',
      amount: '₹3,200.00',
      created: 'Yesterday at 16:45',
      status: 'expired',
      customer: 'Tech Solutions Ltd'
    },
    {
      id: 'pl_123459',
      amount: '₹980.00',
      created: '2 days ago',
      status: 'paid',
      customer: 'Alex Wilson'
    },
  ];
  
  return (
    <Card className="border border-border/50 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-medium flex justify-between items-center">
          <span>Platform Overview</span>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs flex items-center gap-1"
            onClick={() => navigate('/admin/whitelist')}
          >
            Merchant Whitelist <ArrowRight className="h-3 w-3" />
          </Button>
        </CardTitle>
        <CardDescription>
          Manage your platform's merchants and finances
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs 
          defaultValue="merchants" 
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <TabsList className="grid grid-cols-3 max-w-md">
            <TabsTrigger value="merchants" className="flex items-center">
              <Users className="h-4 w-4 mr-2" />
              Merchants
            </TabsTrigger>
            <TabsTrigger value="wallets" className="flex items-center">
              <Wallet className="h-4 w-4 mr-2" />
              Wallets
            </TabsTrigger>
            <TabsTrigger value="links" className="flex items-center">
              <LinkIcon className="h-4 w-4 mr-2" />
              Payment Links
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="merchants" className="space-y-4">
            <AdminMerchantsList />
          </TabsContent>
          
          <TabsContent value="wallets" className="space-y-4">
            <EscrowAccount />
          </TabsContent>
          
          <TabsContent value="links" className="space-y-4">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium">Recent Payment Links</h3>
                <Button 
                  onClick={() => navigate('/payment?mode=generate-links')}
                  size="sm"
                  variant="outline"
                >
                  <LinkIcon className="h-4 w-4 mr-2" />
                  Generate Links
                </Button>
              </div>
              
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Link ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {samplePaymentLinks.map((link) => (
                      <TableRow key={link.id}>
                        <TableCell className="font-mono text-xs">{link.id}</TableCell>
                        <TableCell>{link.customer}</TableCell>
                        <TableCell>{link.amount}</TableCell>
                        <TableCell className="text-muted-foreground text-xs">{link.created}</TableCell>
                        <TableCell>
                          <Badge 
                            variant="outline" 
                            className={
                              link.status === 'active'
                                ? 'bg-blue-50 text-blue-700 border-blue-200'
                                : link.status === 'paid'
                                ? 'bg-green-50 text-green-700 border-green-200'
                                : 'bg-gray-50 text-gray-700 border-gray-200'
                            }
                          >
                            {link.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <span className="sr-only">View link details</span>
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              <div className="flex justify-end mt-2">
                <Button variant="link" size="sm" className="text-xs">
                  View all payment links
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AdminPlatformOverview;
