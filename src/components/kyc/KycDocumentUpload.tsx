
import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FileUp, FileCheck, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { useMerchantAuth } from '@/stores/merchantAuthStore';

interface KycDocumentUploadProps {
  onDocumentsChange: (documents: KycDocuments) => void;
}

export interface KycDocuments {
  aadhaarCard: File | null;
  panCard: File | null;
}

const KycDocumentUpload: React.FC<KycDocumentUploadProps> = ({ onDocumentsChange }) => {
  const { currentMerchant } = useMerchantAuth();
  const [documents, setDocuments] = useState<KycDocuments>({
    aadhaarCard: null,
    panCard: null
  });
  
  const [existingDocuments, setExistingDocuments] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch existing documents
  useEffect(() => {
    const fetchExistingDocuments = async () => {
      if (!currentMerchant?.id) return;
      
      try {
        const { data, error } = await supabase
          .from('kyc_submissions')
          .select('aadhaar_document_path, pan_document_path')
          .eq('user_id', currentMerchant.id)
          .maybeSingle();
          
        if (error) throw error;
        
        if (data) {
          const docs: Record<string, string> = {};
          
          if (data.aadhaar_document_path) {
            docs.aadhaarCard = data.aadhaar_document_path.split('/').pop() || '';
          }
          
          if (data.pan_document_path) {
            docs.panCard = data.pan_document_path.split('/').pop() || '';
          }
          
          setExistingDocuments(docs);
        }
      } catch (error) {
        console.error('Error fetching existing documents:', error);
      }
    };
    
    fetchExistingDocuments();
  }, [currentMerchant?.id]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, docType: keyof KycDocuments) => {
    const file = event.target.files?.[0] || null;
    
    // Validate file
    if (file) {
      // Check file type
      const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
      if (!validTypes.includes(file.type)) {
        setErrors(prev => ({ 
          ...prev, 
          [docType]: 'Invalid file type. Please upload a JPEG, PNG, or PDF file.' 
        }));
        return;
      }
      
      // Check file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ 
          ...prev, 
          [docType]: 'File size exceeds 5MB limit. Please upload a smaller file.' 
        }));
        return;
      }
      
      // Clear error if previously set
      if (errors[docType]) {
        setErrors(prev => {
          const newErrors = {...prev};
          delete newErrors[docType];
          return newErrors;
        });
      }
    }
    
    const updatedDocuments = { ...documents, [docType]: file };
    setDocuments(updatedDocuments);
    onDocumentsChange(updatedDocuments);
  };

  return (
    <div className="space-y-6 border rounded-lg p-6 bg-card">
      <div className="text-lg font-medium">KYC Documents</div>
      <p className="text-sm text-muted-foreground mb-4">
        Please upload clear copies of the following documents to verify your identity and business.
      </p>
      
      <div className="space-y-4">
        {/* Aadhaar Card Upload */}
        <div>
          <Label htmlFor="aadhaarCard" className="block mb-2">
            Aadhaar Card <span className="text-destructive">*</span>
          </Label>
          <div className="flex flex-col space-y-2">
            <Input
              id="aadhaarCard"
              type="file"
              accept=".jpg,.jpeg,.png,.pdf"
              onChange={(e) => handleFileChange(e, 'aadhaarCard')}
              className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
            />
            {documents.aadhaarCard && (
              <div className="flex items-center mt-2 text-sm text-emerald-600">
                <FileCheck className="w-4 h-4 mr-1" />
                <span>{documents.aadhaarCard.name}</span>
              </div>
            )}
            {existingDocuments.aadhaarCard && !documents.aadhaarCard && (
              <div className="flex items-center mt-2 text-sm text-blue-600">
                <FileCheck className="w-4 h-4 mr-1" />
                <span>Previously uploaded: {existingDocuments.aadhaarCard}</span>
              </div>
            )}
            {errors.aadhaarCard && (
              <Alert variant="destructive" className="py-2">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{errors.aadhaarCard}</AlertDescription>
              </Alert>
            )}
          </div>
        </div>
        
        {/* PAN Card Upload */}
        <div>
          <Label htmlFor="panCard" className="block mb-2">
            PAN Card <span className="text-destructive">*</span>
          </Label>
          <div className="flex flex-col space-y-2">
            <Input
              id="panCard"
              type="file"
              accept=".jpg,.jpeg,.png,.pdf"
              onChange={(e) => handleFileChange(e, 'panCard')}
              className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
            />
            {documents.panCard && (
              <div className="flex items-center mt-2 text-sm text-emerald-600">
                <FileCheck className="w-4 h-4 mr-1" />
                <span>{documents.panCard.name}</span>
              </div>
            )}
            {existingDocuments.panCard && !documents.panCard && (
              <div className="flex items-center mt-2 text-sm text-blue-600">
                <FileCheck className="w-4 h-4 mr-1" />
                <span>Previously uploaded: {existingDocuments.panCard}</span>
              </div>
            )}
            {errors.panCard && (
              <Alert variant="destructive" className="py-2">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{errors.panCard}</AlertDescription>
              </Alert>
            )}
          </div>
        </div>
      </div>
      
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-md mt-4">
        <p className="text-sm text-amber-800">
          <strong>Note:</strong> All documents must be valid, clearly visible, and not exceed 5MB in size. 
          Acceptable formats are JPG, PNG, and PDF.
        </p>
      </div>
    </div>
  );
};

export default KycDocumentUpload;
