
import React, { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle, Database } from 'lucide-react';
import { checkSupabaseConnection } from '@/utils/supabaseClient';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const SupabaseStatus: React.FC = () => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(true);
  const [errorCount, setErrorCount] = useState(0);

  useEffect(() => {
    const checkConnection = async () => {
      // Only actively check if we haven't had too many errors
      if (errorCount > 3) {
        setIsConnected(false);
        setIsChecking(false);
        return;
      }
      
      setIsChecking(true);
      try {
        const connected = await checkSupabaseConnection();
        setIsConnected(connected);
        if (!connected) {
          setErrorCount(prev => prev + 1);
        } else {
          setErrorCount(0); // Reset error count on success
        }
      } catch (error) {
        console.error('Error checking Supabase connection:', error);
        setIsConnected(false);
        setErrorCount(prev => prev + 1);
      } finally {
        setIsChecking(false);
      }
    };

    checkConnection();
    
    // Check less frequently if there are errors to prevent excessive refreshing
    const interval = setInterval(
      checkConnection, 
      errorCount > 0 ? 30 * 60 * 1000 : 5 * 60 * 1000
    );
    
    return () => clearInterval(interval);
  }, [errorCount]);

  if (isChecking && isConnected === null) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Database className="h-4 w-4" />
        <span>Checking Supabase...</span>
      </div>
    );
  }

  if (isConnected) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-2 text-sm text-emerald-500 cursor-help">
              <CheckCircle className="h-4 w-4" />
              <span>Supabase Connected</span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Successfully connected to Supabase</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-2 text-sm text-amber-500 cursor-help">
            <AlertCircle className="h-4 w-4" />
            <span>Supabase Offline (Offline Mode)</span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Connection to Supabase is currently unavailable. Operating in offline mode.</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default SupabaseStatus;
