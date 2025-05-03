
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { FileUp, IdCard, UserCheck, Check, X } from "lucide-react";
import { useMerchantAuth } from '@/stores/merchantAuthStore';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import KycDocumentUpload from './KycDocumentUpload';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const kycFormSchema = z.object({
  gstNumber: z.string().optional(),
});

type KycFormValues = z.infer<typeof kycFormSchema>;

const KycUploadForm: React.FC = () => {
  const { currentMerchant } = useMerchantAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [existingKyc, setExistingKyc] = useState<any>(null);
  
  const form = useForm<KycFormValues>({
    resolver: zodResolver(kycFormSchema),
    defaultValues: {
      gstNumber: '',
    },
  });

  // Fetch existing KYC submission if any
  useEffect(() => {
    const fetchExistingKyc = async () => {
      if (!currentMerchant?.id) return;
      
      try {
        const { data, error } = await supabase
          .from('kyc_submissions')
          .select('*')
          .eq('user_id', currentMerchant.id)
          .maybeSingle();
          
        if (error) throw error;
        
        if (data) {
          setExistingKyc(data);
          setIsSubmitted(data.status !== 'rejected');
          form.setValue('gstNumber', data.gst_number || '');
        }
      } catch (error) {
        console.error('Error fetching KYC data:', error);
      }
    };
    
    fetchExistingKyc();
  }, [currentMerchant?.id]);

  const onSubmit = async (data: KycFormValues) => {
    if (!currentMerchant?.id) {
      toast.error('You must be logged in to submit KYC verification');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Get the document paths from existing KYC if available
      const documentPaths = {
        aadhaar_document_path: existingKyc?.aadhaar_document_path || null,
        pan_document_path: existingKyc?.pan_document_path || null,
        gst_document_path: existingKyc?.gst_document_path || null,
      };
            
      // Submit to Supabase
      const { error } = await supabase
        .from('kyc_submissions')
        .upsert({
          user_id: currentMerchant.id,
          gst_number: data.gstNumber || null,
          status: 'pending',
          updated_at: new Date().toISOString(),
          ...documentPaths
        });
      
      if (error) throw error;
      
      toast.success('KYC information submitted successfully');
      setIsSubmitted(true);
    } catch (error: any) {
      console.error('Error submitting KYC:', error);
      toast.error(error.message || 'Failed to submit KYC information');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDocumentsChange = async (documents: any) => {
    if (!currentMerchant?.id) return;
    
    setIsLoading(true);
    
    try {
      const documentPaths: Record<string, string | null> = {
        aadhaar_document_path: null,
        pan_document_path: null,
        gst_document_path: null
      };
      
      // Upload each document to Supabase storage
      for (const [key, file] of Object.entries(documents)) {
        if (!file) continue;
        
        const fileKey = key as keyof typeof documents;
        const fileName = `${currentMerchant.id}/${fileKey}_${Date.now()}`;
        
        const { data, error } = await supabase.storage
          .from('kyc_documents')
          .upload(fileName, file);
          
        if (error) throw error;
        
        // Convert document key to path field name
        const pathKey = `${fileKey.toLowerCase()}_document_path`;
        documentPaths[pathKey] = fileName;
      }
      
      // Update KYC submission with new document paths
      const { error } = await supabase
        .from('kyc_submissions')
        .upsert({
          user_id: currentMerchant.id,
          ...documentPaths,
          status: 'pending',
          updated_at: new Date().toISOString()
        });
        
      if (error) throw error;
      
      toast.success('Documents uploaded successfully');
    } catch (error: any) {
      console.error('Error uploading documents:', error);
      toast.error(error.message || 'Failed to upload documents');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {isSubmitted && existingKyc?.status !== 'rejected' ? (
        <Alert className="bg-green-50 border-green-200">
          <Check className="h-5 w-5 text-green-600" />
          <AlertDescription>
            Your KYC verification has been submitted and is {existingKyc?.status === 'approved' ? 'approved' : 'pending approval'}. 
            {existingKyc?.status === 'pending' && ' We will review your documents and update your status.'}
          </AlertDescription>
        </Alert>
      ) : (
        <>
          {/* Document Upload Component */}
          <KycDocumentUpload onDocumentsChange={handleDocumentsChange} />
          
          {/* Business Details Form */}
          <div className="space-y-4 border rounded-lg p-6 bg-card">
            <div className="flex items-center space-x-2">
              <UserCheck className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-medium">Business Details</h3>
            </div>
            <Separator />
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="gstNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>GST Number <span className="text-muted-foreground text-sm">(if applicable)</span></FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter your GST Number" 
                          {...field} 
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="mt-4 w-full sm:w-auto"
                  disabled={isLoading}
                >
                  Submit for Verification
                </Button>
                <p className="mt-2 text-sm text-muted-foreground">
                  Your documents will be reviewed within 1-2 business days.
                </p>
              </form>
            </Form>
          </div>
        </>
      )}
    </div>
  );
};

export default KycUploadForm;
