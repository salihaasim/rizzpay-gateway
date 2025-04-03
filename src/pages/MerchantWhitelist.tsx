
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PlusCircle, Check, X, Mail, UserPlus, ShieldCheck, AlertTriangle, Download } from 'lucide-react';
import { toast } from "sonner";
import AdminLayout from '@/components/admin/AdminLayout';
import { Badge } from '@/components/ui/badge';
import { useTransactionStore } from '@/stores/transactionStore';

const MerchantWhitelist = () => {
  // State for whitelist entries
  const [whitelist, setWhitelist] = useState([
    { id: 1, email: 'trusted@merchant.com', name: 'Trusted Merchant', status: 'approved', date: '2023-12-01' },
    { id: 2, email: 'pending@merchant.com', name: 'Pending Approval', status: 'pending', date: '2023-12-15' },
  ]);
  
  // State for new whitelist entry
  const [newEntry, setNewEntry] = useState({ email: '', name: '' });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { userRole } = useTransactionStore();
  
  // Add new merchant to whitelist
  const handleAddToWhitelist = () => {
    if (newEntry.email && newEntry.name) {
      setWhitelist([...whitelist, {
        id: whitelist.length + 1,
        email: newEntry.email,
        name: newEntry.name,
        status: 'pending',
        date: new Date().toISOString().split('T')[0]
      }]);
      setNewEntry({ email: '', name: '' });
      setDialogOpen(false);
      toast.success('Merchant added to whitelist for approval');
    } else {
      toast.error('Please fill in all fields');
    }
  };
  
  // Approve merchant
  const handleApprove = (id) => {
    setWhitelist(whitelist.map(item => 
      item.id === id ? { ...item, status: 'approved' } : item
    ));
    toast.success('Merchant approved and whitelisted');
  };
  
  // Reject merchant
  const handleReject = (id) => {
    setWhitelist(whitelist.filter(item => item.id !== id));
    toast.success('Merchant removed from whitelist');
  };

  // Export whitelist to CSV
  const handleExportWhitelist = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "ID,Name,Email,Status,Date\n" + 
      whitelist.map(item => `${item.id},"${item.name}","${item.email}","${item.status}","${item.date}"`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "merchant-whitelist.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Whitelist exported successfully');
  };

  // Filter whitelist based on search term
  const filteredWhitelist = whitelist.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Merchant Whitelist</h1>
            <p className="text-muted-foreground mt-1">
              Manage trusted merchants with privileged access
            </p>
          </div>
          
          <div className="flex space-x-3">
            <Button variant="outline" onClick={handleExportWhitelist}>
              <Download className="mr-2 h-4 w-4" />
              Export Whitelist
            </Button>
            
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add Merchant to Whitelist
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Merchant to Whitelist</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-3">
                  <div className="space-y-2">
                    <Label htmlFor="merchant-email">Merchant Email</Label>
                    <Input 
                      id="merchant-email" 
                      placeholder="email@example.com"
                      value={newEntry.email}
                      onChange={(e) => setNewEntry({...newEntry, email: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="merchant-name">Merchant Name</Label>
                    <Input 
                      id="merchant-name" 
                      placeholder="Company Name"
                      value={newEntry.name}
                      onChange={(e) => setNewEntry({...newEntry, name: e.target.value})}
                    />
                  </div>
                  <div className="pt-3 flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddToWhitelist}>
                      Add to Whitelist
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        <div className="my-6">
          <Input
            placeholder="Search merchants..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </div>
        
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Whitelisted Merchants</CardTitle>
            <CardDescription>
              Pre-approved merchants with special permissions and pricing
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {filteredWhitelist.length === 0 ? (
              <div className="py-12 flex flex-col items-center justify-center text-center">
                <AlertTriangle className="h-12 w-12 text-muted-foreground/40 mb-4" />
                <h3 className="text-lg font-medium">No merchants in whitelist</h3>
                <p className="text-sm text-muted-foreground max-w-sm mt-1">
                  Start by adding trusted merchants to your whitelist to provide them with special access and pricing.
                </p>
                <Button className="mt-4" onClick={() => setDialogOpen(true)}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Your First Merchant
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Merchant</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Added On</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredWhitelist.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Mail className="h-3 w-3 mr-2 text-muted-foreground" />
                          {item.email}
                        </div>
                      </TableCell>
                      <TableCell>
                        {item.status === 'approved' ? (
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            <Check className="h-3 w-3 mr-1" />
                            Approved
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Pending
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>{item.date}</TableCell>
                      <TableCell className="text-right">
                        {item.status === 'pending' ? (
                          <div className="flex justify-end space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="h-8 px-2 text-green-600 border-green-200 hover:bg-green-50"
                              onClick={() => handleApprove(item.id)}
                            >
                              <Check className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="h-8 px-2 text-red-600 border-red-200 hover:bg-red-50"
                              onClick={() => handleReject(item.id)}
                            >
                              <X className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                          </div>
                        ) : (
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="h-8 px-3"
                            onClick={() => toast.success('Special pricing settings opened')}
                          >
                            <ShieldCheck className="h-4 w-4 mr-1" />
                            View Settings
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default MerchantWhitelist;
