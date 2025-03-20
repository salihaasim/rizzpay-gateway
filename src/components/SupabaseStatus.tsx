
import React, { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { checkSupabaseConnection } from '@/utils/supabaseClient';

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
  }, []);

  if (isChecking) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground animate-pulse">
        <AlertCircle className="h-4 w-4" />
        <span>Checking Supabase connection...</span>
      </div>
    );
  }

  if (isConnected) {
    return (
      <div className="flex items-center gap-2 text-sm text-emerald-500">
        <CheckCircle className="h-4 w-4" />
        <span>Connected to Supabase</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-sm text-red-500">
      <AlertCircle className="h-4 w-4" />
      <span>Not connected to Supabase</span>
    </div>
  );
};

export default SupabaseStatus;
