
import React, { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle, Database } from 'lucide-react';
import { checkSupabaseConnection } from '@/utils/supabaseClient';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const SupabaseStatus: React.FC = () => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkConnection = async () => {
      setIsChecking(true);
      try {
        const connected = await checkSupabaseConnection();
        setIsConnected(connected);
      } catch (error) {
        console.error('Error checking Supabase connection:', error);
        setIsConnected(false);
      } finally {
        setIsChecking(false);
      }
    };

    checkConnection();
    
    // Re-check connection every 5 minutes
    const interval = setInterval(checkConnection, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (isChecking) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground animate-pulse">
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
          <div className="flex items-center gap-2 text-sm text-red-500 cursor-help">
            <AlertCircle className="h-4 w-4" />
            <span>Supabase Offline</span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Could not connect to Supabase. Please check your credentials.</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default SupabaseStatus;
