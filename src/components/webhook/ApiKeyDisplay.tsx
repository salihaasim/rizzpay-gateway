
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CopyIcon, RefreshCw, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

interface ApiKeyDisplayProps {
  apiKey: string | null;
  onRegenerateApiKey?: () => void;
  isRegenerating?: boolean;
}

const ApiKeyDisplay: React.FC<ApiKeyDisplayProps> = ({
  apiKey,
  onRegenerateApiKey,
  isRegenerating = false
}) => {
  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        toast.success(`Copied ${field} to clipboard`);
      },
      (err) => {
        console.error('Could not copy text: ', err);
        toast.error(`Failed to copy ${field}`);
      }
    );
  };

  if (!apiKey) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />
            API Key Not Available
          </CardTitle>
          <CardDescription>
            We couldn't retrieve or generate your API key
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            No API key found. Please contact support to get your API key or refresh the page to generate one.
          </p>
          
          {onRegenerateApiKey && (
            <Button 
              onClick={onRegenerateApiKey}
              disabled={isRegenerating}
              className="mt-4"
            >
              {isRegenerating ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Generate API Key
                </>
              )}
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your API Key</CardTitle>
        <CardDescription>
          Use this key to authenticate your webhook requests
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between p-3 bg-secondary rounded-md">
          <code className="text-sm font-mono break-all">{apiKey}</code>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => copyToClipboard(apiKey, 'API Key')}
          >
            <CopyIcon className="h-4 w-4" />
            <span className="sr-only">Copy API Key</span>
          </Button>
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          Keep this API key secret. Never share it or include it in client-side code.
        </p>
      </CardContent>
    </Card>
  );
};

export default ApiKeyDisplay;
