
import React, { useState } from 'react';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { AlertTriangle } from 'lucide-react';
import { toast } from "sonner";
import { 
  enableGamblingMode,
  disableGamblingMode,
  isGamblingModeEnabled,
  updateGamblingModeSettings
} from '@/gambling_mode/admin_controls';
import { useTransactionStore } from '@/stores/transactionStore';

interface MerchantGamblingSwitchProps {
  merchantId: string;
  merchantName: string;
}

const MerchantGamblingSwitch: React.FC<MerchantGamblingSwitchProps> = ({
  merchantId,
  merchantName
}) => {
  const { userEmail } = useTransactionStore();
  const [isEnabled, setIsEnabled] = useState(() => isGamblingModeEnabled(merchantId));
  const [isLoading, setIsLoading] = useState(false);

  const handleToggleGamblingMode = async (enabled: boolean) => {
    setIsLoading(true);
    
    try {
      if (enabled) {
        // Enable gambling mode with default settings
        enableGamblingMode(merchantId, userEmail || 'admin', {
          obfuscateDescriptors: true,
          rotatePayoutEndpoints: true,
          hideSensitiveTransactions: true
        });
        
        toast.success(`Gambling Mode enabled for ${merchantName}`);
      } else {
        // Disable gambling mode
        disableGamblingMode(merchantId, userEmail || 'admin');
        toast.success(`Gambling Mode disabled for ${merchantName}`);
      }
      
      setIsEnabled(enabled);
    } catch (error) {
      console.error('Error toggling gambling mode:', error);
      toast.error('Failed to update gambling mode settings');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="flex flex-col space-y-2">
      <div className="flex items-center justify-between space-x-2 p-4 rounded-md border border-amber-200 bg-amber-50">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
          <div>
            <h4 className="font-medium text-amber-900">Gambling Mode</h4>
            <p className="text-sm text-amber-700">
              When enabled, this merchant will operate with enhanced privacy features, 
              obfuscated descriptors and rotating payout endpoints.
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id={`gambling-mode-${merchantId}`}
            checked={isEnabled}
            onCheckedChange={handleToggleGamblingMode}
            disabled={isLoading}
            className="data-[state=checked]:bg-amber-500"
          />
          <Label htmlFor={`gambling-mode-${merchantId}`} className="cursor-pointer">
            {isEnabled ? "Enabled" : "Disabled"}
          </Label>
        </div>
      </div>
      
      {isEnabled && (
        <div className="pl-11 text-xs text-muted-foreground">
          <ul className="list-disc space-y-1 pl-5">
            <li>Using obfuscated UPI descriptors</li>
            <li>Rotating payout endpoints</li>
            <li>Hiding sensitive transaction logs</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default MerchantGamblingSwitch;
