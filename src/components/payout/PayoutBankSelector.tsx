
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { BankIntegrationService } from '@/services/BankIntegrationService';
import { Clock, CreditCard, DollarSign } from 'lucide-react';

interface PayoutBankSelectorProps {
  selectedBank: string;
  onBankChange: (bank: string) => void;
  amount: number;
  payoutMethod: string;
}

const PayoutBankSelector: React.FC<PayoutBankSelectorProps> = ({
  selectedBank,
  onBankChange,
  amount,
  payoutMethod
}) => {
  const supportedBanks = BankIntegrationService.getSupportedBanks();
  const selectedBankConfig = BankIntegrationService.getBankConfig(selectedBank);
  
  const calculateFee = (bankCode: string) => {
    return BankIntegrationService.calculateProcessingFee(amount, payoutMethod, bankCode);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Select Banking Partner
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedBank} onValueChange={onBankChange}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a banking partner" />
            </SelectTrigger>
            <SelectContent>
              {supportedBanks.map(({ code, config }) => (
                <SelectItem key={code} value={code}>
                  <div className="flex items-center justify-between w-full">
                    <span>{config.name}</span>
                    <div className="flex items-center gap-2 ml-4">
                      <Badge variant="secondary" className="text-xs">
                        ₹{calculateFee(code)}
                      </Badge>
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {selectedBankConfig && (
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-500" />
                <div>
                  <p className="text-sm font-medium">Processing Time</p>
                  <p className="text-xs text-muted-foreground">
                    {selectedBankConfig.processingTime}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-green-500" />
                <div>
                  <p className="text-sm font-medium">Processing Fee</p>
                  <p className="text-xs text-muted-foreground">
                    ₹{calculateFee(selectedBank)} + GST
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Supported Methods:</strong> {selectedBankConfig.supportedMethods.join(', ')}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PayoutBankSelector;
