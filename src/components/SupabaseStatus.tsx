
import React, { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle, Database } from 'lucide-react';
import { checkSupabaseConnection } from '@/utils/supabaseClient';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const SupabaseStatus: React.FC = () => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    let isMounted = true;
    
    const checkConnection = async () => {
      if (!isMounted) return;
      
      setIsChecking(true);
      try {
        const connected = await checkSupabaseConnection();
        if (isMounted) {
          setIsConnected(connected);
        }
      } catch (error) {
        if (isMounted) {
          setIsConnected(false);
        }
      } finally {
        if (isMounted) {
          setIsChecking(false);
        }
      }
    };

    checkConnection();
    
    // Check connection only once on mount, not periodically
    // This prevents continuous API calls that might cause refreshes
    
    return () => {
      isMounted = false;
    };
  }, []);

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
