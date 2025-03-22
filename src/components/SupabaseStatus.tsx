
import React, { useEffect, useState, useCallback } from 'react';
import { AlertCircle, CheckCircle, Database } from 'lucide-react';
import { checkSupabaseConnection } from '@/utils/supabaseClient';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const SupabaseStatus: React.FC = () => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  // Use useCallback to prevent recreating this function on every render
  const checkConnection = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    // Only check connection once on mount, not on every render
    checkConnection();
    
    // Cleanup function is empty because we're only checking once
    return () => {};
  }, [checkConnection]);

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

export default React.memo(SupabaseStatus);
