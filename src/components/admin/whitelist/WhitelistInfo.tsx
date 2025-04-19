
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ShieldCheck } from "lucide-react";

export const WhitelistInfo = () => {
  return (
    <Alert className="mb-6">
      <ShieldCheck className="h-5 w-5" />
      <AlertTitle>Access Control Information</AlertTitle>
      <AlertDescription>
        Whitelisting restricts API access to verified sources only. IP addresses and webhook domains can only be 
        added for merchants with completed KYC verification. All changes are logged for audit purposes.
      </AlertDescription>
    </Alert>
  );
};
