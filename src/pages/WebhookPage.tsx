
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTransactionStore } from '@/stores/transactionStore';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import WebhookIntegration from '@/components/webhook/WebhookIntegration';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { regenerateApiKey } from '@/utils/merchantApiUtils';
import { Navigate } from 'react-router-dom';

const WebhookPage: React.FC = () => {
  const { userEmail } = useTransactionStore();
  const [isLoading, setIsLoading] = useState(true);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [isRegenerating, setIsRegenerating] = useState(false);
  
  // Redirect to the new Developer Integration page
  return <Navigate to="/developers" replace />;
};

export default WebhookPage;
