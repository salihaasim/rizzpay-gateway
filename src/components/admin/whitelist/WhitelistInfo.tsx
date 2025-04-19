
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ShieldCheck, Info } from "lucide-react";

export const WhitelistInfo = () => {
  return (
    <Alert className="mb-6 border-blue-200 bg-blue-50">
      <ShieldCheck className="h-5 w-5 text-blue-600" />
      <AlertTitle className="text-blue-800">Access Control Information</AlertTitle>
      <AlertDescription className="text-blue-700">
        <p className="mb-2">
          Whitelisting restricts API access to verified sources only. Both IP addresses and webhook domains 
          must be associated with a specific merchant account.
        </p>
        <p className="flex items-start gap-1 text-sm">
          <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <span>
            IP whitelisting ensures only authorized servers can access the API, while domain whitelisting 
            ensures webhooks are only sent to verified endpoints. All changes are logged for audit purposes.
          </span>
        </p>
      </AlertDescription>
    </Alert>
  );
};
