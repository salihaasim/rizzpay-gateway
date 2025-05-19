
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Pencil, PenLine, Percent, IndianRupee, RotateCcw } from 'lucide-react';
import { useMerchantAuth } from '@/stores/merchantAuthStore';
import { toast } from 'sonner';

const MerchantPricingControl = () => {
  const { merchants, updateMerchantPricing } = useMerchantAuth();
  const [editOpen, setEditOpen] = useState(false);
  const [selectedMerchant, setSelectedMerchant] = useState<string | null>(null);
  const [pricingForm, setPricingForm] = useState({
    transactionFee: 1.0, // Default to 1.0%
    fixedFee: 5,
    monthlyFee: 499
  });

  // Only get merchants with role 'merchant'
  const merchantUsers = merchants.filter(m => m.role === 'merchant');

  const handleEdit = (username: string) => {
    const merchant = merchants.find(m => m.username === username);
    if (merchant && merchant.pricing) {
      setPricingForm({
        transactionFee: merchant.pricing.transactionFee,
        fixedFee: merchant.pricing.fixedFee,
        monthlyFee: merchant.pricing.monthlyFee
      });
      setSelectedMerchant(username);
      setEditOpen(true);
    } else {
      // Default pricing if none exists
      setPricingForm({
        transactionFee: 1.0, // Updated default to 1.0%
        fixedFee: 5,
        monthlyFee: 499
      });
      setSelectedMerchant(username);
      setEditOpen(true);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPricingForm(prev => ({
      ...prev,
      [name]: parseFloat(value) || 0
    }));
  };

  const handleSave = () => {
    if (selectedMerchant) {
      updateMerchantPricing(selectedMerchant, pricingForm);
      toast.success(`Pricing updated for ${selectedMerchant}`);
      setEditOpen(false);
      setSelectedMerchant(null);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border border-border/50 shadow-sm">
        <CardHeader>
          <CardTitle>Merchant Pricing Control</CardTitle>
          <CardDescription>
            Manage pricing plans for your merchants. Default payment in: 1%, payment out: 1%
          </CardDescription>
        </CardHeader>
        <CardContent>
          {merchantUsers.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              No merchants found. Add merchants to manage their pricing.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Merchant</TableHead>
                  <TableHead>Transaction Fee</TableHead>
                  <TableHead>Fixed Fee</TableHead>
                  <TableHead>Monthly Fee</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {merchantUsers.map((merchant) => (
                  <TableRow key={merchant.username}>
                    <TableCell className="font-medium">{merchant.fullName}</TableCell>
                    <TableCell>
                      {merchant.pricing ? (
                        <Badge variant="outline" className="font-mono">
                          <Percent className="h-3 w-3 mr-1" />
                          {merchant.pricing.transactionFee}%
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-muted">Not set</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {merchant.pricing ? (
                        <Badge variant="outline" className="font-mono">
                          <IndianRupee className="h-3 w-3 mr-1" />
                          {merchant.pricing.fixedFee}
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-muted">Not set</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {merchant.pricing ? (
                        <Badge variant="outline" className="font-mono">
                          <IndianRupee className="h-3 w-3 mr-1" />
                          {merchant.pricing.monthlyFee}/mo
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-muted">Not set</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEdit(merchant.username)}
                      >
                        <PenLine className="h-4 w-4 mr-2" />
                        Edit Pricing
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Merchant Pricing</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="transactionFee" className="text-right col-span-1">
                Transaction Fee %
              </Label>
              <div className="col-span-3 relative">
                <Input
                  id="transactionFee"
                  name="transactionFee"
                  type="number"
                  step="0.01"
                  value={pricingForm.transactionFee}
                  onChange={handleInputChange}
                  className="pr-8"
                />
                <Percent className="h-4 w-4 absolute right-3 top-3 text-muted-foreground" />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="fixedFee" className="text-right col-span-1">
                Fixed Fee ₹
              </Label>
              <div className="col-span-3 relative">
                <Input
                  id="fixedFee"
                  name="fixedFee"
                  type="number"
                  step="0.5"
                  value={pricingForm.fixedFee}
                  onChange={handleInputChange}
                  className="pr-8"
                />
                <IndianRupee className="h-4 w-4 absolute right-3 top-3 text-muted-foreground" />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="monthlyFee" className="text-right col-span-1">
                Monthly Fee ₹
              </Label>
              <div className="col-span-3 relative">
                <Input
                  id="monthlyFee"
                  name="monthlyFee"
                  type="number"
                  value={pricingForm.monthlyFee}
                  onChange={handleInputChange}
                  className="pr-8"
                />
                <IndianRupee className="h-4 w-4 absolute right-3 top-3 text-muted-foreground" />
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setEditOpen(false)}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleSave}>
              <Pencil className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MerchantPricingControl;
