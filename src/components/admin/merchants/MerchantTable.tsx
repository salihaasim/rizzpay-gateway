
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useProfileStore, Merchant } from '@/stores/profileStore';
import { useTransactionStore } from '@/stores/transactionStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  FileText, 
  CheckCircle, 
  XCircle,
  User
} from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import KycDocumentViewer from '../KycDocumentViewer';
import { toast } from 'sonner';
import MerchantWalletDetails from './MerchantWalletDetails';

const MerchantTable: React.FC = () => {
  const { merchants, updateMerchantKycStatus } = useProfileStore();
  const { getWalletBalance } = useTransactionStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [selectedMerchant, setSelectedMerchant] = useState<Merchant | null>(null);
  
  const handleKycStatusChange = (merchantId: string, status: 'approved' | 'rejected') => {
    updateMerchantKycStatus(merchantId, status);
    toast.success(`Merchant KYC ${status === 'approved' ? 'approved' : 'rejected'} successfully`);
  };
  
  const getFilteredMerchants = () => {
    let filtered = merchants.filter(merchant => 
      merchant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      merchant.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      merchant.company.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    if (activeTab === 'pending') {
      filtered = filtered.filter(merchant => merchant.kycStatus === 'pending');
    } else if (activeTab === 'approved') {
      filtered = filtered.filter(merchant => merchant.kycStatus === 'approved');
    } else if (activeTab === 'rejected') {
      filtered = filtered.filter(merchant => merchant.kycStatus === 'rejected');
    }
    
    return filtered;
  };
  
  const filteredMerchants = getFilteredMerchants();
  
  const getKycBadgeVariant = (status: string | undefined) => {
    switch (status) {
      case 'approved': return 'secondary';
      case 'rejected': return 'destructive';
      default: return 'outline';
    }
  };
  
  return (
    <Card className="border shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <CardTitle className="text-xl">Merchant Accounts</CardTitle>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search merchants..."
              className="pl-8 w-full md:w-[240px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList>
            <TabsTrigger value="all">All Merchants</TabsTrigger>
            <TabsTrigger value="pending" className="flex items-center gap-1">
              <FileText className="h-4 w-4" />
              Pending KYC
            </TabsTrigger>
            <TabsTrigger value="approved" className="flex items-center gap-1">
              <CheckCircle className="h-4 w-4" />
              Approved KYC
            </TabsTrigger>
            <TabsTrigger value="rejected" className="flex items-center gap-1">
              <XCircle className="h-4 w-4" />
              Rejected KYC
            </TabsTrigger>
          </TabsList>
        </Tabs>
        
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Join Date</TableHead>
              <TableHead>Wallet Balance</TableHead>
              <TableHead>KYC Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMerchants.length > 0 ? (
              filteredMerchants.map((merchant) => (
                <TableRow key={merchant.id}>
                  <TableCell className="font-medium">{merchant.name}</TableCell>
                  <TableCell>{merchant.email}</TableCell>
                  <TableCell>{merchant.company}</TableCell>
                  <TableCell>{new Date(merchant.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>₹{getWalletBalance(merchant.email).toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant={getKycBadgeVariant(merchant.kycStatus)}>
                      {merchant.kycStatus ? (
                        merchant.kycStatus.charAt(0).toUpperCase() + merchant.kycStatus.slice(1)
                      ) : (
                        "Not Submitted"
                      )}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      {merchant.kycData && (
                        <KycDocumentViewer
                          merchantId={merchant.id}
                          merchantName={merchant.name}
                          kycData={merchant.kycData}
                          kycStatus={merchant.kycStatus || 'pending'}
                          onStatusChange={(status) => handleKycStatusChange(merchant.id, status)}
                        />
                      )}
                      
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedMerchant(merchant)}
                          >
                            View Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl">
                          <DialogHeader>
                            <DialogTitle>Merchant Details: {merchant.name}</DialogTitle>
                            <DialogDescription>
                              {merchant.company} • {merchant.email}
                            </DialogDescription>
                          </DialogHeader>
                          <MerchantWalletDetails merchant={merchant} />
                        </DialogContent>
                      </Dialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center h-24">
                  <div className="flex flex-col items-center justify-center">
                    <User className="h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">No merchants found</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default MerchantTable;
